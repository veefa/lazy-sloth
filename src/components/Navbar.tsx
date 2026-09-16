import React, { useState } from "react";

type IconName = "home" | "schedule" | "about" | "productivity";

const SidebarIcon: React.FC<{ name: IconName }> = ({ name }) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {name === "home" && (
        <>
          <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Z" />
          <path d="M9 20v-6h6v6" />
        </>
      )}
      {name === "schedule" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {name === "about" && (
        <>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 20c.5-3.3 2.5-5 6-5s5.5 1.7 6 5" />
        </>
      )}
      {name === "productivity" && (
        <>
          <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
        </>
      )}
    </svg>
  );
};

const links: { to: string; label: string; icon: IconName }[] = [
  { to: "/#home", label: "Home", icon: "home" },
  { to: "/lazy-schedule", label: "Schedule", icon: "schedule" },
  { to: "/productivity", label: "Productivity", icon: "productivity" },
  { to: "/#about", label: "About", icon: "about" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Desktop left navigation */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-24 md:flex-col md:items-center md:border-r md:border-slate-700 md:bg-taupe-300 md:py-5 md:shadow-xl">
        <div
          aria-label="Lazy Schedule logo placeholder"
          className="mb-9 flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-indigo-300 bg-taupe-300 font-bold text-indigo-100 text-lg">
          LS
        </div>
        <nav
          aria-label="Primary navigation"
          className="flex flex-col items-center gap-4">
          {links.map(({ to, label, icon }) => (
            <a
              key={label}
              href={to}
              aria-label={label}
              title={label}
              className="flex h-12 w-12 items-center justify-center rounded-lg text-indigo-300 transition hover:bg-slate-700 hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <SidebarIcon name={icon} />
            </a>
          ))}
        </nav>
        <a
          href="/productivity"
          aria-label="Productivity"
          title="Productivity"
          className="mt-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-300 text-indigo-300 transition hover:bg-slate-700 hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <SidebarIcon name="productivity" />
        </a>
      </aside>

      {/* Compact navigation for mobile */}
      <nav className="w-full bg-taupe-300 px-5 py-4 shadow md:hidden">
        <div className="flex items-center justify-between">
          <a
            href="/#home"
            className="font-bold text-olive text-xl"
            onClick={closeMobileMenu}>
            Lazy Schedule
          </a>
          <button
            className="text-taupe-700 focus:outline-none"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}>
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
              />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="mt-4 flex flex-col gap-2 border-t border-taupe-400 pt-3 font-semibold">
            {links.map(({ to, label }) => (
              <a
                key={label}
                href={to}
                className="rounded px-3 py-2 text-taupe-700 hover:bg-taupe-400 "
                onClick={closeMobileMenu}>
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
