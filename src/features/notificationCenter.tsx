import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTasks } from "./taskStore";

export type NotificationType = "free-space" | "overload" | "break";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  unread: boolean;
  read: boolean;
  createdAt: number;
  actionLabel?: string;
  secondaryActionLabel?: string;
};

export type NotificationPreferences = {
  gentleTaskNudges: boolean;
  overloadAwareness: boolean;
  breakReminders: boolean;
};

const defaultPreferences: NotificationPreferences = {
  gentleTaskNudges: true,
  overloadAwareness: true,
  breakReminders: true,
};

const storageKey = "lazy-sloth-notification-settings";

const getDurationHours = (startHour: number, endHour: number) =>
  (endHour - startHour + 24) % 24;

const loadPreferences = (): NotificationPreferences => {
  if (typeof window === "undefined") return defaultPreferences;

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return defaultPreferences;

    return { ...defaultPreferences, ...JSON.parse(saved) };
  } catch {
    return defaultPreferences;
  }
};

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(loadPreferences);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  return { preferences, updatePreference };
};

type NotificationContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  panelOpen: boolean;
  toast: NotificationItem | null;
  openPanel: () => void;
  closePanel: () => void;
  markAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  dismissToast: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

const createNotificationId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  actionLabel?: string,
  secondaryActionLabel?: string,
): NotificationItem => ({
  id: createNotificationId(),
  type,
  title,
  message,
  unread: true,
  read: false,
  createdAt: Date.now(),
  actionLabel,
  secondaryActionLabel,
});

const NotificationPanel = () => {
  const context = useContext(NotificationContext);

  if (!context) return null;

  const {
    notifications,
    unreadCount,
    closePanel,
    markAsRead,
    clearNotification,
  } = context;

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[320px] rounded-2xl border border-warm-taupe bg-warm-ivory p-3 text-olive shadow-2xl md:right-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">Little nudges</h3>
          {unreadCount > 0 && (
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-terracotta px-2 py-0.5 text-xs font-bold text-warm-ivory">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={closePanel}
          className="rounded-full px-2 py-1 text-sm font-medium text-olive transition hover:bg-taupe-light">
          Close
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="rounded-xl bg-taupe-light/70 px-3 py-4 text-sm text-olive/80">
          Nothing to nudge you right now.
        </p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-2xl border p-3 ${notification.unread ? "border-terracotta/70 bg-terracotta/5" : "border-current/10 bg-taupe-light/40"}`}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-olive text-[11px] font-bold text-warm-ivory">
                    {notification.type === "free-space" && "•"}
                    {notification.type === "overload" && "!"}
                    {notification.type === "break" && "◌"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">
                      {notification.title}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <span className="rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warm-ivory">
                    New
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-olive/85">
                {notification.message}
              </p>
              {(notification.actionLabel ||
                notification.secondaryActionLabel) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {notification.actionLabel && (
                    <button
                      type="button"
                      className="rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-warm-ivory transition hover:bg-terracotta/90">
                      {notification.actionLabel}
                    </button>
                  )}
                  {notification.secondaryActionLabel && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="rounded-full border border-olive px-3 py-1.5 text-xs font-semibold text-olive transition hover:bg-olive/10">
                      {notification.secondaryActionLabel}
                    </button>
                  )}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2 text-xs text-olive/70">
                <button
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className="font-medium text-olive underline-offset-2 hover:underline">
                  {notification.read ? "Read" : "Mark as read"}
                </button>
                <button
                  type="button"
                  onClick={() => clearNotification(notification.id)}
                  className="font-medium text-olive underline-offset-2 hover:underline">
                  Clear
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const tasks = useTasks();
  const { preferences } = useNotificationPreferences();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [toast, setToast] = useState<NotificationItem | null>(null);
  const triggeredRef = useRef({
    "free-space": false,
    overload: false,
    break: false,
  });

  const pushNotification = (
    type: NotificationType,
    title: string,
    message: string,
    actionLabel?: string,
    secondaryActionLabel?: string,
  ) => {
    const notification = createNotification(
      type,
      title,
      message,
      actionLabel,
      secondaryActionLabel,
    );

    setNotifications((current) => {
      if (current.some((item) => item.type === type && !item.read)) {
        return current;
      }

      return [notification, ...current];
    });

    setToast(notification);
  };

  useEffect(() => {
    const scheduledHours = tasks.reduce(
      (total, task) => total + getDurationHours(task.startHour, task.endHour),
      0,
    );
    const freeHours = Math.max(0, 24 - scheduledHours);
    const freeMinutes = freeHours * 60;
    const freeSpaceActive = preferences.gentleTaskNudges && freeMinutes >= 30;

    if (freeSpaceActive && !triggeredRef.current["free-space"]) {
      triggeredRef.current["free-space"] = true;
      pushNotification(
        "free-space",
        "You have some space",
        "You have 40 minutes free. Want to work on French practice?",
        "Add to schedule",
        "Not now",
      );
    }

    if (!freeSpaceActive) {
      triggeredRef.current["free-space"] = false;
    }

    const overloadActive = preferences.overloadAwareness && scheduledHours > 22;
    if (overloadActive && !triggeredRef.current.overload) {
      triggeredRef.current.overload = true;
      pushNotification(
        "overload",
        "Your day looks full",
        `You have ${scheduledHours.toFixed(1)} hours planned. Leave some time for sleep and rest.`,
        "Review schedule",
        "Dismiss",
      );
    }

    if (!overloadActive) {
      triggeredRef.current.overload = false;
    }

    const longestFocusBlock = tasks.reduce((longest, task) => {
      if (task.category === "Work" || task.category === "Study") {
        return Math.max(
          longest,
          getDurationHours(task.startHour, task.endHour),
        );
      }
      return longest;
    }, 0);

    const breakActive = preferences.breakReminders && longestFocusBlock >= 2.5;
    if (breakActive && !triggeredRef.current.break) {
      triggeredRef.current.break = true;
      pushNotification(
        "break",
        "Time for a little pause",
        "You’ve been going for a while. A short break might help.",
        "Add break",
        "Not now",
      );
    }

    if (!breakActive) {
      triggeredRef.current.break = false;
    }
  }, [preferences, tasks]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false, read: true }
          : notification,
      ),
    );
  };

  const clearNotification = (id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const value = {
    notifications,
    unreadCount: notifications.filter((item) => item.unread).length,
    panelOpen,
    toast,
    openPanel: () => setPanelOpen(true),
    closePanel: () => setPanelOpen(false),
    markAsRead,
    clearNotification,
    dismissToast: () => setToast(null),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed right-5 bottom-5 z-60 w-[320px] rounded-2xl border border-terracotta bg-olive p-4 text-warm-ivory shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-warm-taupe">
                {toast.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-warm-ivory">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-sm font-medium text-warm-ivory/80 transition hover:text-warm-ivory">
              ×
            </button>
          </div>
          {(toast.actionLabel || toast.secondaryActionLabel) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {toast.actionLabel && (
                <button
                  type="button"
                  className="rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-warm-ivory transition hover:bg-terracotta/90">
                  {toast.actionLabel}
                </button>
              )}
              {toast.secondaryActionLabel && (
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="rounded-full border border-warm-ivory px-3 py-1.5 text-xs font-semibold text-warm-ivory transition hover:bg-warm-ivory/10">
                  {toast.secondaryActionLabel}
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {panelOpen && <NotificationPanel />}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  return context;
};
