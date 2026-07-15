"use client";

import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

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
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const refreshRes = await originalFetch("/api/auth/refresh-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (refreshRes.ok) {
              const data = await refreshRes.json();

              localStorage.setItem("accessToken", data.access_token);
              if (data.refresh_token) {
                localStorage.setItem("refreshToken", data.refresh_token);
              }

              headers.set("Authorization", `Bearer ${data.access_token}`);
              response = await originalFetch(url, { ...options, headers });
            } else {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
          }
        } else {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }

      return response;
    };
  }, []);

  return <>{children}</>;
}
