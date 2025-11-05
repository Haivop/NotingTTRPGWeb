import Link from "next/link";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/search", label: "Search" },
  { href: "/hub", label: "Hub" },
  { href: "/account", label: "Account" },
];

interface SiteHeaderProps {
  cta?: React.ReactNode;
  className?: string;
}

export function SiteHeader({ cta, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/10 bg-[#080818]/70 backdrop-blur-xl",
        className,
      )}
    >
      <div className="page-container flex items-center justify-between gap-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg text-purple-100">
              Worldcraftery
            </span>
          </Link>
          <span className="hidden h-7 w-px bg-white/10 md:block" />
          <span className="hidden text-sm text-white/60 md:block">
            Forge worlds. Weave histories. Chronicle legends.
          </span>
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-6 text-sm font-medium text-white/75 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative transition duration-200 hover:text-white"
              >
                {link.label}
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden h-px w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent group-hover:block" />
              </Link>
            ))}
          </nav>
          <Link
            href="/worlds/create"
            className="group hidden rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-purple-100 shadow-[0_0_20px_rgba(124,58,237,0.35)] transition hover:border-purple-200/60 hover:bg-purple-400/20 md:inline-flex"
          >
            New World
          </Link>
          <div className="md:hidden">
            <MenuIcon />
          </div>
          {cta}
        </div>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <span className="flex flex-col gap-1">
      <span className="h-0.5 w-6 rounded-full bg-white/80" />
      <span className="h-0.5 w-6 rounded-full bg-white/60" />
      <span className="h-0.5 w-6 rounded-full bg-white/80" />
    </span>
  );
}
