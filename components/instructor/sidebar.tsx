"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ScanLine,
  Upload,
  ClipboardCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/instructor", icon: LayoutDashboard },
  { label: "My Courses", href: "/instructor/courses", icon: BookOpen },
  { label: "Students", href: "/instructor/students", icon: Users },
  { label: "Attendance", href: "/instructor/attendance", icon: ScanLine },
  { label: "Materials", href: "/instructor/materials", icon: Upload },
  { label: "Grading", href: "/instructor/grading", icon: ClipboardCheck },
];

/** Mobile top bar with hamburger trigger */
export function InstructorMobileHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="border-border-default bg-bg-secondary flex h-14 items-center gap-3 border-b-2 px-4 lg:hidden">
      <button
        onClick={onMenuToggle}
        className="border-border-default text-text-secondary hover:bg-bg-tertiary hover:text-text-primary flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <div className="bg-accent-green shadow-hard-sm flex h-8 w-8 items-center justify-center rounded-lg">
          <GraduationCap className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <span className="font-display text-text-primary text-base font-bold tracking-tight">
          Instructor
        </span>
      </div>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}

/** Sidebar navigation — desktop: permanent, mobile: overlay */
export function InstructorSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose();
    },
    [onMobileClose]
  );

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, handleKeyDown]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="border-border-default flex h-16 items-center justify-between border-b-2 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-accent-green shadow-hard-sm flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          {!collapsed && (
            <span className="font-display text-text-primary text-lg font-bold tracking-tight">
              Instructor
            </span>
          )}
        </div>
        <button
          onClick={onMobileClose}
          className="text-text-secondary hover:text-text-primary flex h-8 w-8 items-center justify-center rounded-lg lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/instructor" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent-green shadow-hard-sm text-white"
                  : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-white" : "text-text-tertiary group-hover:text-text-primary"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-border-default space-y-2 border-t-2 p-3">
        <div className="flex items-center justify-between">
          {!collapsed && <ThemeToggle />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "border-border-default text-text-secondary hidden h-9 w-9 items-center justify-center rounded-xl border-2 transition-all duration-200 lg:flex",
              "hover:bg-bg-tertiary hover:text-text-primary",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "border-border-default bg-bg-secondary hidden h-screen flex-col border-r-2 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:flex",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="bg-bg-secondary fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col shadow-xl lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
