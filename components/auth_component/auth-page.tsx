"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { GoogleIcon } from "@/components/ui/google-icon";

import { AzureBackground } from "@/components/ui/azureBackground";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";

export function AuthPage() {
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
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
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
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.2,
                duration: 0.4,
              }}
              className="
              flex
              flex-col
              items-center
              gap-5
              text-center
              "
            >
              <Image
                src="/worksmart.png"
                alt="WorkSmart logo"
                width={90}
                height={90}
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

                <p
                  className="
                  text-sm
                  text-muted-foreground
                  "
                >
                  Sign in or create your account to manage your smart workspace.
                </p>
              </div>
            </motion.div>

            {/* Google button animation */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.35,
              }}
              className="mt-8"
            >
              <Button
                asChild
                variant="outline"
                className="
                  relative
                  h-12
                  w-full
                  rounded-xl
                  bg-background/50
                  hover:border-brand/40
                  transition
                "
              >
                <Link href="/dashboard">
                  <GoogleIcon className="absolute left-4 size-5" />
                  Sign in with Google
                </Link>
              </Button>
            </motion.div>

            {/* Terms */}
            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.6,
              }}
              className="
              mt-8
              border-t
              border-border/40
              pt-5
              text-center
              text-xs
              text-muted-foreground
              "
            >
              By continuing, you agree to our{" "}
              <Link href="#" className="underline hover:text-brand">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-brand">
                Privacy Policy
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </main>
    </AzureBackground>
  );
}
