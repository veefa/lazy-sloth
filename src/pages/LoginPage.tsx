import { Link, useLocation } from "react-router-dom";
import slothBackground from "../assets/sloth-background-small.png";
import slothLogo from "../assets/Logo/sloth-face.png";
import slothWordmark from "../assets/Logo/sleepy-sloth-body.png";
import { useTheme } from "../features/themeHooks";

const LoginPage = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isRegistering = location.pathname === "/register";
  const isNight = theme === "night";

  return (
    <main
      className={`min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.9fr)] ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-coffee"}`}>
      <aside className="relative flex min-h-56 items-end overflow-hidden bg-olive px-6 py-7 sm:min-h-72 sm:px-10 lg:min-h-dvh lg:px-14 lg:py-12">
        <img
          src={slothBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-coffee/35" />
        <div className="relative z-10 flex w-full items-end justify-between gap-4 text-warm-ivory">
          <div>
            <Link to="/" aria-label="Lazy Schedule home" className="inline-block">
              <img
                src={slothWordmark}
                alt="Lazy Schedule"
                className="h-12 w-36 object-contain object-left"
                style={{ filter: "sepia(0.08) saturate(0.8)" }}
              />
            </Link>
            <p className="mt-2 max-w-sm text-sm text-warm-ivory/85 sm:text-base">
              A little more room for the day you actually want.
            </p>
          </div>
          <img
            src={slothLogo}
            alt=""
            className="hidden h-12 w-12 shrink-0 rounded-full object-contain sm:block"
            style={{ filter: "sepia(0.12) saturate(0.82)" }}
          />
        </div>
      </aside>

      <section className="flex min-h-[calc(100dvh-14rem)] flex-col px-6 py-6 sm:px-10 sm:py-8 lg:min-h-dvh lg:px-12 lg:py-10">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            aria-label="Lazy Schedule home"
            className="inline-block lg:invisible">
            <img
              src={slothWordmark}
              alt="Lazy Schedule"
              className="h-10 w-32 object-contain object-left"
              style={{ filter: "sepia(0.08) saturate(0.8)" }}
            />
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-terracotta ${isNight ? "border-warm-taupe/30 hover:bg-warm-ivory/10" : "border-olive/20 hover:bg-taupe-light"}`}
            aria-label={`Switch to ${isNight ? "day" : "night"} mode`}>
            {isNight ? "Day mode" : "Night mode"}
          </button>
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="mb-8 flex items-center gap-3">
            <img
              src={slothLogo}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full object-contain"
              style={{ filter: "sepia(0.12) saturate(0.82)" }}
            />
            <div>
              <p className="text-sm font-semibold">Your workspace</p>
              <p
                className={`text-xs ${isNight ? "text-warm-taupe" : "text-olive/75"}`}>
                Personal planning, all in one place
              </p>
            </div>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">
            {isRegistering ? "Get started" : "Welcome back"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {isRegistering ? "Create your account" : "Sign in to continue"}
          </h1>
          <p
            className={`mt-3 text-sm leading-6 ${isNight ? "text-warm-taupe" : "text-olive"}`}>
            {isRegistering
              ? "Create an account to save your plans and make a little space for what matters."
              : "Pick up where you left off and make a little space for what matters."}
          </p>

          <p className="mt-5 rounded-lg border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-terracotta" role="status">
            Preview only: authentication is not connected. These fields are disabled; no account will be created and no details are collected.
          </p>

          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Email address
              </span>
              <input
                autoComplete="email"
                className={`h-12 w-full rounded-lg border px-4 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 ${isNight ? "border-warm-taupe/25 bg-coffee/40 text-warm-ivory placeholder:text-warm-taupe/60" : "border-olive/20 bg-white text-coffee placeholder:text-olive/50"}`}
                name="email"
                autoCapitalize="none"
                autoCorrect="off"
                disabled
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <input
                autoComplete={isRegistering ? "new-password" : "current-password"}
                className={`h-12 w-full rounded-lg border px-4 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 ${isNight ? "border-warm-taupe/25 bg-coffee/40 text-warm-ivory placeholder:text-warm-taupe/60" : "border-olive/20 bg-white text-coffee placeholder:text-olive/50"}`}
                name="password"
                minLength={isRegistering ? 8 : undefined}
                disabled
                placeholder={isRegistering ? "At least 8 characters" : "Enter your password"}
                required
                type="password"
              />
            </label>

            {isRegistering && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Confirm password
                </span>
                <input
                  autoComplete="new-password"
                  className={`h-12 w-full rounded-lg border px-4 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 ${isNight ? "border-warm-taupe/25 bg-coffee/40 text-warm-ivory placeholder:text-warm-taupe/60" : "border-olive/20 bg-white text-coffee placeholder:text-olive/50"}`}
                  name="confirmPassword"
                  disabled
                  placeholder="Re-enter your password"
                  required
                  type="password"
                />
              </label>
            )}

            <button
              className="flex h-12 w-full items-center justify-center rounded-lg bg-terracotta px-5 font-semibold text-warm-ivory opacity-60"
              disabled
              type="submit">
              {isRegistering ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className={`h-px flex-1 ${isNight ? "bg-warm-taupe/20" : "bg-olive/15"}`} />
            <span className={`text-xs ${isNight ? "text-warm-taupe" : "text-olive"}`}>
              OR
            </span>
            <div className={`h-px flex-1 ${isNight ? "bg-warm-taupe/20" : "bg-olive/15"}`} />
          </div>
          <button
            className={`flex h-12 w-full items-center justify-center rounded-lg border px-5 font-semibold opacity-60 ${isNight ? "border-warm-taupe/25" : "border-olive/20"}`}
            disabled
            type="button">
            Google sign-in (coming later)
          </button>

          <div
            className={`my-7 border-t ${isNight ? "border-warm-taupe/20" : "border-olive/15"}`}
          />
          <p
            className={`text-center text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
            {isRegistering ? "Already have an account? " : "New to Lazy Schedule? "}
            <Link
              to={isRegistering ? "/login" : "/register"}
              className="font-semibold text-terracotta underline decoration-terracotta/40 underline-offset-4 hover:decoration-terracotta"
            >
              {isRegistering ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>

        <footer
          className={`text-center text-xs ${isNight ? "text-warm-taupe/70" : "text-olive/65"}`}>
          Authentication is not active in this development build.
        </footer>
      </section>
    </main>
  );
};

export default LoginPage;
