import { useNotificationPreferences } from "../features/notificationHooks";
import FaceClock from "../features/FaceClock";
import { useTheme } from "../features/themeHooks";

const LazySchedulePage = () => {
  const { theme } = useTheme();
  const { preferences } = useNotificationPreferences();
  const isNight = theme === "night";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center py-12 md:ml-24 ${isNight ? "bg-coffee" : "bg-warm-ivory"}`}>
      <div className="flex w-full flex-col items-center px-4">
        {preferences.gentleTaskNudges && (
          <div
            className={`mb-6 w-full max-w-4xl rounded-2xl border border-dashed border-terracotta p-5 ${isNight ? "bg-coffee/20" : "bg-warm-ivory/90"}`}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-terracotta">
              Need a little direction?
            </p>
            <p
              className={`mt-3 text-lg ${isNight ? "text-warm-ivory" : "text-olive"}`}>
              You have 40 minutes free. Want to work on{" "}
              <span className="font-semibold italic">French practice</span>?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-warm-ivory transition hover:bg-terracotta/90 focus:outline-none focus:ring-2 focus:ring-terracotta">
                Suggest something
              </button>
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isNight ? "border-warm-ivory text-warm-ivory hover:bg-warm-ivory/10" : "border-olive text-olive hover:bg-olive/10"}`}>
                Not now
              </button>
              <button
                type="button"
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isNight ? "border-warm-ivory text-warm-ivory hover:bg-warm-ivory/10" : "border-olive text-olive hover:bg-olive/10"}`}>
                I’ll choose
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 flex w-full max-w-6xl items-center justify-center rounded-xl">
          <FaceClock />
        </div>
      </div>
    </main>
  );
};

export default LazySchedulePage;
