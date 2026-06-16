"use client";

const navLinks = [
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "contact", label: "Contacts" },
];

export function Footer() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer className="w-full max-w-5xl mx-auto px-4 md:px-8 border-t border-border/50 mt-24 pt-12 pb-8">
      {/* Top */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between pb-12">
        {/* Brand */}
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-brand to-brand-cyan-400 bg-clip-text text-transparent">
              Work Smart
            </span>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground/80">
            An intelligent workspace management platform engineered to optimize
            attendance tracking, identity validation, and modern operational
            workflows.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10 md:gap-12">
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap gap-5 text-sm font-medium text-muted-foreground">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="transition-colors hover:text-brand cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/40 pt-6 text-xs text-muted-foreground/90">
        <p>
          &copy; {new Date().getFullYear()} Work Smart Systems. All rights
          reserved.
        </p>

        <p className="inline-flex items-center gap-1">
          <span>Built by the</span>

          <a
            aria-label="Visit Work Smart Team Profile"
            className="font-medium text-foreground hover:text-brand hover:underline underline-offset-4 transition-colors"
            href="https://github.com/Winner-Yun"
            rel="noreferrer"
            target="_blank"
          >
            Work Smart Team
          </a>
        </p>
      </div>
    </footer>
  );
}
