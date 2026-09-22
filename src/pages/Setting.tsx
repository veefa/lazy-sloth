import { useNotificationPreferences } from "../features/notificationCenter";
import { useTheme } from "../features/theme";

const focusSettings = [
  { label: "Work block length", value: "90 minutes" },
  { label: "Daily reset reminder", value: "8:30 PM" },
  { label: "Energy mood", value: "Balanced" },
];

const SettingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { preferences, updatePreference } = useNotificationPreferences();
  const isNight = theme === "night";

  const toggleButton = (
    enabled: boolean,
    onToggle: () => void,
    label: string,
    description: string,
  ) => (
    <div
      key={label}
      className={`flex items-center justify-between gap-4 rounded-2xl border border-current/10 px-4 py-3 ${isNight ? "bg-coffee/20" : "bg-warm-ivory/80"}`}>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{label}</p>
        <p
          className={`mt-1 text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta ${enabled ? "border-terracotta bg-terracotta" : "border-taupe-dark bg-olive/30"}`}>
        <span
          className={`inline-block h-5 w-5 rounded-full bg-warm-ivory shadow-sm transition-transform ${enabled ? "translate-x-7" : "translate-x-1"}`}
        />
        <span className="sr-only">Toggle {label}</span>
      </button>
    </div>
  );

  return (
    <main
      className={`min-h-screen px-5 py-8 md:ml-24 md:px-10 ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-olive"}`}>
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-terracotta">
            Personalize
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Settings</h1>
          <p className={`mt-2 ${isNight ? "text-warm-taupe" : "text-olive"}`}>
            Tune the way Lazy Schedule feels and supports your rhythm.
          </p>
        </header>

        <section
          className={`rounded-3xl border border-warm-taupe p-6 shadow-lg ${isNight ? "bg-olive" : "bg-taupe-light"}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
                Appearance
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Visual mood</h2>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-terracotta ${isNight ? "bg-warm-ivory text-olive hover:bg-taupe-light" : "bg-coffee text-warm-ivory hover:bg-olive"}`}>
              {isNight ? "Switch to day mode" : "Switch to night mode"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div
              className={`rounded-2xl border border-current/10 p-5 ${isNight ? "bg-coffee/20" : "bg-warm-ivory/80"}`}>
              <p className="text-sm uppercase tracking-[0.2em] text-terracotta">
                Current mode
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {isNight ? "Night" : "Day"}
              </p>
              <p
                className={`mt-2 text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                {isNight
                  ? "Cool contrast for late-night planning."
                  : "Warm tones for a relaxed daytime flow."}
              </p>
            </div>

            <div
              className={`rounded-2xl border border-current/10 p-5 ${isNight ? "bg-coffee/20" : "bg-warm-ivory/80"}`}>
              <p className="text-sm uppercase tracking-[0.2em] text-terracotta">
                Focus palette
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-8 w-8 rounded-full bg-terracotta" />
                <span className="h-8 w-8 rounded-full bg-olive" />
                <span className="h-8 w-8 rounded-full bg-coffee" />
                <span className="h-8 w-8 rounded-full bg-warm-taupe" />
              </div>
              <p
                className={`mt-3 text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                Designed to keep the planner calm, clear, and readable.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section
            className={`rounded-3xl border border-warm-taupe p-6 ${isNight ? "bg-olive" : "bg-taupe-light"}`}>
            <h2 className="text-2xl font-semibold">Planner defaults</h2>
            <ul className="mt-5 space-y-4">
              {focusSettings.map(({ label, value }) => (
                <li
                  key={label}
                  className={`flex items-center justify-between rounded-2xl border border-current/10 px-4 py-3 ${isNight ? "bg-coffee/20" : "bg-warm-ivory/80"}`}>
                  <span>{label}</span>
                  <span className="font-medium text-terracotta">{value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            className={`rounded-3xl border border-warm-taupe p-6 ${isNight ? "bg-olive" : "bg-taupe-light"}`}>
            <h2 className="text-2xl font-semibold">Lazy habits</h2>

            <div className="mt-5 space-y-4">
              {toggleButton(
                preferences.gentleTaskNudges,
                () =>
                  updatePreference(
                    "gentleTaskNudges",
                    !preferences.gentleTaskNudges,
                  ),
                "Gentle task nudges",
                "Suggest a task when you have an empty space in your schedule.",
              )}
              {toggleButton(
                preferences.overloadAwareness,
                () =>
                  updatePreference(
                    "overloadAwareness",
                    !preferences.overloadAwareness,
                  ),
                "Overload awareness",
                "Alert you when the day is fuller than it should be.",
              )}
              {toggleButton(
                preferences.breakReminders,
                () =>
                  updatePreference(
                    "breakReminders",
                    !preferences.breakReminders,
                  ),
                "Break reminders",
                "Suggest a short pause when a focus block becomes too long.",
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SettingPage;
