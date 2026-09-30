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

const weeklyColors = {
  work: "#c96f4a",
  rest: "#6f7258",
  empty: "#faf7f2",
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
  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weeklyEntries = daysOfWeek.map(() => ({
    work: 0,
    personal: 0,
    health: 0,
    scheduled: 0,
  }));
  tasks.forEach((task) => {
    if (!task.inputAt) return;
    const inputDate = new Date(task.inputAt);
    if (Number.isNaN(inputDate.getTime())) return;

    const dayOffset = Math.floor(
      (Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate(),
      ) -
        Date.UTC(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate(),
        )) /
        86_400_000,
    );
    if (dayOffset < 0 || dayOffset >= weeklyEntries.length) return;

    const day = weeklyEntries[dayOffset];
    const taskHours = durationFor(task.startHour, task.endHour);
    day.scheduled += taskHours;
    if (task.category === "Work") day.work += taskHours;
    else if (task.category === "Health") day.health += taskHours;
    else day.personal += taskHours;
  });

  const weeklyBalance = weeklyEntries.map((entry, index) => {
    const hasSchedule = entry.scheduled > 0;
    return {
      day: daysOfWeek[index],
      work: entry.work,
      rest: hasSchedule
        ? entry.personal + entry.health + Math.max(0, 24 - entry.scheduled)
        : 0,
      placeholder: hasSchedule ? 0 : 18,
      hasSchedule,
    };
  });
  const hasWeeklySchedule = weeklyBalance.some((day) => day.hasSchedule);
  const weeklyWorkHours = weeklyBalance.reduce(
    (total, day) => total + day.work,
    0,
  );
  const weeklyRestHours = weeklyBalance.reduce(
    (total, day) => total + day.rest,
    0,
  );
  const weeklyHoursTotal = weeklyWorkHours + weeklyRestHours;
  const weeklyWorkPercent = weeklyHoursTotal
    ? Math.round((weeklyWorkHours / weeklyHoursTotal) * 100)
    : 0;
  const weeklyRestPercent = weeklyHoursTotal
    ? Math.round((weeklyRestHours / weeklyHoursTotal) * 100)
    : 0;
  const weeklyDaySummary = weeklyBalance
    .filter((day) => day.hasSchedule)
    .map(
      (day) =>
        `${day.day}: ${day.work.toFixed(1)}h Work, ${day.rest.toFixed(1)}h Rest`,
    )
    .join("; ");
  const productivityScore = Math.min(
    100,
    Math.round((scheduledHours / 24) * 100),
  );
  const restScore = 100 - productivityScore;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);
  const learningHours = tasks
    .filter((task) => task.category === "Study")
    .reduce(
      (total, task) => total + durationFor(task.startHour, task.endHour),
      0,
    );
  const activityHours = new Map<string, number>();
  tasks.forEach((task) => {
    const activity = task.name.trim();
    if (activity)
      activityHours.set(
        activity,
        (activityHours.get(activity) ?? 0) +
          durationFor(task.startHour, task.endHour),
      );
  });
  const favoriteActivity = [...activityHours.entries()].sort(
    (first, second) => second[1] - first[1],
  )[0];
  const taskNameCounts = new Map<string, number>();
  tasks.forEach((task) => {
    const normalizedName = task.name.trim().toLocaleLowerCase();
    if (normalizedName)
      taskNameCounts.set(
        normalizedName,
        (taskNameCounts.get(normalizedName) ?? 0) + 1,
      );
  });
  const repeatedTasks = tasks.filter(
    (task) =>
      (taskNameCounts.get(task.name.trim().toLocaleLowerCase()) ?? 0) > 1,
  ).length;
  const completedDays = new Set(
    tasks.flatMap((task) =>
      task.completed && task.completedAt
        ? [new Date(task.completedAt).toDateString()]
        : [],
    ),
  );
  const streakDate = new Date();
  streakDate.setHours(0, 0, 0, 0);
  if (!completedDays.has(streakDate.toDateString()))
    streakDate.setDate(streakDate.getDate() - 1);
  let currentStreak = 0;
  while (completedDays.has(streakDate.toDateString())) {
    currentStreak += 1;
    streakDate.setDate(streakDate.getDate() - 1);
  }

  return (
    <main
      className={`productivity-page min-h-screen px-4 py-6 sm:px-5 sm:py-8 md:ml-24 md:px-8 lg:px-10 2xl:px-12 ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-olive"}`}>
      <div className="productivity-page__content mx-auto max-w-6xl 2xl:max-w-7xl">
        <header className="productivity-page__header mb-3 sm:mb-4">
          <h1 className="productivity-page__title text-3xl font-semibold tracking-tight sm:text-4xl 2xl:text-5xl">
            Productivity
          </h1>
        </header>

        <div className="productivity-page__top-row mb-4 grid min-w-0 gap-4 sm:mb-5 sm:gap-5 2xl:mb-8 2xl:gap-8 sm:grid-cols-[minmax(0,0.85fr)_minmax(18rem,1.15fr)]">
          <section
            aria-label="Greeting"
            className={`productivity-page__greeting-card flex min-h-24 items-center rounded-2xl p-4 sm:min-h-32 sm:p-5 ${isNight ? "bg-olive" : "bg-taupe-light"}`}>
            <p className="text-xl font-semibold sm:text-2xl">Hi, there!</p>
          </section>

          <section
            className={`productivity-page__card min-w-0 rounded-2xl p-3 sm:p-4 ${isNight ? "bg-olive" : "bg-taupe-light"}`}
            aria-labelledby="quick-overview-heading">
            <h2
              id="quick-overview-heading"
              className="mb-3 text-lg font-semibold sm:text-xl">
              Overview
            </h2>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
              <OverviewStat
                label="Current Streak"
                value={`${currentStreak} ${currentStreak === 1 ? "day" : "days"}`}
                detail={currentStreak ? "in a row" : "Complete a task today"}
                isNight={isNight}
              />
              <OverviewStat
                label="Hours Learning"
                value={`${learningHours.toFixed(1)}h`}
                detail="Study tasks scheduled"
                isNight={isNight}
              />
              <OverviewStat
                label="Favorite Activity"
                value={favoriteActivity?.[0] ?? "None yet"}
                detail={`${(favoriteActivity?.[1] ?? 0).toFixed(1)}h scheduled`}
                isNight={isNight}
              />
              <OverviewStat
                label="Repeated Tasks"
                value={String(repeatedTasks)}
                detail="with matching names"
                isNight={isNight}
              />
            </div>
          </section>
        </div>

        <div className="productivity-page__dashboard grid min-w-0 gap-4 sm:gap-5 2xl:gap-8 sm:grid-cols-[minmax(0,0.85fr)_minmax(18rem,1.15fr)]">
          <div className="productivity-page__summary min-w-0 flex flex-col gap-4 sm:gap-5 2xl:gap-8">
            <section
              className={`productivity-page__card productivity-page__summary-card min-w-0 rounded-2xl p-3 sm:p-4 lg:p-5 2xl:p-6 ${isNight ? "bg-olive" : "bg-taupe-light"}`}
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
              className={`productivity-page__card productivity-page__summary-card min-w-0 rounded-2xl p-3 shadow-lg sm:p-4 lg:p-5 2xl:p-6 ${isNight ? "bg-olive" : "bg-taupe-light"}`}
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

          <div className="productivity-page__charts-column flex min-w-0 flex-col gap-4">
            <section
              className={`productivity-page__card productivity-page__balance min-w-0 rounded-2xl p-4 sm:p-5 lg:p-6 2xl:p-8 ${isNight ? "bg-olive" : "bg-taupe-light"}`}
              aria-labelledby="daily-balance-heading">
              <h2
                id="daily-balance-heading"
                className="text-xl font-semibold sm:text-2xl 2xl:text-3xl">
                Daily Balance
              </h2>
              <div className="productivity-page__balance-summary mt-5 flex min-w-0 flex-col items-center gap-4 sm:mt-6 sm:gap-6 xl:flex-row xl:items-center xl:justify-between xl:gap-16 2xl:gap-24">
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
                            <Cell
                              key={category}
                              fill={balanceColors[category]}
                            />
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
                  </div>
                </div>
                <ul className="grid w-full min-w-0 max-w-sm gap-0 sm:gap-1 xl:w-60 xl:max-w-none xl:flex-none 2xl:w-64">
                  {balanceItems.map(({ category, hours, percentage }) => (
                    <li
                      key={category}
                      className="productivity-page__balance-item grid grid-cols-[minmax(0,1fr)_3.5rem_3rem] items-center gap-x-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: balanceColors[category] }}
                          aria-hidden="true"
                        />
                        <span className="truncate font-medium">{category}</span>
                      </span>
                      <span
                        className={`whitespace-nowrap text-right text-xs tabular-nums sm:text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                        {hours.toFixed(1)}h
                      </span>
                      <span
                        className={`whitespace-nowrap text-right text-xs tabular-nums sm:text-sm ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                        {Math.round(percentage)}%
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
                    {hasWeeklySchedule ? (
                      <>
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: weeklyColors.work }}
                            aria-hidden="true"
                          />
                          Work {weeklyWorkPercent}%
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: weeklyColors.rest }}
                            aria-hidden="true"
                          />
                          Rest {weeklyRestPercent}%
                        </span>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: weeklyColors.empty }}
                          aria-hidden="true"
                        />
                        No schedule
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="productivity-page__weekly-chart mt-3 h-44 w-full sm:mt-4 sm:h-52 2xl:h-60"
                  role="img"
                  aria-label={
                    hasWeeklySchedule
                      ? `Weekly Work vs. Rest by task input day: ${weeklyDaySummary}. Rest combines Personal, Health, and unscheduled sleep time.`
                      : "Weekly Work vs. Rest chart. Placeholder bars for Monday through Sunday; no scheduled task data is available."
                  }>
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
                      <YAxis hide domain={[0, 24]} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          const entries =
                            payload?.filter(
                              (entry) =>
                                entry.dataKey !== "placeholder" &&
                                Number(entry.value) > 0,
                            ) ?? [];
                          if (!active || entries.length === 0) return null;

                          return (
                            <div
                              className={`rounded-md border px-3 py-2 text-xs shadow ${isNight ? "border-warm-taupe bg-coffee text-warm-ivory" : "border-taupe-dark bg-warm-ivory text-olive"}`}>
                              <p className="mb-1 font-semibold">{label}</p>
                              {entries.map((entry) => (
                                <p key={String(entry.name)}>
                                  {entry.name}: {Number(entry.value).toFixed(1)}
                                  h
                                </p>
                              ))}
                            </div>
                          );
                        }}
                        cursor={{
                          fill: isNight ? "#8a7e73" : "#e8e0d8",
                          opacity: 0.35,
                        }}
                      />
                      <Bar
                        dataKey="work"
                        name="Work"
                        fill={weeklyColors.work}
                        barSize={18}
                        stackId="daily-hours"
                      />
                      <Bar
                        dataKey="rest"
                        name="Rest"
                        fill={weeklyColors.rest}
                        barSize={18}
                        stackId="daily-hours"
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        dataKey="placeholder"
                        name="No schedule"
                        fill={weeklyColors.empty}
                        barSize={18}
                        stackId="daily-hours"
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p
                  className={`mt-1 text-[11px] sm:text-xs ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                  {hasWeeklySchedule
                    ? "Bars appear on the day task data was entered. Rest combines Personal, Health, and unscheduled sleep time."
                    : "Placeholder bars indicate no scheduled task data; they are not hours."}
                </p>
              </div>
            </section>
          </div>
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

const OverviewStat = ({
  label,
  value,
  detail,
  isNight,
}: {
  label: string;
  value: string;
  detail: string;
  isNight: boolean;
}) => (
  <article
    className={`min-w-0 rounded-lg p-2 sm:p-3 ${isNight ? "bg-coffee" : "bg-warm-ivory"}`}>
    <h3
      className={`text-[11px] font-medium leading-tight sm:text-xs ${isNight ? "text-warm-taupe" : "text-olive"}`}>
      {label}
    </h3>
    <p
      className={`mt-1 truncate text-base font-semibold sm:text-lg ${isNight ? "text-warm-ivory" : "text-olive"}`}
      title={value}>
      {value}
    </p>
    <p
      className={`mt-0.5 text-[10px] leading-tight sm:text-[11px] ${isNight ? "text-warm-taupe" : "text-taupe-dark"}`}>
      {detail}
    </p>
  </article>
);

export default ProductivityPage;
