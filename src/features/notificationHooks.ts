import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "./notificationContext";
import type { NotificationPreferences } from "./notificationUtils";
import {
  loadNotificationPreferences,
  notificationStorageKey,
} from "./notificationUtils";

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    loadNotificationPreferences,
  );

  useEffect(() => {
    window.localStorage.setItem(
      notificationStorageKey,
      JSON.stringify(preferences),
    );
  }, [preferences]);

  const updatePreference = (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  return { preferences, updatePreference };
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  return context;
};
