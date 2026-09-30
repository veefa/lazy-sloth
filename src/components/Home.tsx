import React from "react";
import slothBackground from "../assets/sloth-background.png";

const Home: React.FC = () => {
  return (
    <main
      id="home"
      className="relative flex h-dvh flex-col overflow-hidden bg-warm-taupe bg-no-repeat  md:pl-48"
      style={{
        backgroundImage: `url(${slothBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Background overlay */}

        {/* Content */}
      <div className="relative z-10 flex min-h-full flex-col items-start justify-center pt-50">
        <p className="my-0.5 flex items-center gap-4 whitespace-nowrap font-mono text-lg font-semibold text-olive-500">
          <span>Plan</span>
          <span>/</span>
          <span>Organize</span>
          <span>/</span>
          <span>Track</span>
        </p>

        <h1 className="my-5 text-7xl font-bold text-olive-600 sm:text-8xl">
          Lazy Schedule
        </h1>

        <p className="mx-0 mb-10 max-w-xl text-left text-lg text-olive sm:text-xl">
          Sometimes, planning our day feels more exhausting than actually living
          it. So let&apos;s make it Lazy.
        </p>

        <div className="flex flex-wrap items-center justify-start gap-4">
          <a
            className="rounded-4xl bg-terracotta px-13 py-5 text-shadow-md font-medium text-warm-taupe shadow-md transition hover:bg-taupe-200"
            href="/lazy-schedule">
            Start your Lazy Schedule
            <svg
              className="ml-2 inline h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>

          <div className="inline-flex items-center gap-3">
            <button
              aria-label="Watch How It Works"
              className="flex h-15 w-15 items-center justify-center rounded-full border border-olive text-olive transition hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-olive"
              type="button">
              <svg
                className="h-5 w-5 translate-x-px"
                viewBox="0 0 12 14"
                fill="currentColor"
                aria-hidden="true">
                <path d="M11 7 1 13V1l10 6Z" />
              </svg>
            </button>

            <span className="flex flex-col items-start leading-tight">
              <span className="text-olive">Watch How It Works</span>
              <span className="mt-1 text-xs font-normal text-olive/60">
                1 min
              </span>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
