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

export const defaultPreferences: NotificationPreferences = {
  gentleTaskNudges: true,
  overloadAwareness: true,
  breakReminders: true,
};

export const notificationStorageKey = "lazy-sloth-notification-settings";

export const getDurationHours = (startHour: number, endHour: number) =>
  (endHour - startHour + 24) % 24;

export const loadNotificationPreferences = (): NotificationPreferences => {
  if (typeof window === "undefined") return defaultPreferences;

  try {
    const saved = window.localStorage.getItem(notificationStorageKey);
    if (!saved) return defaultPreferences;

    return { ...defaultPreferences, ...JSON.parse(saved) };
  } catch {
    return defaultPreferences;
  }
};
