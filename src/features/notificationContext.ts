import { createContext } from "react";
import type { NotificationItem } from "./notificationUtils";

export type NotificationContextValue = {
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

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
