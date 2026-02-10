"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    // SSR placeholder to avoid hydration mismatch
    return (
      <button
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full",
          "border-border-default bg-bg-tertiary border-2",
          "transition-all duration-200",
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="text-text-tertiary h-4 w-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "border-border-default bg-bg-tertiary border-2",
        "shadow-hard-neutral-sm",
        "transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "hover:shadow-hard-neutral hover:border-border-strong hover:-translate-y-[2px]",
        "active:translate-y-[2px] active:shadow-none",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="text-accent-amber h-4 w-4" />
      ) : (
        <Moon className="text-accent-blue h-4 w-4" />
      )}
    </button>
  );
}
