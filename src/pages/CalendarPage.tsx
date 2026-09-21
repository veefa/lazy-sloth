import React, { useMemo, useState } from "react";
import { categories, type Task, useTasks } from "../features/taskStore";

type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const sameDay = (first: Date, second: Date) =>
  startOfDay(first).getTime() === startOfDay(second).getTime();

const formatTime = (hour: number) => {
  const hours = Math.floor(hour) % 24;
  const minutes = Math.round((hour - Math.floor(hour)) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const getCalendarDays = (month: Date): CalendarDay[] => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(
    month.getFullYear(),
    month.getMonth(),
    1 - firstDay.getDay(),
  );
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return { date, currentMonth: date.getMonth() === month.getMonth() };
  });
};

const CalendarPage: React.FC = () => {
  const tasks = useTasks();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [month, setMonth] = useState(today);
  const [view, setView] = useState("Month");
  const days = useMemo(() => getCalendarDays(month), [month]);
  const monthLabel = month.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const yearLabel = String(month.getFullYear());

  const tasksForDay = (date: Date) => (sameDay(date, today) ? tasks : []);

  const shiftMonth = (amount: number) => {
    setMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + (view === "Month" ? amount * 12 : amount),
          1,
        ),
    );
  };

  return (
    <main className="min-h-screen bg-olive px-4 pb-8 pt-5 text-warm-taupe md:ml-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="rounded-full px-2 text-2xl text-warm-taupe hover:bg-terracotta hover:text-olive">
              &#8249;
            </button>
            <h1 className="min-w-32 text-3xl font-semibold tracking-tight">
              {view === "Month" ? yearLabel : monthLabel}
            </h1>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="rounded-full px-2 text-2xl text-warm-taupe hover:bg-terracotta hover:text-olive">
              &#8250;
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonth(today)}
              className="rounded-md border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 hover:border-neutral-500 hover:text-terracotta">
              Today
            </button>
            <button
              type="button"
              aria-label="Calendar options"
              className="rounded-md px-3 py-2 text-xl text-warm-taupe    hover:bg-warm-ivory hover:text-terracotta">
              &#8942;
            </button>
          </div>
        </header>

        <nav
          aria-label="Calendar views"
          className="mt-8 flex gap-7 border-b border-terracotta text-lg text-warm-taupe">
          {["Month", "Week"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              className={`border-b-2 px-1 pb-3 ${view === option ? "border-terracotta text-terracotta" : "border-transparent hover:text-neutral-200"}`}>
              {option}
            </button>
          ))}
        </nav>

        <section
          className="mt-5 overflow-hidden rounded-lg border border-olive-600"
          aria-label={`${monthLabel} calendar`}>
          {view === "Month" ? (
            <div className="grid grid-cols-1 gap-px bg-neutral-900 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }, (_, monthIndex) => {
                const overviewMonth = new Date(
                  month.getFullYear(),
                  monthIndex,
                  1,
                );
                return (
                  <article key={monthIndex} className="bg-olive-800 p-3">
                    <h2 className="mb-2 text-sm font-semibold text-warm-taupe">
                      {overviewMonth.toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </h2>
                    <div className="mb-1 grid grid-cols-7 text-center text-[9px] uppercase text-neutral-600">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <span key={`${day}-${index}`}>{day}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                      {getCalendarDays(overviewMonth).map(
                        ({ date, currentMonth }) => {
                          const isToday = sameDay(date, today);
                          const hasTasks = tasksForDay(date).length > 0;
                          return (
                            <span
                              key={date.toISOString()}
                              className={`relative mx-auto flex h-5 w-5 items-center justify-center ${!currentMonth ? "text-neutral-800" : "text-neutral-500"} ${isToday ? "rounded-full bg-terracotta font-bold text-warm-taupe" : ""}`}>
                              {date.getMonth() === monthIndex
                                ? date.getDate()
                                : ""}
                              {hasTasks && !isToday && (
                                <i
                                  className="absolute bottom-0 h-1 w-1 rounded-full"
                                  style={{
                                    backgroundColor:
                                      categories[tasks[0].category],
                                  }}
                                />
                              )}
                            </span>
                          );
                        },
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 border-b border-olive-600 bg-olive-800">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-warm-taupe sm:px-4 sm:text-sm">
                      {day}
                    </div>
                  ),
                )}
              </div>
              <div className="grid grid-cols-7">
                {days.map(({ date, currentMonth }) => {
                  const dayTasks = tasksForDay(date);
                  const isToday = sameDay(date, today);
                  return (
                    <div
                      key={date.toISOString()}
                      className={`min-h-28 border-b border-r border-olive p-2 sm:min-h-36 sm:p-3 ${currentMonth ? "bg-olive-800" : "bg-olive-700/70"}`}>
                      <div
                        className={`flex h-8 w-8 items-center justify-center text-sm ${!currentMonth ? "text-warm-ivory" : "text-warm-taupe"} ${isToday ? "rounded-full bg-terracotta font-bold text-warm-taupe" : ""}`}>
                        {date.getDate()}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayTasks.map((task: Task) => (
                          <div
                            key={task.id}
                            className={`truncate rounded px-1.5 py-1 text-left text-[11px] font-medium text-war ${task.completed ? "opacity-40 line-through" : ""}`}
                            style={{
                              backgroundColor: `${categories[task.category]}cc`,
                            }}
                            title={`${task.name}, ${formatTime(task.startHour)} - ${formatTime(task.endHour)}`}>
                            <span className="hidden sm:inline">
                              {formatTime(task.startHour)}{" "}
                            </span>
                            {task.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <footer className="mt-5 flex flex-wrap items-center gap-4 text-xs text-warm-ivory">
          <span>
            {tasks.length} saved {tasks.length === 1 ? "task" : "tasks"}
          </span>
          {Object.entries(categories).map(([name, color]) => (
            <span key={name} className="flex items-center gap-1.5">
              <i
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {name}
            </span>
          ))}
        </footer>
      </div>
    </main>
  );
};

export default CalendarPage;
