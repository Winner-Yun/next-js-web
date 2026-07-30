/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AzureBackground } from "@/components/ui/azureBackground";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import { GoogleAuthButton } from "@/components/welcome-page/google-auth-button";
import { joinWorkspaceInvite } from "@/lib/invite";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

type JoinState = "checking" | "needs-login" | "joining" | "success" | "error";

const STATE_MESSAGE: Record<JoinState, string> = {
  checking: "Checking your invite...",
  "needs-login": "Sign in with Google to accept this invite.",
  joining: "Joining the workspace...",
  success: "You're in! Taking you to your dashboard...",
  error: "We couldn't accept this invite.",
};

function InviteAcceptContent({ code }: { code: string }) {
  const router = useRouter();
  const [state, setState] = useState<JoinState>("checking");
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // Picked up by useGoogleAuth once sign-in completes, so the invite
      // is accepted right after login instead of requiring a second click.
      sessionStorage.setItem("pendingInviteCode", code);
      setState("needs-login");
      return;
    }

    let cancelled = false;

    (async () => {
      setState("joining");
      const result = await joinWorkspaceInvite(code, token);

      if (cancelled) return;

      if (!result.ok) {
        setState("error");
        setErrorDetail(result.detail);
        return;
      }

      setState("success");
      sessionStorage.setItem("showDashboardSplash", "true");
      setTimeout(() => router.push("/dashboard"), 1000);
    })();

    return () => {
      cancelled = true;
    };
  }, [code, router]);

  return (
    <AzureBackground>
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
        <Particles
          className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-60"
          color="#0088ff"
          ease={25}
          quantity={120}
        />

        <div className="relative z-10 w-full max-w-md px-4">
          <div className="rounded-3xl border border-border/50 bg-card/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                alt="WorkSmart logo"
                height={72}
                src="/worksmart.png"
                style={{ width: "auto", height: "auto" }}
                width={72}
              />

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Workspace{" "}
                  <span className="bg-linear-to-r from-brand to-cyan-400 bg-clip-text text-transparent">
                    Invite
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  {STATE_MESSAGE[state]}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Invite code
              </label>
              <Input
                className="h-10 text-center font-mono text-sm tracking-widest"
                readOnly
                value={code}
              />
            </div>

            <div className="mt-8 flex justify-center">
              {(state === "checking" || state === "joining") && (
                <div className="flex h-12 w-full items-center justify-center rounded-xl border border-border/50 bg-background/50">
                  <Loader2Icon className="size-5 animate-spin text-brand" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {state === "checking" ? "Checking..." : "Joining..."}
                  </span>
                </div>
              )}

              {state === "needs-login" && (
                <GoogleAuthButton
                  className="h-12 w-full rounded-xl border-2 border-brand bg-background/80 text-sm font-semibold text-foreground hover:bg-brand/10"
                  variant="outline"
                >
                  <GoogleIcon className="mr-2 size-4 shrink-0" />
                  Continue with Google to Join
                </GoogleAuthButton>
              )}

              {state === "success" && (
                <div className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2Icon className="size-4.5" />
                  Joined successfully
                </div>
              )}

              {state === "error" && (
                <div className="flex w-full items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <XCircleIcon className="size-4.5 shrink-0" />
                  {errorDetail}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </AzureBackground>
  );
}

export function InviteAcceptPage({ code }: { code: string }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <InviteAcceptContent code={code} />
    </GoogleOAuthProvider>
  );
}
