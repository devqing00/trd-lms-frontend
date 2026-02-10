"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Award, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { mockNotifications } from "@/lib/mock-data";

// --- Nav Items ---

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
];

// --- Mobile Bottom Tab Bar ---

export function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border-default bg-bg-secondary fixed inset-x-0 bottom-0 z-40 border-t-2 lg:hidden">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors",
                active ? "text-accent-blue" : "text-text-tertiary hover:text-text-primary"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// --- Desktop Sidebar ---

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:border-border-default lg:bg-bg-secondary hidden lg:flex lg:w-[260px] lg:flex-col lg:border-r-2">
      {/* Logo */}
      <div className="border-border-default flex h-16 items-center gap-2 border-b-2 px-6">
        <Link
          href="/dashboard"
          className="font-display text-text-primary text-xl font-bold tracking-tight"
        >
          LMS<span className="text-accent-blue">.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-accent-blue shadow-hard-sm text-white"
                  : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-border-default border-t-2 p-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}

// --- Mobile Header ---

export function StudentMobileHeader({ onNotificationsOpen }: { onNotificationsOpen: () => void }) {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="border-border-default bg-bg-secondary flex h-14 items-center justify-between border-b-2 px-4 lg:hidden">
      <Link
        href="/dashboard"
        className="font-display text-text-primary text-lg font-bold tracking-tight"
      >
        LMS<span className="text-accent-blue">.</span>
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={onNotificationsOpen}
          className="text-text-secondary hover:bg-bg-tertiary hover:text-text-primary relative rounded-xl p-2 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="bg-accent-red absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
