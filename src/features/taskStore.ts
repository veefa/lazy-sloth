import { useSyncExternalStore } from "react";

export const categories = {
  Work: "#dc2626",
  Personal: "#9333ea",
  Health: "#16a34a",
  Study: "#eab308",
} as const;

export type Category = keyof typeof categories;

export type Task = {
  id: number;
  name: string;
  startHour: number;
  endHour: number;
  category: Category;
  completed: boolean;
};

export type TaskDraft = Omit<Task, "id" | "completed">;

const storageKey = "lazy-sloth-tasks";
let tasks: Task[] = [];
const listeners = new Set<() => void>();

const loadTasks = () => {
  if (typeof window === "undefined") return;
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) tasks = JSON.parse(saved) as Task[];
  } catch {
    tasks = [];
  }
};

loadTasks();

const notify = () => {
  if (typeof window !== "undefined")
    window.localStorage.setItem(storageKey, JSON.stringify(tasks));
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => tasks;

export const useTasks = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const addTask = (draft: TaskDraft) => {
  const task: Task = { ...draft, id: Date.now(), completed: false };
  tasks = [...tasks, task];
  notify();
  return task.id;
};

export const updateTask = (id: number, changes: Partial<Omit<Task, "id">>) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, ...changes } : task,
  );
  notify();
};

export const deleteTask = (id: number) => {
  tasks = tasks.filter((task) => task.id !== id);
  notify();
};
