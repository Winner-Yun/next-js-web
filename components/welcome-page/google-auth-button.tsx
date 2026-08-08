"use client";

import { GoogleLogin } from "@react-oauth/google";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import useMeasure from "react-use-measure";
import { toast } from "sonner";

import { useGoogleAuth } from "@/components/auth_component/use-google-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GoogleAuthButtonProps = React.ComponentProps<typeof Button> & {
  onLoginSuccess?: (accessToken: string) => void | Promise<void>;
};

// Wraps `children` in the visible button styling while an invisible
// GoogleLogin overlay (sized to match) handles the real click, so one
// click opens Google sign-in directly — no intermediate page or panel.
export function GoogleAuthButton({
  children,
  className,
  disabled,
  onLoginSuccess,
  ...props
}: GoogleAuthButtonProps) {
  const { isLoading, errorMsg, handleGoogleSuccess, handleGoogleError } =
    useGoogleAuth({ onLoginSuccess });
  const [buttonRef, buttonBounds] = useMeasure();
  const googleButtonWidth = Math.max(80, Math.round(buttonBounds.width || 0));

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg]);

  return (
    <div className="relative inline-flex" ref={buttonRef}>
      <Button
        className={cn("cursor-pointer", className)}
        disabled={disabled || isLoading}
        type="button"
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Waiting...
          </>
        ) : (
          children
        )}
      </Button>

      {!isLoading && (
        <GoogleLogin
          containerProps={{
            className:
              "absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0",
          }}
          onError={handleGoogleError}
          onSuccess={handleGoogleSuccess}
          width={String(googleButtonWidth)}
        />
      )}
    </div>
  );
}
