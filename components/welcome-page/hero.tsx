"use client";

import { GoogleIcon } from "@/components/ui/google-icon";
import { GoogleAuthButton } from "@/components/welcome-page/google-auth-button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, RocketIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Product screenshot accent — anchored right, faded into the grid behind it */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 -right-0.5 w-[85%] max-w-4xl opacity-70 blur-[2px] mask-[linear-gradient(to_left,black_50%,transparent_95%)] dark:opacity-90 md:w-[65%]"
      >
        <Image
          alt=""
          className="object-cover object-top-left dark:hidden"
          fill
          sizes="100vw"
          src="/backgroud_demo_light.png"
        />
        <Image
          alt=""
          className="hidden object-cover object-top-left dark:block"
          fill
          sizes="65vw"
          src="/backgroud_demo_dark.png"
        />
      </div>

      <section id="hero" className="relative mx-auto w-full max-w-5xl">
        {/* Top Shades */}
        <div
          aria-hidden="true"
          className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
        >
          <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,--theme(--color-foreground/.08),transparent)] contain-strict" />
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col items-center justify-center gap-6 pt-32 pb-30">
          {/* Top Pill Badge */}
          <a
            className={cn(
              "group mx-auto flex w-fit items-center gap-3 rounded-full border border-border/50 bg-muted/30 px-4 py-1.5 backdrop-blur-sm transition-all hover:bg-muted/50",
              "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-500 duration-500 ease-out",
            )}
            href="#about"
          >
            <RocketIcon className="size-4 text-brand" />
            <span className="text-sm font-medium text-muted-foreground">
              Smart Attendance management system
            </span>
            <span className="block h-4 w-px bg-border" />
            <ArrowRightIcon className="size-4 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </a>

          {/* Headline */}
          <h1
            className={cn(
              "fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center text-5xl font-bold tracking-tight delay-100 duration-500 ease-out md:text-6xl lg:text-7xl",
              "text-shadow-[0_0px_50px_theme(--color-foreground/.2)]",
            )}
          >
            Work Smart. <br />
            <span className="bg-linear-to-r from-brand to-brand-cyan-400 bg-clip-text text-transparent">
              Smart Attendance.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-lg animate-in fill-mode-backwards text-center text-lg text-muted-foreground tracking-wide delay-200 duration-500 ease-out md:text-xl md:leading-relaxed">
            An intelligent workspace management system with automated attendance
            tracking and face recognition.
          </p>

          {/* Call to Actions */}
          <div className="fade-in slide-in-from-bottom-10 flex animate-in flex-col sm:flex-row flex-wrap items-center justify-center gap-4 fill-mode-backwards pt-6 delay-300 duration-500 ease-out">
            <motion.div
              className="relative inline-flex rounded-full"
              animate={{
                boxShadow: [
                  "0 0 0px 0px rgba(0,136,255,0), 0 0 0px 0px rgba(0,136,255,0)",
                  "0 0 18px 3px rgba(0,136,255,0.9), 0 0 55px 16px rgba(0,136,255,0.5)",
                  "0 0 0px 0px rgba(0,136,255,0), 0 0 0px 0px rgba(0,136,255,0)",
                ],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Ambient bloom — draws the eye to the one action that takes you to the dashboard */}
              <motion.div
                aria-hidden="true"
                animate={{ scale: [1, 1.25, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle,rgba(0,136,255,0.65),transparent_70%)] blur-2xl"
              />

              {/* Rim glow — traces the outline so the border itself feels lit */}
              <motion.div
                aria-hidden="true"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -inset-1 -z-10 rounded-full border-2 border-brand blur-[3px]"
              />

              <GoogleAuthButton
                className="rounded-full cursor-pointer border-2 border-brand bg-background/80 px-8 py-6 text-base font-semibold text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-brand/10 hover:shadow-xl hover:-translate-y-0.5"
                size="lg"
                variant="outline"
              >
                <GoogleIcon className="mr-2 size-4 shrink-0" />
                Continue with Google <ArrowRightIcon className="ml-2 size-4" />
              </GoogleAuthButton>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
