"use client";

import { useCallback, useState } from "react";
import { Bell, BookOpen, Award, Clock, AlertCircle, Settings, X, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface AppNotification {
  id: string;
  type: "enrollment" | "certificate" | "reminder" | "waitlist" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

const TYPE_ICONS: Record<AppNotification["type"], React.ElementType> = {
  enrollment: BookOpen,
  certificate: Award,
  reminder: Clock,
  waitlist: AlertCircle,
  system: Settings,
};

const TYPE_COLORS: Record<AppNotification["type"], string> = {
  enrollment: "bg-accent-blue/10 text-accent-blue",
  certificate: "bg-accent-green/10 text-accent-green",
  reminder: "bg-accent-amber/10 text-accent-amber",
  waitlist: "bg-accent-red/10 text-accent-red",
  system: "bg-bg-tertiary text-text-secondary",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ─── Mock Data ─── */

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    type: "enrollment",
    title: "Enrollment Approved",
    message: "Your enrollment for ICT Fundamentals has been approved.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    href: "/courses",
  },
  {
    id: "2",
    type: "waitlist",
    title: "Waitlist Promotion",
    message: "A seat opened up! You've been promoted from the waitlist for Data Analytics.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    href: "/courses",
  },
  {
    id: "3",
    type: "certificate",
    title: "Certificate Ready",
    message: "Your certificate for Research Methods 101 is ready to download.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    href: "/certificates",
  },
  {
    id: "4",
    type: "reminder",
    title: "Session Tomorrow",
    message: "Reminder: Health & Safety session starts tomorrow at 9:00 AM.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "TRD LMS has been updated with new features. Check out what's new!",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

/* ─── Notification Bell (for nav bars) ─── */

function NotificationBell({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-border-default text-text-secondary hover:bg-bg-tertiary hover:text-text-primary relative flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="bg-accent-red absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />

          {/* Panel */}
          <div className="border-border-default bg-bg-secondary shadow-hard-card absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border-2 sm:w-96">
            {/* Header */}
            <div className="border-border-default flex items-center justify-between border-b-2 px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-text-primary text-sm font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-accent-red rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors"
                    aria-label="Mark all as read"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary rounded-lg p-1"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-text-tertiary px-4 py-8 text-center text-sm">No notifications</p>
              ) : (
                notifications.map((notification) => {
                  const Icon = TYPE_ICONS[notification.type];
                  return (
                    <button
                      key={notification.id}
                      onClick={() => {
                        markRead(notification.id);
                        if (notification.href) {
                          setIsOpen(false);
                          // Navigation would happen here with router.push
                        }
                      }}
                      className={cn(
                        "hover:bg-bg-tertiary flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                        !notification.read && "bg-accent-blue/5"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                          TYPE_COLORS[notification.type]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "truncate text-sm",
                              notification.read
                                ? "text-text-secondary"
                                : "text-text-primary font-medium"
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="bg-accent-blue h-2 w-2 shrink-0 rounded-full" />
                          )}
                        </div>
                        <p className="text-text-tertiary mt-0.5 line-clamp-2 text-xs">
                          {notification.message}
                        </p>
                        <p className="text-text-tertiary mt-1 text-[10px]">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { NotificationBell };
