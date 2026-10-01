import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import slothBackground from "../assets/sloth-background-small.png";
import { useTheme } from "../features/themeHooks";

const LoginPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const isNight = theme === "night";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(
      "Sign-in is not connected yet. Your details have not been sent.",
    );
  };

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
            <Link to="/" className="text-lg font-semibold">
              Lazy Schedule
            </Link>
            <p className="mt-2 max-w-sm text-sm text-warm-ivory/85 sm:text-base">
              A little more room for the day you actually want.
            </p>
          </div>
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-warm-ivory/60 font-semibold sm:flex">
            LS
          </span>
        </div>
      </aside>

      <section className="flex min-h-[calc(100dvh-14rem)] flex-col px-6 py-6 sm:px-10 sm:py-8 lg:min-h-dvh lg:px-12 lg:py-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="font-semibold text-olive lg:invisible">
            Lazy Schedule
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
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-sm font-semibold text-warm-ivory">
              LS
            </span>
            <div>
              <p className="text-sm font-semibold">Your workspace</p>
              <p
                className={`text-xs ${isNight ? "text-warm-taupe" : "text-olive/75"}`}>
                Personal planning, all in one place
              </p>
            </div>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Sign in to continue
          </h1>
          <p
            className={`mt-3 text-sm leading-6 ${isNight ? "text-warm-taupe" : "text-olive"}`}>
            Pick up where you left off and make a little space for what matters.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Email address
              </span>
              <input
                autoComplete="email"
                className={`h-12 w-full rounded-lg border px-4 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 ${isNight ? "border-warm-taupe/25 bg-coffee/40 text-warm-ivory placeholder:text-warm-taupe/60" : "border-olive/20 bg-white text-coffee placeholder:text-olive/50"}`}
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <input
                autoComplete="current-password"
                className={`h-12 w-full rounded-lg border px-4 outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 ${isNight ? "border-warm-taupe/25 bg-coffee/40 text-warm-ivory placeholder:text-warm-taupe/60" : "border-olive/20 bg-white text-coffee placeholder:text-olive/50"}`}
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </label>

            <button
              className="flex h-12 w-full items-center justify-center rounded-lg bg-terracotta px-5 font-semibold text-warm-ivory transition hover:bg-terracotta/90 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
              type="submit">
              Sign in
            </button>
            {message && (
              <p className="text-sm text-terracotta" role="status">
                {message}
              </p>
            )}
          </form>

          <div
            className={`my-7 border-t ${isNight ? "border-warm-taupe/20" : "border-olive/15"}`}
          />
          <p
            className={`text-center text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
            New to Lazy Schedule?{" "}
            <a
              className="font-semibold text-terracotta underline decoration-terracotta/40 underline-offset-4 hover:decoration-terracotta"
              href="mailto:hello@lazyschedule.app?subject=Create%20an%20account">
              Create an account
            </a>
          </p>
        </div>

        <footer
          className={`text-center text-xs ${isNight ? "text-warm-taupe/70" : "text-olive/65"}`}>
          By continuing, you agree to keep your plans yours.
        </footer>
      </section>
    </main>
  );
};

export default LoginPage;
