"use client";

import { useState, useCallback } from "react";
import {
  StudentSidebar,
  StudentBottomNav,
  StudentMobileHeader,
} from "@/components/student/sidebar";
import { NotificationPanel } from "@/components/student/notification-panel";
import { mockNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/mock-data";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleMarkRead = useCallback((id: string) => {
    markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <div className="bg-bg-primary flex h-screen overflow-hidden">
      <StudentSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <StudentMobileHeader onNotificationsOpen={() => setNotificationsOpen(true)} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        <StudentBottomNav />
      </div>

      <NotificationPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
}
