"use client";

import { useState, useEffect, type ReactNode } from "react";
import {
  MdCheckCircle,
  MdOutlineHandyman,
  MdOutlineInfo,
  MdOutlineLocalOffer,
  MdOutlineNotifications,
  MdOutlineWaterDrop,
  MdStar,
} from "react-icons/md";
import { useGetNotificationsQuery } from "@/redux/features/customer/notifications/notificationsApi";

type NotificationType = "request" | "review" | "offer" | "system" | "update";

interface ApiNotification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  service_request: number | null;
  created_at_human: string;
}

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const iconMap: Record<
  NotificationType,
  { icon: ReactNode; bg: string; color: string }
> = {
  request: {
    icon: <MdOutlineWaterDrop size={20} />,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    color: "text-blue-500",
  },
  review: {
    icon: <MdStar size={20} />,
    bg: "bg-amber-50 dark:bg-amber-900/20",
    color: "text-amber-500",
  },
  offer: {
    icon: <MdOutlineLocalOffer size={20} />,
    bg: "bg-green-50 dark:bg-green-900/20",
    color: "text-green-500",
  },
  system: {
    icon: <MdOutlineInfo size={20} />,
    bg: "bg-purple-50 dark:bg-purple-900/20",
    color: "text-purple-500",
  },
  update: {
    icon: <MdOutlineHandyman size={20} />,
    bg: "bg-orange-50 dark:bg-orange-900/20",
    color: "text-orange-500",
  },
};

/** Derive a NotificationType from the notification title/context */
function inferType(notification: ApiNotification): NotificationType {
  const title = notification.title.toLowerCase();

  if (
    title.includes("request") ||
    title.includes("quote") ||
    title.includes("accepted") ||
    title.includes("started") ||
    title.includes("route") ||
    title.includes("way")
  ) {
    return "request";
  }
  if (title.includes("review") || title.includes("star") || title.includes("rating")) {
    return "review";
  }
  if (
    title.includes("offer") ||
    title.includes("discount") ||
    title.includes("refer") ||
    title.includes("earn") ||
    title.includes("promo")
  ) {
    return "offer";
  }
  if (
    title.includes("completed") ||
    title.includes("done") ||
    title.includes("diagnosis") ||
    title.includes("ready")
  ) {
    return "update";
  }
  // Default: system (welcome, account, verification, etc.)
  return "system";
}

/** Map API response shape → internal Notification shape */
function mapApiNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    type: inferType(n),
    title: n.title,
    message: n.message,
    time: n.created_at_human,
    read: n.is_read,
  };
}

export default function Notifications() {
  const { data, isLoading, isError } = useGetNotificationsQuery<{
    data: ApiNotification[] | undefined;
    isLoading: boolean;
    isError: boolean;
  }>(undefined);

  const [items, setItems] = useState<Notification[]>([]);

  // Sync API data into local state so mark-as-read works optimistically
  useEffect(() => {
    if (data) {
      setItems(data.map(mapApiNotification));
    }
  }, [data]);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 dark:bg-gray-600 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h2>
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <MdOutlineNotifications size={48} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">Failed to load notifications</p>
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-75 transition-opacity"
          >
            <MdCheckCircle size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <MdOutlineNotifications size={48} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((notification) => {
            const { icon, bg, color } = iconMap[notification.type];
            return (
              <div
                key={notification.id}
                onClick={() => markRead(notification.id)}
                className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${notification.read
                  ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                  : "bg-blue-50/40 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800"
                  }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}
                >
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`text-sm font-bold leading-tight ${notification.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                {/* Unread dot */}
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}