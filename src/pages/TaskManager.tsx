import React from "react";
import {
  categories,
  deleteTask,
  type Category,
  type Task,
  updateTask,
  useTasks,
} from "../features/taskStore";
import { useTheme } from "../features/theme";

const formatHour = (hour: number) => {
  const hours = Math.floor(hour) % 24;
  const minutes = Math.round((hour - Math.floor(hour)) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const durationFor = (task: Task) => {
  const duration = (task.endHour - task.startHour + 24) % 24;
  return `${duration.toFixed(2).replace(".00", "")}h`;
};

const TaskManager: React.FC = () => {
  const tasks = useTasks();
  const { theme } = useTheme();
  const isNight = theme === "night";
  const completedCount = tasks.filter((task) => task.completed).length;

  const changeTime = (
    task: Task,
    field: "startHour" | "endHour",
    value: string,
  ) => {
    const hour = Number(value);
    if (!Number.isNaN(hour)) updateTask(task.id, { [field]: hour });
  };

  return (
    <main
      className={`min-h-screen px-5 py-8 md:ml-24 md:px-10 ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-olive"}`}>
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-terracotta">
              Your day
            </p>
            <h1 className="text-4xl font-bold">Task manager</h1>
            <p className={`mt-2 ${isNight ? "text-warm-taupe" : "text-olive"}`}>
              Tasks added on the face clock are saved here.
            </p>
          </div>
          <p
            className={`rounded-full px-4 py-2 text-sm font-semibold ${isNight ? "bg-olive text-warm-ivory" : "bg-olive text-warm-ivory"}`}>
            {completedCount}/{tasks.length} complete
          </p>
        </header>

        {tasks.length === 0 ? (
          <section
            className={`rounded-xl border border-warm-taupe p-8 text-center ${isNight ? "bg-olive" : "bg-taupe-light"}`}>
            <h2 className="text-xl font-semibold">No tasks yet</h2>
            <p className={`mt-2 ${isNight ? "text-warm-taupe" : "text-olive"}`}>
              Add a task from the FaceClock to see it here.
            </p>
          </section>
        ) : (
          <section className="space-y-3" aria-label="Saved tasks">
            {tasks.map((task) => (
              <article
                key={task.id}
                className={`rounded-xl border border-warm-taupe p-4 shadow-sm ${isNight ? "bg-olive" : "bg-taupe-light"}`}>
                <div className="flex flex-wrap items-start gap-4">
                  <label className="mt-1 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(event) =>
                        updateTask(task.id, { completed: event.target.checked })
                      }
                      className="h-5 w-5 accent-olive"
                      aria-label={`Mark ${task.name} as complete`}
                    />
                    <span
                      className={`text-lg font-semibold ${task.completed ? "text-taupe-dark line-through" : ""}`}>
                      {task.name}
                    </span>
                  </label>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: categories[task.category] }}>
                    {task.category}
                  </span>
                  <span
                    className={`ml-auto text-sm font-semibold ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                    {durationFor(task)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_1.2fr_auto] sm:items-end">
                  <label
                    className={`grid gap-1 text-xs font-semibold uppercase tracking-wide ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                    Start
                    <input
                      type="number"
                      min="0"
                      max="23.75"
                      step="0.25"
                      value={task.startHour}
                      onChange={(event) =>
                        changeTime(task, "startHour", event.target.value)
                      }
                      className={`rounded border border-warm-taupe px-2 py-2 text-sm ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-coffee"}`}
                    />
                  </label>
                  <label
                    className={`grid gap-1 text-xs font-semibold uppercase tracking-wide ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                    End
                    <input
                      type="number"
                      min="0"
                      max="23.75"
                      step="0.25"
                      value={task.endHour}
                      onChange={(event) =>
                        changeTime(task, "endHour", event.target.value)
                      }
                      className={`rounded border border-warm-taupe px-2 py-2 text-sm ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-coffee"}`}
                    />
                  </label>
                  <label
                    className={`grid gap-1 text-xs font-semibold uppercase tracking-wide ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                    Category
                    <select
                      value={task.category}
                      onChange={(event) =>
                        updateTask(task.id, {
                          category: event.target.value as Category,
                        })
                      }
                      className={`rounded border border-warm-taupe px-2 py-2 text-sm ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-coffee"}`}>
                      {Object.keys(categories).map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="rounded px-3 py-2 text-sm font-semibold text-terracotta hover:bg-warm-ivory">
                    Delete
                  </button>
                </div>
                <p
                  className={`mt-2 text-xs ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                  {formatHour(task.startHour)} - {formatHour(task.endHour)}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default TaskManager;
