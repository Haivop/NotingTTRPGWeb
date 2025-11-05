export function SiteFooter() {
  const footerLinks = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Support", href: "/support" },
  ];

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#080818]/70 py-8 text-sm text-white/55 backdrop-blur-2xl">
      <div className="page-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xs text-purple-200/80">
            WORLDCRAFTERY
          </p>
          <p className="mt-2 max-w-md text-white/60">
            Crafted for storytellers seeking a canvas for their maps, characters,
            quests, and living worlds.
          </p>
        </div>

        <nav className="flex items-center gap-4 text-white/65">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
