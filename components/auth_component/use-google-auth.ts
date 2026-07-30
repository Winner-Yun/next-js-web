"use client";

import { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { joinWorkspaceInvite } from "@/lib/invite";

const BACKEND_AUTH_URL = "/api/auth/google/callback";

export function useGoogleAuth() {
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

      // Save the access token only — refresh tokens are never persisted
      // client-side for security.
      localStorage.setItem("accessToken", data.access_token);

      // If the user arrived via an invite link, finish joining that
      // workspace now that we have a token, before landing on the dashboard.
      const pendingInviteCode = sessionStorage.getItem("pendingInviteCode");
      if (pendingInviteCode) {
        sessionStorage.removeItem("pendingInviteCode");
        const joinResult = await joinWorkspaceInvite(
          pendingInviteCode,
          data.access_token,
        );
        if (joinResult.ok) {
          toast.success("You've joined the workspace.");
        } else {
          toast.error(joinResult.detail);
        }
      }

      // Set a flag in sessionStorage to show the dashboard splash screen
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
