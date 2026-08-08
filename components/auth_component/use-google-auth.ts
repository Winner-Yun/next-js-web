"use client";

import { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BACKEND_AUTH_URL = "/api/auth/google/callback";

interface UseGoogleAuthOptions {
  onLoginSuccess?: (accessToken: string) => void | Promise<void>;
}

export function useGoogleAuth(options?: UseGoogleAuthOptions) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      setErrorMsg("Google did not return an ID token.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(BACKEND_AUTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

      localStorage.setItem("accessToken", data.access_token);

      if (options?.onLoginSuccess) {
        await options.onLoginSuccess(data.access_token);
        return;
      }

      sessionStorage.setItem("showDashboardSplash", "true");

      router.push("/dashboard");
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Google login was unsuccessful or canceled.");
  };

  return { isLoading, errorMsg, handleGoogleSuccess, handleGoogleError };
}
