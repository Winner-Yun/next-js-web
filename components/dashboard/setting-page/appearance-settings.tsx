/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering the theme states after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a sleek empty state or skeleton while mounting to prevent layout shift
    return <div className="animate-pulse h-75 w-full bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-foreground">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how WorkSmart looks on your device.
        </p>
      </div>

      <div className="w-full h-px bg-muted/60" />

      <div className="space-y-3 max-w-xl">
        <label className="text-sm font-semibold text-foreground block">
          Theme Preference
        </label>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center justify-center gap-3 h-28 border rounded-xl transition-all duration-200 ${
              theme === "light"
                ? "border-brand bg-brand/5 ring-1 ring-brand/30 shadow-sm"
                : "border-muted/60 hover:bg-muted/30 hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <SunIcon
              className={`size-7 ${theme === "light" ? "text-brand" : ""}`}
            />
            <span
              className={`text-xs font-semibold ${theme === "light" ? "text-brand" : ""}`}
            >
              Light
            </span>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center justify-center gap-3 h-28 border rounded-xl transition-all duration-200 ${
              theme === "dark"
                ? "border-brand bg-brand/5 ring-1 ring-brand/30 shadow-sm"
                : "border-muted/60 hover:bg-muted/30 hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <MoonIcon
              className={`size-7 ${theme === "dark" ? "text-brand" : ""}`}
            />
            <span
              className={`text-xs font-semibold ${theme === "dark" ? "text-brand" : ""}`}
            >
              Dark
            </span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center justify-center gap-3 h-28 border rounded-xl transition-all duration-200 ${
              theme === "system"
                ? "border-brand bg-brand/5 ring-1 ring-brand/30 shadow-sm"
                : "border-muted/60 hover:bg-muted/30 hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <MonitorIcon
              className={`size-7 ${theme === "system" ? "text-brand" : ""}`}
            />
            <span
              className={`text-xs font-semibold ${theme === "system" ? "text-brand" : ""}`}
            >
              System
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
