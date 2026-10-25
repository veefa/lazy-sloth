import { Link, useLocation } from "react-router-dom";
import slothBackground from "../assets/sloth-background-small.png";
import sleepingSloth from "../assets/Logo/sleepy-sloth-body.svg";
const LoginPage = () => {
  const location = useLocation();
  const isRegistering = location.pathname === "/register";


  return (
    <main
      className="relative isolate flex min-h-dvh flex-col text-coffee lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="fixed inset-0 z-0">
        <img
          src={slothBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-coffee/30" />
      </div>

      <aside className="relative z-10 hidden lg:order-2 lg:flex lg:min-h-dvh lg:items-end lg:px-14 lg:py-12">
        
      </aside>

      <section className="relative z-10 order-1 flex min-h-[calc(100dvh-14rem)] flex-col bg-warm-ivory/90 px-6 py-6 shadow-2xl shadow-coffee/10 backdrop-blur-md sm:px-10 sm:py-8 lg:order-1 lg:my-4 lg:ml-4 lg:min-h-[calc(100dvh-2rem)] lg:rounded-3xl lg:px-12 lg:py-8">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 lg:max-w-sm lg:py-4">
          <div className="mb-8 flex items-center gap-3 lg:mb-6">
            <Link to="/" aria-label="Go to Home" className="inline-flex shrink-0">
              <img
                src={sleepingSloth}
                alt="Sleeping sloth"
                className="h-14 w-34 object-contain"
              />
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">
            {isRegistering ? "Get started" : "Welcome back"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl lg:text-3xl">
            {isRegistering ? "Create your account" : "Sign in to continue"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-olive">
            {isRegistering
              ? "Create an account to save your plans and make a little space for what matters."
              : "Pick up where you left off and make a little space for what matters."}
          </p>



          <form className="mt-8 space-y-5 lg:mt-6  text-coffee lg:space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Email address
              </span>
              <input
                autoComplete="email"
                className="h-12 w-full rounded-lg border border-olive/20 bg-white px-4 text-coffee outline-none transition placeholder:text-olive/50 focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 lg:h-10"
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
                className="h-12 w-full rounded-lg border border-olive/20 bg-white px-4 text-coffee outline-none transition placeholder:text-olive/50 focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 lg:h-10"
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
                  className="h-12 w-full rounded-lg border border-olive/20 bg-white px-4 text-coffee outline-none transition placeholder:text-olive/50 focus:border-terracotta focus:ring-2 focus:ring-terracotta/25 lg:h-10"
                  name="confirmPassword"
                  disabled
                  placeholder="Re-enter your password"
                  required
                  type="password"
                />
              </label>
            )}

            <button
              className="flex h-12 w-full items-center justify-center rounded-lg bg-terracotta px-5 font-semibold text-warm-ivory opacity-60 lg:h-10"
              disabled
              type="submit">
              {isRegistering ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 lg:my-4">
            <div className="h-px flex-1 bg-olive/15" />
            <span className="text-xs text-olive">OR</span>
            <div className="h-px flex-1 bg-olive/15" />
          </div>
          <button
            className="flex h-12 w-full items-center justify-center rounded-lg border border-olive/20 px-5 font-semibold opacity-60 lg:h-10"
            disabled
            type="button">
            Google sign-in (coming later)
          </button>

          <div
            className="my-7 border-t border-olive/15 lg:my-5"
          />
          <p className="text-center text-sm text-olive">
            {isRegistering ? "Already have an account? " : "New to Lazy Schedule? "}
            <Link
              to={isRegistering ? "/login" : "/register"}
              className="font-semibold text-terracotta underline decoration-terracotta/40 underline-offset-4 hover:decoration-terracotta"
            >
              {isRegistering ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>

        <footer className="text-center text-xs text-olive/65">
          Authentication is not active in this development build.
        </footer>
      </section>
    </main>
  );
};

export default LoginPage;
