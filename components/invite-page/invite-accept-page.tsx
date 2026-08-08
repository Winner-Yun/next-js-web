/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AzureBackground } from "@/components/ui/azureBackground";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import { GoogleAuthButton } from "@/components/welcome-page/google-auth-button";
import { joinWorkspaceInvite } from "@/lib/invite";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

type JoinState =
  | "checking"
  | "needs-login"
  | "ready"
  | "joining"
  | "success"
  | "error";

type Account = {
  name: string;
  email: string;
  avatar?: string;
};

const STATE_MESSAGE: Record<JoinState, string> = {
  checking: "Checking your invite...",
  "needs-login": "Sign in with Google to accept this invite.",
  ready: "Confirm you'd like to join this workspace.",
  joining: "Joining the workspace...",
  success: "You're in! Taking you to your dashboard...",
  error: "We couldn't accept this invite.",
};

function InviteAcceptContent({ code }: { code: string }) {
  const router = useRouter();
  const [state, setState] = useState<JoinState>("checking");
  const [errorDetail, setErrorDetail] = useState("");
  const [account, setAccount] = useState<Account | null>(null);

  const loadAccount = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load profile");

      const data = await res.json();
      setAccount({ name: data.name, email: data.email, avatar: data.avatar });
      setState("ready");
    } catch {
      // Token is stale/invalid — fall back to asking the user to sign in.
      localStorage.removeItem("accessToken");
      setAccount(null);
      setState("needs-login");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setState("needs-login");
      return;
    }
    loadAccount(token);
  }, [loadAccount]);

  const handleJoin = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setState("needs-login");
      return;
    }

    setState("joining");
    const result = await joinWorkspaceInvite(code, token);

    if (!result.ok) {
      setState("error");
      setErrorDetail(result.detail);
      return;
    }

    setState("success");
    sessionStorage.setItem("showDashboardSplash", "true");
    setTimeout(() => router.push("/dashboard"), 1000);
  };

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

            <div className="mt-8 flex flex-col items-center gap-3">
              {(state === "checking" || state === "joining") && (
                <div className="flex h-12 w-full items-center justify-center rounded-xl border border-border/50 bg-background/50">
                  <Loader2Icon className="size-5 animate-spin text-brand" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {state === "checking" ? "Checking..." : "Joining..."}
                  </span>
                </div>
              )}

              {state === "needs-login" && (
                <div className="grid w-full grid-cols-1 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
                  <GoogleAuthButton
                    className="h-12 w-full cursor-pointer rounded-xl border-2 border-brand bg-background/80 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-brand/10 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                    onLoginSuccess={loadAccount}
                    variant="outline"
                  >
                    <GoogleIcon className="mr-2 size-4 shrink-0" />
                    Continue with Google to Join
                  </GoogleAuthButton>
                </div>
              )}

              {state === "ready" && account && (
                <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-colors">
                    <Avatar size="lg">
                      <AvatarImage src={account.avatar} alt={account.name} />
                      <AvatarFallback>
                        {account.name?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium">
                        {account.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {account.email}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="h-12 w-full cursor-pointer rounded-xl bg-brand text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                    onClick={handleJoin}
                  >
                    Join workspace
                  </Button>

                  <div className="flex justify-center">
                    <GoogleAuthButton
                      className="h-auto cursor-pointer bg-transparent p-1 text-xs font-normal text-muted-foreground underline underline-offset-2 transition-colors hover:bg-transparent hover:text-foreground"
                      onLoginSuccess={loadAccount}
                      variant="link"
                    >
                      Not you? Choose a different Google account
                    </GoogleAuthButton>
                  </div>
                </div>
              )}

              {state === "success" && (
                <div className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-600 animate-in fade-in zoom-in-95 duration-300 ease-out dark:text-emerald-400">
                  <CheckCircle2Icon className="size-4.5" />
                  Joined successfully
                </div>
              )}

              {state === "error" && (
                <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
                  <div className="flex w-full items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <XCircleIcon className="size-4.5 shrink-0" />
                    {errorDetail}
                  </div>
                  {account && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                        onClick={() => setState("ready")}
                        variant="outline"
                      >
                        Try again
                      </Button>
                      <GoogleAuthButton
                        className="w-full cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                        onLoginSuccess={loadAccount}
                        variant="ghost"
                      >
                        Switch account
                      </GoogleAuthButton>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-[0.7rem] leading-relaxed text-muted-foreground">
              By continuing, you agree to WorkSmart&apos;s{" "}
              <Link
                className="text-brand underline underline-offset-2 transition-colors hover:text-brand/80"
                href="/terms-of-service"
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                className="text-brand underline underline-offset-2 transition-colors hover:text-brand/80"
                href="/privacy-policy"
                target="_blank"
              >
                Privacy Policy
              </Link>
              .
            </p>
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
