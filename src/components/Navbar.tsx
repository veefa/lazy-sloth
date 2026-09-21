import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../features/theme";

type IconName =
  | "schedule"
  | "tasksmanager"
  | "calendar"
  | "productivity"
  | "settings"
  | "help"
  | "log";

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
      {name === "schedule" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </>
      )}
      {name === "tasksmanager" && (
        <>
          <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
        </>
      )}
      {name === "productivity" && (
        <>
          <path d="M4 19V5M4 19h16" />
          <path d="m7 15 3-4 3 2 5-7" />
        </>
      )}
      {name === "settings" && (
        <>
          <path
            fill="currentColor"
            stroke="none"
            fillRule="evenodd"
            d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.7-.98L14.5 2.42A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42L9.13 5.07c-.61.25-1.18.58-1.7.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.09.73 1.7.98l.38 2.65A.49.49 0 0 0 10 22h4a.49.49 0 0 0 .49-.42l.38-2.65c.61-.25 1.18-.58 1.7-.98l2.49 1a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
          />
        </>
      )}
      {name === "help" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M9.8 9a2.3 2.3 0 1 1 3.5 2c-.8.5-1.3 1-1.3 2" />
          <path d="M12 16h.01" />
        </>
      )}
      {name === "log" && (
        <>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 20c.5-3.3 2.5-5 6-5s5.5 1.7 6 5" />
        </>
      )}
    </svg>
  );
};

const links: { to: string; label: string; icon: IconName }[] = [
  { to: "/lazy-schedule", label: "Schedule", icon: "schedule" },
  { to: "/calendar", label: "Calendar", icon: "calendar" },
  { to: "/productivity", label: "Productivity", icon: "productivity" },
  { to: "/tasks-manager", label: "TaskManager", icon: "tasksmanager" },
];

const logLink = { to: "/log", label: "Log", icon: "log" as IconName };

const utilityLinks: { to: string; label: string; icon: IconName }[] = [
  { to: "/Settings   ", label: "Settings", icon: "settings" },
  { to: "/Help   ", label: "Help", icon: "help" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const closeMobileMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Desktop left navigation */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-24 md:flex-col md:items-center md:border-r md:border-warm-taupe md:bg-terracotta md:py-5 md:shadow-xl ">
        <Link
          to="/#home"
          aria-label="Home"
          title="Home"
          className="mb-9 flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-terracotta bg-olive font-bold text-warm-ivory text-lg">
          LS
        </Link>
        <nav
          aria-label="Primary navigation"
          className="flex flex-col items-center gap-4">
          {links.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              aria-label={label}
              title={label}
              className="flex h-12 w-12 items-center justify-center rounded-lg text-warm-ivory transition hover:bg-olive hover:text-terracotta focus:outline-none focus:ring-2 focus:ring-olive-600">
              <SidebarIcon name={icon} />
            </Link>
          ))}
        </nav>
        <div className="mt-50 flex w-full flex-col items-center pt-8">
          <div className="w-[80%] border-t border-olive pb-4" />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "day" ? "night" : "day"} mood`}
            title={`Switch to ${theme === "day" ? "Night View" : "Day Mood"}`}
            className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg text-warm-ivory transition hover:bg-olive hover:text-terracotta focus:outline-none focus:ring-2 focus:ring-warm-ivory">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true">
              {theme === "day" ? (
                <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              )}
            </svg>
          </button>
          <nav
            aria-label="Utility navigation"
            className="flex flex-col items-center gap-4">
            {utilityLinks.map(({ to, label, icon }) => (
              <Link
                key={label}
                to={to}
                aria-label={label}
                title={label}
                className="flex h-12 w-12 items-center justify-center rounded-lg text-warm-ivory transition hover:bg-olive hover:text-terracotta focus:outline-none focus:ring-2 focus:ring-olive-600">
                <SidebarIcon name={icon} />
              </Link>
            ))}
          </nav>
        </div>
        <Link
          to={logLink.to}
          aria-label={logLink.label}
          title={logLink.label}
          className="mt-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-warm-ivory text-warm-ivory transition hover:bg-olive hover:text-terracotta focus:outline-none focus:ring-2 focus:ring-olive">
          <SidebarIcon name={logLink.icon} />
        </Link>
      </aside>

      {/* Compact navigation for mobile */}
      <nav className="w-full bg-taupe-300 px-5 py-4 shadow md:hidden">
        <div className="flex items-center justify-between">
          <Link
            to="/#home"
            className="font-bold text-olive text-xl"
            onClick={closeMobileMenu}>
            Lazy Schedule
          </Link>
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
            {[...links, logLink, ...utilityLinks].map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className="rounded px-3 py-2 text-taupe-700 hover:bg-taupe-400 "
                onClick={closeMobileMenu}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
