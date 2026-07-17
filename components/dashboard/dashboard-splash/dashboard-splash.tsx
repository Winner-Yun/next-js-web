/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { AzureBackground } from "@/components/ui/azureBackground";
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
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-9999 flex items-center justify-center"
          >
            {/* Background Layer */}
            <div className="absolute inset-0 -z-10">
              <AzureBackground />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                }}
              >
                <Image
                  src="/worksmart.png"
                  alt="WorkSmart"
                  width={90}
                  height={90}
                  priority
                />
              </motion.div>

              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-black tracking-wide text-white"
              >
                Work
                <span className="text-blue-500">Smart</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                }}
                className="text-sm tracking-[0.3em] uppercase text-slate-400"
              >
                Preparing Workspace
              </motion.p>

              {/* Updated Progress Bar */}
              <div className="flex h-1 w-52 justify-start overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2.2, // Matches the timeout exactly
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
