import React from "react";
import slothBackground from "../assets/sloth-background1.png";

const Home: React.FC = () => {
  return (
    <main
      id="home"
      className="home-hero relative flex min-h-[calc(100dvh-4.25rem)] flex-col overflow-x-hidden bg-warm-taupe bg-no-repeat md:h-dvh md:overflow-hidden md:pl-48"
      style={
        {
          "--hero-background-desktop": `url(${slothBackground})`,
        } as React.CSSProperties
      }>
      <img
        src={slothBackground}
        alt=""
        className="home-background-image pointer-events-none absolute top-0 right-0 z-0 h-[clamp(12rem,38dvh,20rem)] w-full object-contain object-right md:hidden"
      />
      <div
        aria-hidden="true"
        className="h-[clamp(12rem,38dvh,20rem)] md:hidden"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-start px-5 py-5 sm:px-8 md:mx-0 md:justify-center md:px-0 md:pt-50">
        <p className="my-0.5 flex flex-wrap items-center gap-x-3 font-mono text-sm font-semibold text-olive-500 sm:gap-x-4 sm:text-lg">
          <span>Plan</span>
          <span>/</span>
          <span>Organize</span>
          <span>/</span>
          <span>Track</span>
        </p>

        <h1 className="my-3 text-[clamp(2rem,9vw,3.5rem)] font-bold leading-tight text-olive-600 sm:my-5 sm:text-6xl md:text-7xl">
          Lazy Schedule
        </h1>

        <p className="mb-5 max-w-xl text-left text-sm leading-relaxed text-olive sm:mb-8 sm:text-lg md:text-xl">
          Sometimes, planning our day feels more exhausting than actually living
          it. So let&apos;s make it Lazy.
        </p>

        <div className="flex w-full flex-wrap items-center justify-start gap-3 sm:gap-4">
          <a
            className="inline-flex min-h-11 items-center rounded-full bg-terracotta px-5 py-3 text-sm font-medium text-warm-taupe shadow-md transition hover:bg-taupe-200 sm:px-8 sm:py-4 sm:text-base md:px-13 md:py-5"
            href="/lazy-schedule">
            Start your Lazy Schedule
            <svg
              className="ml-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>

          <div className="inline-flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Watch How It Works"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-olive text-olive transition hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-olive sm:h-15 sm:w-15"
              type="button">
              <svg
                className="h-4 w-4 translate-x-px sm:h-5 sm:w-5"
                viewBox="0 0 12 14"
                fill="currentColor"
                aria-hidden="true">
                <path d="M11 7 1 13V1l10 6Z" />
              </svg>
            </button>

            <span className="flex flex-col items-start text-sm leading-tight sm:text-base">
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
