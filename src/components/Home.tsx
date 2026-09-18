import React from "react";

const Home: React.FC = () => {
  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <div
        id="home"
        className="flex min-h-0 flex-1 flex-col items-center justify-center bg-warm-ivory px-4">
        {/*<img
          src={}
          alt="Lazy Schedule"
          className="animate-clock-ring mb-4 h-16 w-16 sm:h-20 sm:w-20"
        />*/}
        <h1 className="m-8 font-bold text-4xl text-olive-600 sm:text-5xl">
          Lazzzy Schedule
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-olive text-sm sm:text-base md:mx-0 text-center">
          Sometimes, planning our day feels more exhausting than actually living
          it. so let's make it Lazy
        </p>
        <div className="flex gap-4">
          <a
            className="bg-terracotta hover:bg-taupe-200 shadow-md px-6 py-2 rounded font-semibold text-taupe-700 transition"
            href="/lazy-schedule">
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
};
export default Home;
