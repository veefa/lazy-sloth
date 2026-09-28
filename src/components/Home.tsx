import React from "react";

const Home: React.FC = () => {
  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <div
        id="home"
        className="flex min-h-0 flex-1 flex-col items-start justify-center bg-warm-ivory px-4 md:pl-58">
        {/*<img
          src={}
          alt="Lazy Schedule"
          className="animate-clock-ring mb-4 h-16 w-16 sm:h-20 sm:w-20"
        />*/}
        <p className="my-0.5 flex items-center gap-4 whitespace-nowrap font-mono font-semibold text-sm text-olive-400 sm:text-sm">
          <span>Plan</span>
          <span>/</span>
          <span>Organize</span>
          <span>/</span>
          <span>Track</span>
        </p>
        <h1 className="my-5 font-bold text-4xl text-olive-600 sm:text-5xl">
          Lazzy Schedule
        </h1>

        <p className="mx-0 mb-10 max-w-xl text-left text-olive text-sm sm:text-base">
          Sometimes, planning our day feels more exhausting than actually living
          it. so let's make it Lazy
        </p>
        <div className="flex flex-wrap items-center justify-start gap-4">
          <a
            className="bg-terracotta hover:bg-taupe-200 shadow-md px-10 py-4 rounded-4xl font-medium text-sm text-warm-ivory transition"
            href="/lazy-schedule">
            Start your Lazy Schedule
            <svg
              className="ml-2 inline h-4 w-4"
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
              className="flex h-12 w-12 items-center justify-center rounded-full border border-olive text-olive transition hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-olive"
              type="button">
              <svg
                className="h-3 w-3 translate-x-px"
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
