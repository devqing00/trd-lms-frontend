"use client";

import { useEffect } from "react";
import { Bell, BookOpen, Award, Clock, AlertCircle, Settings, X, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/mock-data";

const TYPE_ICONS: Record<Notification["type"], React.ElementType> = {
  enrollment: BookOpen,
  certificate: Award,
  reminder: Clock,
  waitlist: AlertCircle,
  system: Settings,
};

const TYPE_COLORS: Record<Notification["type"], string> = {
  enrollment: "bg-accent-blue/10 text-accent-blue",
  certificate: "bg-accent-green/10 text-accent-green",
  reminder: "bg-accent-amber/10 text-accent-amber",
  waitlist: "bg-accent-red/10 text-accent-red",
  system: "bg-bg-tertiary text-text-secondary",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationPanel({
  open,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="border-border-default bg-bg-secondary fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l-2 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-border-default flex items-center justify-between border-b-2 px-5 py-4">
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-text-primary" />
              <h2 className="font-display text-text-primary text-lg font-bold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-accent-red rounded-full px-2 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-accent-blue hover:bg-accent-blue/10 flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors"
                  aria-label="Mark all notifications as read"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="text-text-secondary hover:bg-bg-tertiary hover:text-text-primary rounded-xl p-1.5 transition-colors"
                aria-label="Close notifications"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-text-tertiary flex flex-col items-center justify-center py-16">
                <Bell size={40} className="mb-3 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-border-default divide-y">
                {notifications.map((notif) => {
                  const Icon = TYPE_ICONS[notif.type];
                  return (
                    <button
                      key={notif.id}
                      onClick={() => !notif.read && onMarkRead(notif.id)}
                      className={cn(
                        "hover:bg-bg-tertiary flex w-full items-start gap-3 px-5 py-4 text-left transition-colors",
                        !notif.read && "bg-accent-blue/5"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          TYPE_COLORS[notif.type]
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "truncate text-sm",
                              notif.read
                                ? "text-text-secondary font-medium"
                                : "text-text-primary font-semibold"
                            )}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="bg-accent-blue h-2 w-2 shrink-0 rounded-full" />
                          )}
                        </div>
                        <p className="text-text-tertiary mt-0.5 line-clamp-2 text-xs">
                          {notif.message}
                        </p>
                        <p className="text-text-tertiary mt-1 text-[11px]">
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
