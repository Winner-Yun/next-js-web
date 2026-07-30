/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function DashboardSplash({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showDashboardSplash") === "true";

    if (!shouldShow) return;

    setShowSplash(true);

    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.removeItem("showDashboardSplash");
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Workspace renders underneath immediately; the splash is just a blurred cover on top */}
      {children}

      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-background/70 backdrop-blur-xl"
          >
            <div className="relative flex size-20 items-center justify-center">
              {/* Loading ring */}
              <div
                aria-hidden="true"
                className="absolute inset-0 animate-spin rounded-full border-4 border-brand/20 border-t-brand"
              />

              <Image
                src="/worksmart.png"
                alt="WorkSmart"
                width={44}
                height={44}
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
