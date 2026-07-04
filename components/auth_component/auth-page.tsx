"use client";

import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useMeasure from "react-use-measure";

import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

import { AzureBackground } from "@/components/ui/azureBackground";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Particles } from "@/components/ui/particles";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const BACKEND_AUTH_URL = "/api/auth/google/callback";

function AuthContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [buttonRef, buttonBounds] = useMeasure();
  const googleButtonWidth = Math.max(320, Math.round(buttonBounds.width || 0));

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

      // Save your backend JWTs
      localStorage.setItem("accessToken", data.access_token);

      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }
      // Set a flag in sessionStorage to show the dashboard splash screen
      sessionStorage.setItem("showDashboardSplash", "true");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AzureBackground>
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
        {/* Particles */}
        <Particles
          className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-60"
          color="#0088ff"
          ease={25}
          quantity={120}
        />

        {/* Glow animation */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            -z-10
            size-225
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[radial-gradient(circle,rgba(0,136,255,0.15),transparent_70%)]
          "
        />

        {/* Back button animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute left-6 top-6"
        >
          <Button
            asChild
            variant="ghost"
            className="
            group rounded-xl
            text-muted-foreground
            hover:bg-muted/50
            "
          >
            <Link href="/">
              <ChevronLeftIcon
                className="
                size-4
                transition-transform
                group-hover:-translate-x-1
                "
              />
              Back home
            </Link>
          </Button>
        </motion.div>

        {/* Card animation */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-4"
        >
          <div
            className="
            rounded-3xl
            border
            border-border/50
            bg-card/60
            backdrop-blur-xl
            p-6
            shadow-2xl
            sm:p-8
            "
          >
            {/* Logo animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <Image
                src="/worksmart.png"
                alt="WorkSmart logo"
                width={90}
                height={90}
                style={{ width: "auto", height: "auto" }}
              />

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome to{" "}
                  <span
                    className="
                    bg-linear-to-r
                    from-brand
                    to-cyan-400
                    bg-clip-text
                    text-transparent
                    "
                  >
                    Work Smart
                  </span>
                </h1>

                <p className="text-sm text-muted-foreground">
                  Sign in or create your account to manage your smart workspace.
                </p>
              </div>
            </motion.div>

            {/* Error Message Display */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Google Button Authentication Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex justify-center"
            >
              {isLoading ? (
                <div className="flex h-12 w-full items-center justify-center rounded-xl border border-border/50 bg-background/50">
                  <Loader2 className="size-5 animate-spin text-brand" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Signing in...
                  </span>
                </div>
              ) : (
                <div
                  ref={buttonRef}
                  className="relative h-12 w-full max-w-sm overflow-hidden rounded-xl"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 w-full justify-center gap-3 rounded-xl border-border/70 bg-background/80 text-sm font-semibold shadow-sm transition-transform hover:bg-background"
                  >
                    <GoogleIcon className="size-4 shrink-0 text-[#4285f4]" />
                    <span>Continue with Google</span>
                  </Button>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      setErrorMsg("Google login was unsuccessful or canceled.")
                    }
                    containerProps={{
                      className:
                        "absolute inset-0 z-20 h-full w-full opacity-0",
                    }}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="signin_with"
                    locale="en"
                    width={String(googleButtonWidth)}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </AzureBackground>
  );
}

// Wrap the main content with the OAuth Provider
export function AuthPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContent />
    </GoogleOAuthProvider>
  );
}
