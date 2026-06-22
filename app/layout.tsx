import type { Metadata } from "next"; // 1. Add this import
import { Poppins } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/provider/theme-provider";
import { WorkspaceProvider } from "@/provider/workspace-provider";

export const metadata: Metadata = {
  title: "WorkSmart",
  description: "AI Attendance System",
  icons: {
    icon: "/worksmart.png",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WorkspaceProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
