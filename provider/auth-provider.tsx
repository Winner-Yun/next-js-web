"use client";

import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    // Shared across every request that hits a 401 at the same time, so we
    // only ever call /refresh-token once concurrently instead of once per
    // failed request. Every caller awaits the same promise and reuses
    // whatever token it resolves to.
    let refreshPromise: Promise<string | null> | null = null;

    const refreshAccessToken = (): Promise<string | null> => {
      if (refreshPromise) return refreshPromise;

      refreshPromise = (async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return null;

        try {
          const refreshRes = await originalFetch("/api/auth/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!refreshRes.ok) return null;

          const data = await refreshRes.json();
          localStorage.setItem("accessToken", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("refreshToken", data.refresh_token);
          }
          return data.access_token as string;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          return null;
        } finally {
          // Free the slot once this refresh cycle settles so a future
          // 401 (after the new token also expires) can trigger a fresh one.
          refreshPromise = null;
        }
      })();

      return refreshPromise;
    };

    const logout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    };

    window.fetch = async (url, options = {}) => {
      const urlStr = url.toString();

      if (urlStr.includes("/api/auth/refresh-token")) {
        return originalFetch(url, options);
      }

      const token = localStorage.getItem("accessToken");
      const headers = new Headers(options?.headers);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      let response = await originalFetch(url, { ...options, headers });

      if (response.status === 401) {
        const refreshTokenExists = !!localStorage.getItem("refreshToken");

        if (!refreshTokenExists) {
          logout();
          return response;
        }

        // Whether this is the first request to hit 401 or the fifth one
        // arriving in the same instant, they all land on the same promise.
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          response = await originalFetch(url, { ...options, headers });
        } else {
          logout();
        }
      }

      return response;
    };
  }, []);

  return <>{children}</>;
}
