import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../features/notificationHooks";
import { useTheme } from "../features/themeHooks";
import slothFaceDay from "../assets/Logo/sloth-face.png";
import mainLogoDay from "../assets/Logo/mainLogo-day.svg";
import sleepingSlothDay from "../assets/Logo/sleepingSloth-day.svg";
import sleepingSlothNight from "../assets/Logo/sleepy-sloth-night.png";

type IconName =
  | "schedule"
  | "tasksmanager"
  | "calendar"
  | "productivity"
  | "settings"
  | "bell";

const SidebarIcon: React.FC<{ name: IconName }> = ({ name }) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true" {...common}>
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
      {name === "bell" && (
        <>
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
          <path d="M10 20a2 2 0 0 0 4 0" />
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

const signInLink = { to: "/login", label: "Sign in" };

const utilityLinks: { to: string; label: string; icon: IconName }[] = [
  { to: "/settings", label: "Settings", icon: "settings" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isNight = theme === "night";
  const sleepingSloth = isNight ? sleepingSlothNight : sleepingSlothDay;
  const { unreadCount, panelOpen, openPanel, closePanel } = useNotifications();
  const closeMobileMenu = () => setMenuOpen(false);
  const shouldAnimateBell = unreadCount > 0 && !panelOpen;

  return (
    <>
      {/* Desktop left navigation */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:w-24 md:flex-col md:items-center md:border-r md:border-warm-taupe md:bg-terracotta md:shadow-xl">
        <div className="flex h-screen w-full flex-col items-center py-5">
          <Link
            to="/#home"
            aria-label="Home"
            title="Home"
            className="flex h-24 w-28 translate-x-3 -translate-y-1 items-center justify-center">
            <img
              src={mainLogoDay}
              alt="Lazy Sloth"
              className="h-full w-full object-contain"
              style={{ filter: "sepia(0.12) saturate(0.82)" }}
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="flex flex-1 flex-col items-center justify-evenly py-10">
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
            <button
              type="button"
              onClick={() => (panelOpen ? closePanel() : openPanel())}
              aria-label="Open notifications"
              title="Notifications"
              className={`relative flex h-12 w-12 items-center justify-center rounded-lg text-warm-ivory transition hover:bg-olive hover:text-terracotta focus:outline-none focus:ring-2 focus:ring-warm-ivory ${shouldAnimateBell ? "motion-safe:animate-[bell-ring_0.7s_ease-in-out_infinite]" : ""}`}>
              <SidebarIcon name="bell" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-warm-ivory">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "day" ? "night" : "day"} mood`}
              title={`Switch to ${theme === "day" ? "Night View" : "Day Mood"}`}
              className="flex h-12 w-12 items-center justify-center rounded-lg text-warm-ivory transition hover:bg-olive hover:text-terracotta focus:outline-none focus:ring-2 focus:ring-warm-ivory">
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
          </nav>

          <div className="flex w-full flex-col items-center gap-4">
            <div className="w-[80%] border-t border-olive pb-40" />
            <nav aria-label="Utility navigation" className="flex flex-col items-center gap-4">
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
            <Link
              to={signInLink.to}
              aria-label={signInLink.label}
              title={signInLink.label}
              className="flex h-12 w-12 items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-warm-ivory">
              <img
                src={slothFaceDay}
                alt=""
                className="h-8 w-8 object-contain"
                style={{ filter: "sepia(0.12) saturate(0.82)" }}
              />
            </Link>
          </div>
        </div>
      </aside>

      {/* Compact navigation for mobile */}
      <nav
        className="sticky top-3 z-40 mx-3 w-auto rounded-2xl border border-white/60 bg-white/35 px-5 py-3 shadow-lg shadow-coffee/10 backdrop-blur-xl backdrop-saturate-150 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/#home"
            className="font-bold text-olive text-xl"
            onClick={closeMobileMenu}>
            <img
              src={sleepingSloth}
              alt="Sleeping sloth"
              className="h-10 w-24 object-contain object-left"
            />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => (panelOpen ? closePanel() : openPanel())}
              aria-label="Open notifications"
              className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-olive text-warm-ivory focus:outline-none focus:ring-2 focus:ring-olive ${shouldAnimateBell ? "motion-safe:animate-[bell-ring_0.7s_ease-in-out_infinite]" : ""}`}>
              <SidebarIcon name="bell" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-warm-ivory">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
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
        </div>
        {menuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/70 p-3 font-semibold shadow-xl shadow-coffee/15 backdrop-blur-xl backdrop-saturate-150">
            {[...links, ...utilityLinks].map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className="rounded-lg px-3 py-2 text-coffee transition hover:bg-white/40"
                onClick={closeMobileMenu}>
                {label}
              </Link>
            ))}
            <Link
              to={signInLink.to}
              className="rounded-lg px-3 py-2 text-coffee transition hover:bg-white/40"
              onClick={closeMobileMenu}>
              Sign in
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
