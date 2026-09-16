import FaceClock from "../features/FaceClock";

const LazySchedulePage = () => {
  return (
    <main className="flex flex-col justify-center items-center bg-[#e6edff] py-12 min-h-screen">
    
      <div className="flex w-full flex-col items-center px-4">
        <div className="mb-8 flex w-full max-w-6xl items-center justify-center rounded-xl">
          <FaceClock />
        </div>
        
      </div>
    </main>
  );
};

export default LazySchedulePage;
