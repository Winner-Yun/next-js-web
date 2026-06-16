import { cn } from "@/lib/utils";
import React from "react";
import { createPortal } from "react-dom";

// A safe way to detect client-side rendering without triggering cascading render linter rules
const emptySubscribe = () => () => {};
function useIsMounted() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function Portal({ className, ...props }: React.ComponentProps<"div">) {
  const isMounted = useIsMounted();

  React.useEffect(() => {
    // Safeguard to ensure window/document exists
    if (typeof window === "undefined" || !document.body) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []); // This effect now ONLY handles DOM manipulation, no state setting!

  // Return null on the server or before mounting to prevent hydration errors
  if (!isMounted || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={cn("fixed inset-0 isolate z-40 flex flex-col", className)}
      {...props}
    />,
    document.body,
  );
}

function PortalBackdrop({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-1 bg-background/95 backdrop-blur-sm duration-500 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 supports-backdrop-filter:bg-background/60",
        className,
      )}
      {...props}
    />
  );
}

export { Portal, PortalBackdrop };
