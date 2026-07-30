"use client";

import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    // No refresh tokens are kept in the browser, so an expired session can't
    // be silently renewed — the user is sent back to the welcome screen to
    // sign in again.
    const logout = () => {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    };

    window.fetch = async (url, options = {}) => {
      const token = localStorage.getItem("accessToken");
      const headers = new Headers(options?.headers);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await originalFetch(url, { ...options, headers });

      if (response.status === 401) {
        logout();
      }

      return response;
    };
  }, []);

  return <>{children}</>;
}
