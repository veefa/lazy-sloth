import { useTasks } from "../features/taskStore";

const durationFor = (startHour: number, endHour: number) => {
  return (endHour - startHour + 24) % 24;
};

const ProductivityPage = () => {
  const tasks = useTasks();
  const scheduledHours = tasks.reduce(
    (total, task) => total + durationFor(task.startHour, task.endHour),
    0,
  );
  const productivityScore = Math.min(
    100,
    Math.round((scheduledHours / 24) * 100),
  );
  const restScore = 100 - productivityScore;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);
  const isOverloaded = scheduledHours > 22;

  return (
    <main className="min-h-screen bg-olive px-5 py-8 text-warm-ivory md:ml-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
            Daily insights
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Productivity
          </h1>
          <p className="mt-2 text-warm-taupe">
            See how your planned work balances with time left to rest.
          </p>
        </header>

        {isOverloaded && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-terracotta bg-coffee p-4 text-warm-taupe">
            <span className="text-xl" aria-hidden="true">
              !
            </span>
            <div>
              <h2 className="font-semibold text-warm-ivory">
                Overload warning
              </h2>
              <p className="mt-1 text-sm">
                You have {scheduledHours.toFixed(1)} hours of planned tasks.
                Leave time for sleep and rest.
              </p>
            </div>
          </div>
        )}

        <section
          className="rounded-2xl bg-coffee p-6 shadow-lg"
          aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="text-2xl font-semibold">
            Overview
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-0">
            <Metric
              label="Productivity"
              value={`${productivityScore}%`}
              detail={`${scheduledHours.toFixed(1)}h scheduled`}
              color="text-terracotta"
            />
            <Metric
              label="Rest"
              value={`${restScore}%`}
              detail={`${Math.max(0, 24 - scheduledHours).toFixed(1)}h remaining`}
              color="text-warm-taupe"
            />
          </div>
          <div
            className="mt-8 h-3 overflow-hidden rounded-full bg-olive"
            aria-label={`${productivityScore}% productivity and ${restScore}% rest`}>
            <div
              className="h-full bg-terracotta transition-all"
              style={{ width: `${productivityScore}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-warm-taupe">
            Balance is calculated from scheduled task time versus the 24-hour
            day.
          </p>
        </section>

        <section
          className="mt-5 rounded-2xl bg-coffee p-6"
          aria-labelledby="completion-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="completion-heading" className="text-2xl font-semibold">
                Task completion rate
              </h2>
              <p className="mt-1 text-sm text-warm-taupe">
                Completed tasks compared with your saved tasks.
              </p>
            </div>
            <strong className="text-4xl text-warm-taupe">
              {completionRate}%
            </strong>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-olive">
            <div
              className="h-full bg-warm-taupe transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-warm-taupe">
            {completedTasks} of {tasks.length}{" "}
            {tasks.length === 1 ? "task" : "tasks"} completed
          </p>
        </section>
      </div>
    </main>
  );
};

const Metric = ({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  color: string;
}) => (
  <div className="text-center md:border-r md:border-warm-taupe md:last:border-0">
    <p className={`text-5xl font-semibold ${color}`}>{value}</p>
    <p className="mt-3 text-xl text-warm-taupe">{label}</p>
    <p className="mt-2 text-sm text-taupe-dark">{detail}</p>
  </div>
);

export default ProductivityPage;
