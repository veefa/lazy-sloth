import React, { useEffect, useState } from "react";
import ClockHand from "./ClockHands";
import TimeBlockArc from "./TimeBlockArc";
import { useTheme } from "./themeHooks";
import slothFaceDay from "../assets/Logo/sloth-face.png";
import slothFaceNight from "../assets/Logo/sloth-face-round-night.png";
import sleepingSlothDay from "../assets/Logo/sleepingSloth-day.svg";
import sleepingSlothNight from "../assets/Logo/sleepy-sloth-night.png";
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
  const { theme } = useTheme();
  const isNight = theme === "night";

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const centerX = 200;
  const centerY = 200;
  const radius = 190;
  const CLOCK_STROKE = isNight ? "#FAF7F2" : "#6F7258";
  const CLOCK_FACE = isNight ? "#6F7258" : "#E8E0D8";
  const CLOCK_TICK = isNight ? "#D8CEC3" : "#8A7E73";
  const HOUR_HAND = isNight ? "#FAF7F2" : "#4A382E";
  const MINUTE_HAND = "#C96F4A";
  const taskTextColor = isNight ? "#FAF7F2" : "#4A382E";

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
  const taskLayouts = tasks.map((task, index) => {
    const arcRadius = 170 - index * 12;
    const duration = durationFor(task.startHour, task.endHour);
    const middleHour = normalizeHour(task.startHour + duration / 2);
    const middleAngle = (middleHour * 15 - 90) * (Math.PI / 180);
    const angleSpan = duration * (Math.PI / 12);
    const requiredLabelWidth = task.name.length * 6.5 + 4;
    const labelRadius = Math.min(
      arcRadius - 10,
      Math.max(arcRadius * 0.55, requiredLabelWidth / angleSpan),
    );
    const fontSize = Math.max(
      8,
      Math.min(
        11,
        (labelRadius * angleSpan) / (Math.max(task.name.length, 1) * 0.62),
      ),
    );
    return {
      task,
      arcRadius,
      middleAngle,
      endAngle: (task.endHour * 15 - 90) * (Math.PI / 180),
      labelX: centerX + Math.cos(middleAngle) * labelRadius,
      labelY: centerY + Math.sin(middleAngle) * labelRadius,
      fontSize,
      isSelected: task.id === selectedTaskId,
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl pt-6">
      <div className="flex flex-col gap-6 md:flex-row-reverse md:items-start md:justify-between">
        <svg
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          className="aspect-square w-full max-w-105 self-center touch-none rounded-full md:w-1/2"
          style={{ background: CLOCK_FACE }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setDragState(null)}
          onPointerCancel={() => setDragState(null)}>
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill={CLOCK_FACE}
            stroke={CLOCK_STROKE}
            strokeWidth="7"
          />
          {taskLayouts.map(({ task, arcRadius, isSelected }) => (
            <TimeBlockArc
              key={task.id}
              startHour={task.startHour}
              endHour={task.endHour}
              radius={arcRadius}
              centerX={centerX}
              centerY={centerY}
              color={categories[task.category]}
              separatorColor={CLOCK_FACE}
              opacity={0.46}
              selected={isSelected}
              onPointerDown={(event) => startDrag(event, task)}
            />
          ))}
          <g stroke={CLOCK_TICK} strokeWidth="2">
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * Math.PI) / 12 - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1={centerX + Math.cos(angle) * 154}
                  y1={centerY + Math.sin(angle) * 154}
                  x2={centerX + Math.cos(angle) * 170}
                  y2={centerY + Math.sin(angle) * 170}
                />
              );
            })}
          </g>
          {[...Array(24)].map((_, i) => {
            const angle = (i * Math.PI) / 12 - Math.PI / 2;
            return (
              <text
                key={i}
                x={centerX + Math.cos(angle) * 181}
                y={centerY + Math.sin(angle) * 181}
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="600"
                fontSize="12"
                fill={CLOCK_STROKE}>
                {i}
              </text>
            );
          })}
          {taskLayouts.map(
            ({ task, labelX, labelY, fontSize, arcRadius, endAngle, isSelected }) => (
              <React.Fragment key={task.id}>
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight="bold"
                  fill={taskTextColor}
                  stroke={CLOCK_FACE}
                  strokeWidth="3"
                  paintOrder="stroke"
                  strokeLinejoin="round"
                  pointerEvents="none">
                  {task.name}
                </text>
                {isSelected && (
                  <circle
                    cx={centerX + Math.cos(endAngle) * arcRadius}
                    cy={centerY + Math.sin(endAngle) * arcRadius}
                    r="8"
                    fill="#fff"
                    stroke={CLOCK_STROKE}
                    strokeWidth="3"
                    className="cursor-ew-resize"
                    onPointerDown={(event) => startResize(event, task)}
                  />
                )}
              </React.Fragment>
            ),
          )}
          <ClockHand
            angle={hourAngle}
            length={100}
            width={3}
            color={HOUR_HAND}
            centerX={centerX}
            centerY={centerY}
          />
          <ClockHand
            angle={minuteAngle}
            length={140}
            width={2}
            color={MINUTE_HAND}
            centerX={centerX}
            centerY={centerY}
          />
          <image
            href={isNight ? slothFaceNight : slothFaceDay}
            x={centerX - 21}
            y={centerY - 21}
            width="42"
            height="42"
            preserveAspectRatio="xMidYMid meet"
            pointerEvents="none"
          />
        </svg>

        <section
          className="w-full space-y-3 px-4 md:w-80 md:flex-none md:px-0"
          aria-label="Task controls">
          {isOverloaded && (
            <div
              role="alert"
              className={`rounded-lg border border-terracotta p-3 text-sm ${isNight ? "bg-olive text-warm-taupe" : "bg-taupe-light text-olive"}`}>
              <p className="font-semibold">Overload warning</p>
              <p className="mt-1">
                You have {scheduledHours.toFixed(1)} hours of scheduled tasks.
                Leave time for sleep and rest.
              </p>
            </div>
          )}
          <div className="relative mt-10">
            <img
              src={isNight ? sleepingSlothNight : sleepingSlothDay}
              alt=""
              aria-hidden="true"
              className="absolute left-1/4 -top-7 z-10 h-16 w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
            />
            <div
              className={`rounded-lg border border-warm-taupe p-3 ${isNight ? "bg-olive text-warm-ivory" : "bg-taupe-light text-olive"}`}>
              <h2 className="mb-2 font-semibold">Add a task</h2>
              <p
                className={`mb-2 text-xs ${isNight ? "text-warm-taupe" : "text-olive"}`}>
                {scheduledHours.toFixed(1)} hours scheduled today
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide">
                  Task name
                  <input
                    type="text"
                    placeholder="What needs doing?"
                    className={`rounded border border-warm-taupe px-2 py-1 normal-case tracking-normal ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-coffee"}`}
                    value={newTask.name}
                    onChange={(event) =>
                      setNewTask((task) => ({
                        ...task,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide">
                  Category
                  <select
                    className={`rounded border border-warm-taupe px-2 py-1 normal-case tracking-normal ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-olive"}`}
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
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide">
                  Start time
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="23.75"
                    aria-label="Start time"
                    className={`rounded border border-warm-taupe px-2 py-1 normal-case tracking-normal ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-olive"}`}
                    value={newTask.startHour}
                    onChange={(event) =>
                      setNewTask((task) => ({
                        ...task,
                        startHour: Number(event.target.value),
                      }))
                    }
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide">
                  End time
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="23.75"
                    aria-label="End time"
                    className={`rounded border border-warm-taupe px-2 py-1 normal-case tracking-normal ${isNight ? "bg-coffee text-warm-ivory" : "bg-warm-ivory text-olive"}`}
                    value={newTask.endHour}
                    onChange={(event) =>
                      setNewTask((task) => ({
                        ...task,
                        endHour: Number(event.target.value),
                      }))
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={handleAddTask}
                disabled={
                  !newTask.name.trim() ||
                  durationFor(newTask.startHour, newTask.endHour) === 0
                }
                className="mt-3 w-full rounded bg-terracotta px-4 py-2 font-medium text-warm-ivory transition-colors hover:bg-coffee disabled:cursor-not-allowed disabled:opacity-50">
                Add Task
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FaceClock;
