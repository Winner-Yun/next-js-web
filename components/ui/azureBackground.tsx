"use client";

export function AzureBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div
        className="absolute inset-0 z-0 transition-all duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(128,128,128,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128,128,128,0.15) 1px, transparent 1px),
            radial-gradient(circle 600px at 20% 20%, rgba(99,102,241,0.20), transparent),
            radial-gradient(circle 600px at 80% 80%, rgba(6,182,212,0.18), transparent),
            radial-gradient(circle 500px at 50% 50%, rgba(168,85,247,0.12), transparent)
          `,  
          backgroundSize: "48px 48px, 48px 48px, cover, cover, cover",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
                        