import { categories, useTasks } from "../features/taskStore";
import { useTheme } from "../features/themeHooks";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BalanceCategory = "Work" | "Health" | "Rest" | "Personal";

const balanceColors: Record<BalanceCategory, string> = {
  Work: categories.Work,
  Health: categories.Health,
  Rest: "#d8cec3",
  Personal: categories.Personal,
};

const durationFor = (startHour: number, endHour: number) =>
  (endHour - startHour + 24) % 24;

const ProductivityPage = () => {
  const tasks = useTasks();
  const { theme } = useTheme();
  const isNight = theme === "night";
  const scheduledHours = tasks.reduce(
    (total, task) => total + durationFor(task.startHour, task.endHour),
    0,
  );
  const balanceHours: Record<BalanceCategory, number> = {
    Work: 0,
    Health: 0,
    Rest: 0,
    Personal: 0,
  };

  tasks.forEach((task) => {
    const category = task.category === "Study" ? "Personal" : task.category;
    balanceHours[category] += durationFor(task.startHour, task.endHour);
  });
  balanceHours.Rest = Math.max(0, 24 - scheduledHours);

  const balanceItems = (Object.keys(balanceHours) as BalanceCategory[]).map(
    (category) => ({
      category,
      hours: balanceHours[category],
      percentage:
        scheduledHours + balanceHours.Rest === 0
          ? 0
          : (balanceHours[category] / (scheduledHours + balanceHours.Rest)) *
            100,
    }),
  );
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyBalance = daysOfWeek.map((day) => ({
    day,
    work: balanceHours.Work,
    rest: balanceHours.Rest,
  }));
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
    <main
      className={`productivity-page min-h-screen px-4 py-6 sm:px-5 sm:py-8 md:ml-24 md:px-8 lg:px-10 2xl:px-12 ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-olive"}`}>
      <div className="productivity-page__content mx-auto max-w-6xl 2xl:max-w-7xl">
        <header className="productivity-page__header mb-6 sm:mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta sm:text-sm">
            Daily insights
          </p>
          <h1 className="productivity-page__title text-3xl font-semibold tracking-tight sm:text-4xl 2xl:text-5xl">
            Productivity
          </h1>
          <p
            className={`productivity-page__description mt-2 text-sm sm:text-base ${isNight ? "text-warm-taupe" : "text-olive"}`}>
            See how your planned work balances with time left to rest.
          </p>
        </header>

        {isOverloaded && (
          <div
            role="alert"
            className={`productivity-page__alert mb-5 flex items-start gap-3 rounded-xl border-3 border-terracotta p-3 sm:mb-6 sm:p-4 lg:p-5 ${isNight ? "bg-terracotta text-warm-taupe" : "bg-terracotta text-coffee"}`}>
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-warm-ivory motion-safe:animate-[warning-signal_1.3s_ease-in-out_infinite] sm:h-6 sm:w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="m12 3 9 17H3L12 3Z" />
              <path d="M12 9v5M12 17h.01" />
            </svg>
            <div>
              <h2 className="font-semibold text-warm-taupe">
                Overload warning
              </h2>
              <p className="mt-1 text-sm">
                You have {scheduledHours.toFixed(1)} hours of planned tasks.
                Leave time for sleep and rest.
              </p>
            </div>
          </div>
        )}

        <div className="productivity-page__dashboard grid min-w-0 gap-4 sm:gap-5 2xl:gap-8 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="productivity-page__summary min-w-0 flex flex-col gap-4 sm:gap-5 2xl:gap-8">
            <section
              className={`productivity-page__card min-w-0 rounded-2xl p-4 sm:p-5 lg:p-6 2xl:p-8 ${isNight ? "bg-olive" : "bg-taupe-light"}`}
              aria-labelledby="completion-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="completion-heading"
                    className="text-xl font-semibold sm:text-2xl 2xl:text-3xl">
                    Task completion rate
                  </h2>
                  <p
                    className={`mt-1 text-xs sm:text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                    Completed tasks compared with your saved tasks.
                  </p>
                </div>
                <strong
                  className={`text-3xl sm:text-4xl 2xl:text-5xl ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                  {completionRate}%
                </strong>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-coffee sm:mt-5">
                <div
                  className="h-full bg-warm-taupe transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p
                className={`mt-3 text-xs sm:text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                {completedTasks} of {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"} completed
              </p>
            </section>

            <section
              className={`productivity-page__card min-w-0 rounded-2xl p-4 shadow-lg sm:p-5 lg:p-6 2xl:p-8 ${isNight ? "bg-olive" : "bg-taupe-light"}`}
              aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="text-xl font-semibold sm:text-2xl 2xl:text-3xl">
                Overview
              </h2>
              <div className="productivity-page__metrics mt-6 grid gap-5 sm:mt-8 sm:gap-8 md:grid-cols-2 md:gap-0 2xl:mt-10">
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
                  color="text-olive"
                />
              </div>
              <div
                className="mt-6 h-3 overflow-hidden rounded-full bg-coffee sm:mt-8"
                aria-label={`${productivityScore}% productivity and ${restScore}% rest`}>
                <div
                  className="h-full bg-terracotta transition-all"
                  style={{ width: `${productivityScore}%` }}
                />
              </div>
              <p
                className={`mt-3 text-xs sm:text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                Balance is calculated from scheduled task time versus the
                24-hour day.
              </p>
            </section>
          </div>

          <section
            className={`productivity-page__card productivity-page__balance min-w-0 rounded-2xl p-4 sm:p-5 lg:p-6 2xl:p-8 ${isNight ? "bg-olive" : "bg-taupe-light"}`}
            aria-labelledby="daily-balance-heading">
            <h2
              id="daily-balance-heading"
              className="text-xl font-semibold sm:text-2xl 2xl:text-3xl">
              Daily Balance
            </h2>
            <div className="productivity-page__balance-summary mt-5 flex min-w-0 flex-col items-center gap-4 sm:mt-6 sm:gap-6 xl:flex-row xl:justify-center 2xl:gap-8">
              <div
                className="productivity-page__donut relative aspect-square w-full max-w-44 shrink-0 sm:max-w-48 lg:max-w-52 2xl:max-w-60"
                role="img"
                aria-label={`Daily balance: ${balanceItems.map(({ category, hours, percentage }) => `${category} ${hours.toFixed(1)} hours, ${Math.round(percentage)}%`).join("; ")}`}>
                <div className="absolute inset-0" aria-hidden="true">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={balanceItems}
                        dataKey="hours"
                        nameKey="category"
                        innerRadius="60%"
                        outerRadius="80%"
                        paddingAngle={1}
                        stroke="none">
                        {balanceItems.map(({ category }) => (
                          <Cell key={category} fill={balanceColors[category]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${Number(value).toFixed(1)}h`}
                        contentStyle={{
                          backgroundColor: isNight ? "#4a382e" : "#faf7f2",
                          borderColor: isNight ? "#d8cec3" : "#8a7e73",
                          borderRadius: 6,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold sm:text-3xl 2xl:text-4xl">
                    {scheduledHours.toFixed(1)}h
                  </span>
                  <span
                    className={`mt-1 text-[11px] sm:text-xs ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                    planned of 24h
                  </span>
                </div>
              </div>
              <ul className="grid w-full min-w-0 max-w-sm gap-2 sm:gap-3 xl:w-auto xl:flex-1">
                {balanceItems.map(({ category, hours, percentage }) => (
                  <li
                    key={category}
                    className="productivity-page__balance-item flex items-center gap-3">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: balanceColors[category] }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 font-medium">
                      {category}
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap text-xs tabular-nums sm:text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                      {hours.toFixed(1)}h ({Math.round(percentage)}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="productivity-page__weekly mt-6 border-t border-warm-taupe/60 pt-4 sm:mt-8 sm:pt-6">
              <div className="productivity-page__weekly-header flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold sm:text-lg 2xl:text-xl">
                  Weekly Work vs. Rest
                </h3>
                <div className="flex gap-3 text-[11px] sm:gap-4 sm:text-xs">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: balanceColors.Work }}
                      aria-hidden="true"
                    />
                    Work
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: balanceColors.Rest }}
                      aria-hidden="true"
                    />
                    Rest
                  </span>
                </div>
              </div>
              <div
                className="productivity-page__weekly-chart mt-3 h-44 w-full sm:mt-4 sm:h-52 2xl:h-60"
                role="img"
                aria-label={`Weekly Work vs. Rest. The same daily schedule repeats Monday through Sunday: ${balanceHours.Work.toFixed(1)} work hours and ${balanceHours.Rest.toFixed(1)} unscheduled rest hours per day.`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyBalance}
                    margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid
                      stroke={isNight ? "#8a7e73" : "#d8cec3"}
                      strokeDasharray="3 4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{
                        fill: isNight ? "#e8e0d8" : "#6f7258",
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 24]}
                      ticks={[0, 12, 24]}
                      width={28}
                      tick={{
                        fill: isNight ? "#e8e0d8" : "#6f7258",
                        fontSize: 11,
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value) => `${Number(value).toFixed(1)}h`}
                      contentStyle={{
                        backgroundColor: isNight ? "#4a382e" : "#faf7f2",
                        borderColor: isNight ? "#d8cec3" : "#8a7e73",
                        borderRadius: 6,
                      }}
                      cursor={{
                        fill: isNight ? "#8a7e73" : "#e8e0d8",
                        opacity: 0.35,
                      }}
                    />
                    <Bar
                      dataKey="work"
                      name="Work"
                      fill={balanceColors.Work}
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="rest"
                      name="Rest"
                      fill={balanceColors.Rest}
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p
                className={`mt-1 text-[11px] sm:text-xs ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                Based on your repeating daily schedule. Rest is unscheduled
                time.
              </p>
            </div>
          </section>
        </div>
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
  <div className="productivity-page__metric text-center md:border-r md:border-warm-taupe md:last:border-0">
    <p
      className={`productivity-page__metric-value text-3xl font-semibold sm:text-4xl xl:text-5xl ${color}`}>
      {value}
    </p>
    <p
      className={`productivity-page__metric-label mt-2 text-sm sm:mt-3 sm:text-base xl:text-xl ${color === "text-terracotta" ? "text-terracotta" : "text-olive"}`}>
      {label}
    </p>
    <p className="productivity-page__metric-detail mt-2 text-xs text-olive sm:text-sm">
      {detail}
    </p>
  </div>
);

export default ProductivityPage;
