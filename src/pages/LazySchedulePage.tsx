import FaceClock from "../features/FaceClock";
import { useTheme } from "../features/theme";

const LazySchedulePage = () => {
  const { theme } = useTheme();
  const isNight = theme === "night";

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center py-12 md:ml-24 ${isNight ? "bg-coffee" : "bg-warm-ivory"}`}>
      <div className="flex w-full flex-col items-center px-4">
        <div className="mb-8 flex w-full max-w-6xl items-center justify-center rounded-xl">
          <FaceClock />
        </div>
      </div>
    </main>
  );
};

export default LazySchedulePage;
