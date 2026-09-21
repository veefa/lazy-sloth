import React, { useEffect, useState } from "react";
import ClockHand from "./ClockHands";
import TimeBlockArc from "./TimeBlockArc";
import {
  addTask,
  categories,
  type Category,
  type Task,
  updateTask,
  useTasks,
} from "./taskStore";

type DraftTask = Omit<Task, "id" | "completed">;
type DragState = {
  id: number;
  mode: "move" | "resize";
  pointerHour: number;
  startHour: number;
  endHour: number;
};

const initialDraft: DraftTask = {
  name: "",
  startHour: 0,
  endHour: 1,
  category: "Work",
};
const normalizeHour = (hour: number) => ((hour % 24) + 24) % 24;
const durationFor = (startHour: number, endHour: number) =>
  (endHour - startHour + 24) % 24;
const roundToQuarterHour = (hour: number) => Math.round(hour * 4) / 4;

const FaceClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const tasks = useTasks();
  const [newTask, setNewTask] = useState<DraftTask>(initialDraft);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const centerX = 200;
  const centerY = 200;
  const radius = 190;
  const INDIGO_DARK = "#1e3a8a";
  const INDIGO = "#e0e7ff";
  const INDIGO_LIGHT = "#818cf8";
  const SLATE_DARK = "#334155";
  const INDIGO_MEDIUM = "#4f46e5";

  const handleAddTask = () => {
    if (
      !newTask.name.trim() ||
      durationFor(newTask.startHour, newTask.endHour) === 0
    )
      return;
    const id = addTask({ ...newTask, name: newTask.name.trim() });
    setSelectedTaskId(id);
    setNewTask(initialDraft);
  };

  const hourFromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 400 - centerX;
    const y = ((event.clientY - bounds.top) / bounds.height) * 400 - centerY;
    return normalizeHour(
      roundToQuarterHour(((Math.atan2(y, x) * 180) / Math.PI + 90) / 15),
    );
  };

  const startDrag = (event: React.PointerEvent<SVGPathElement>, task: Task) => {
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    setSelectedTaskId(task.id);
    setDragState({
      id: task.id,
      mode: "move",
      pointerHour: hourFromPointer(
        event as unknown as React.PointerEvent<SVGSVGElement>,
      ),
      startHour: task.startHour,
      endHour: task.endHour,
    });
  };

  const startResize = (
    event: React.PointerEvent<SVGCircleElement>,
    task: Task,
  ) => {
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    setSelectedTaskId(task.id);
    setDragState({
      id: task.id,
      mode: "resize",
      pointerHour: hourFromPointer(
        event as unknown as React.PointerEvent<SVGSVGElement>,
      ),
      startHour: task.startHour,
      endHour: task.endHour,
    });
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragState) return;
    const pointerHour = hourFromPointer(event);
    if (dragState.mode === "resize") {
      if (durationFor(dragState.startHour, pointerHour) >= 0.25)
        updateTask(dragState.id, { endHour: pointerHour });
      return;
    }
    let delta = pointerHour - dragState.pointerHour;
    if (delta > 12) delta -= 24;
    if (delta < -12) delta += 24;
    updateTask(dragState.id, {
      startHour: normalizeHour(dragState.startHour + delta),
      endHour: normalizeHour(dragState.endHour + delta),
    });
  };

  const hourAngle = ((time.getHours() % 24) + time.getMinutes() / 60) * 15 - 90;
  const minuteAngle = (time.getMinutes() + time.getSeconds() / 60) * 6 - 90;
  const scheduledHours = tasks.reduce(
    (total, task) => total + durationFor(task.startHour, task.endHour),
    0,
  );
  const isOverloaded = scheduledHours > 22;

  return (
    <div className="mx-auto w-full max-w-6xl pt-6">
      <div className="flex flex-col gap-6 md:flex-row-reverse md:items-start md:justify-between">
        <svg
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          className="aspect-square w-full max-w-[420px] self-center touch-none rounded-full md:w-1/2"
          style={{ background: INDIGO }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setDragState(null)}
          onPointerCancel={() => setDragState(null)}>
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill={INDIGO}
            stroke={INDIGO_DARK}
            strokeWidth="7"
          />
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 2 * Math.PI;
            return (
              <text
                key={i}
                x={centerX + radius * 0.94 * Math.sin(angle)}
                y={centerY - radius * 0.94 * Math.cos(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight={i % 6 === 0 ? "bold" : "normal"}
                fontSize={i % 6 === 0 ? 15 : 11}
                fill={INDIGO_DARK}>
                {i}
              </text>
            );
          })}
          <g stroke={INDIGO_LIGHT} strokeWidth="2">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * Math.PI) / 12 - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1={centerX + Math.cos(angle) * 150}
                  y1={centerY + Math.sin(angle) * 150}
                  x2={centerX + Math.cos(angle) * 170}
                  y2={centerY + Math.sin(angle) * 170}
                />
              );
            })}
          </g>
          {tasks.map((task, index) => {
            const arcRadius = 170 - index * 12;
            const duration = durationFor(task.startHour, task.endHour);
            const middleHour = normalizeHour(task.startHour + duration / 2);
            const middleAngle = (middleHour * 15 - 90) * (Math.PI / 180);
            const endAngle = (task.endHour * 15 - 90) * (Math.PI / 180);
            const isSelected = task.id === selectedTaskId;
            return (
              <React.Fragment key={task.id}>
                <TimeBlockArc
                  startHour={task.startHour}
                  endHour={task.endHour}
                  radius={arcRadius}
                  centerX={centerX}
                  centerY={centerY}
                  color={categories[task.category]}
                  opacity={0.58}
                  selected={isSelected}
                  onPointerDown={(event) => startDrag(event, task)}
                />
                <text
                  x={centerX + Math.cos(middleAngle) * radius * 0.4}
                  y={centerY + Math.sin(middleAngle) * radius * 0.4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#1e3a8a"
                  pointerEvents="none">
                  {task.name}
                </text>
                {isSelected && (
                  <circle
                    cx={centerX + Math.cos(endAngle) * arcRadius}
                    cy={centerY + Math.sin(endAngle) * arcRadius}
                    r="8"
                    fill="#fff"
                    stroke="#1e3a8a"
                    strokeWidth="3"
                    className="cursor-ew-resize"
                    onPointerDown={(event) => startResize(event, task)}
                  />
                )}
              </React.Fragment>
            );
          })}
          <ClockHand
            angle={hourAngle}
            length={100}
            width={3}
            color={SLATE_DARK}
            centerX={centerX}
            centerY={centerY}
          />
          <ClockHand
            angle={minuteAngle}
            length={140}
            width={2}
            color={INDIGO_MEDIUM}
            centerX={centerX}
            centerY={centerY}
          />
          <circle cx={centerX} cy={centerY} r={7} fill={INDIGO_MEDIUM} />
        </svg>

        <section
          className="w-full space-y-3 px-4 md:w-80 md:flex-none md:px-0"
          aria-label="Task controls">
          {isOverloaded && (
            <div
              role="alert"
              className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              <p className="font-semibold">Overload warning</p>
              <p className="mt-1">
                You have {scheduledHours.toFixed(1)} hours of scheduled tasks.
                Leave time for sleep and rest.
              </p>
            </div>
          )}
          <div className="rounded-lg border border-indigo-300 bg-white p-3">
            <h2 className="mb-2 font-semibold text-slate-800">Add a task</h2>
            <p className="mb-2 text-xs text-slate-500">
              {scheduledHours.toFixed(1)} hours scheduled today
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Task name"
                className="rounded border border-indigo-300 px-2 py-1"
                value={newTask.name}
                onChange={(event) =>
                  setNewTask((task) => ({ ...task, name: event.target.value }))
                }
              />
              <select
                className="rounded border border-indigo-800 px-2 py-1"
                value={newTask.category}
                onChange={(event) =>
                  setNewTask((task) => ({
                    ...task,
                    category: event.target.value as Category,
                  }))
                }>
                {Object.keys(categories).map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.25"
                min="0"
                max="23.75"
                aria-label="Start time"
                className="rounded border border-[#bcbcbc] px-2 py-1"
                value={newTask.startHour}
                onChange={(event) =>
                  setNewTask((task) => ({
                    ...task,
                    startHour: Number(event.target.value),
                  }))
                }
              />
              <input
                type="number"
                step="0.25"
                min="0"
                max="23.75"
                aria-label="End time"
                className="rounded border border-[#bcbcbc] px-2 py-1"
                value={newTask.endHour}
                onChange={(event) =>
                  setNewTask((task) => ({
                    ...task,
                    endHour: Number(event.target.value),
                  }))
                }
              />
            </div>
            <button
              type="button"
              onClick={handleAddTask}
              disabled={
                !newTask.name.trim() ||
                durationFor(newTask.startHour, newTask.endHour) === 0
              }
              className="mt-3 w-full rounded bg-slate-800 px-4 py-2 font-medium text-indigo-400 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
              Add Task
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FaceClock;
