"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, BookOpen, Users, Award, FileText, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: "course" | "user" | "certificate" | "page";
  href: string;
}

const TYPE_ICONS: Record<SearchResult["type"], React.ElementType> = {
  course: BookOpen,
  user: Users,
  certificate: Award,
  page: FileText,
};

const TYPE_LABELS: Record<SearchResult["type"], string> = {
  course: "Course",
  user: "User",
  certificate: "Certificate",
  page: "Page",
};

/* ─── Mock search function ─── */

const MOCK_RESULTS: SearchResult[] = [
  { id: "1", title: "ICT Fundamentals", subtitle: "24 enrolled", type: "course", href: "/courses" },
  {
    id: "2",
    title: "Data Analytics Bootcamp",
    subtitle: "16 enrolled",
    type: "course",
    href: "/courses",
  },
  {
    id: "3",
    title: "Research Methods 101",
    subtitle: "18 enrolled",
    type: "course",
    href: "/courses",
  },
  {
    id: "4",
    title: "Dr. Adebayo Ogunleye",
    subtitle: "admin@ui.edu.ng",
    type: "user",
    href: "/admin/users",
  },
  {
    id: "5",
    title: "Funmilayo Adeyemi",
    subtitle: "research@ui.edu.ng",
    type: "user",
    href: "/admin/users",
  },
  {
    id: "6",
    title: "Certificate #TRD-2026-001",
    subtitle: "ICT Fundamentals",
    type: "certificate",
    href: "/certificates",
  },
  { id: "7", title: "Dashboard", type: "page", href: "/dashboard" },
  { id: "8", title: "My Profile", type: "page", href: "/profile" },
  { id: "9", title: "Admin Panel", type: "page", href: "/admin" },
  {
    id: "10",
    title: "Health & Safety Training",
    subtitle: "15 enrolled",
    type: "course",
    href: "/courses",
  },
];

function searchItems(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return MOCK_RESULTS.filter(
    (r) =>
      r.title.toLowerCase().includes(lower) ||
      r.subtitle?.toLowerCase().includes(lower) ||
      r.type.includes(lower)
  ).slice(0, 8);
}

/* ─── Component ─── */

function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <CommandSearchInner onClose={onClose} />;
}

function CommandSearchInner({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Derive results from query — no effect needed
  const results = useMemo(() => searchItems(query), [query]);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      onClose();
      router.push(result.href);
    },
    [onClose, router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    },
    [results, selectedIndex, handleSelect]
  );

  // Only render portal on client side
  if (typeof window === "undefined") return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="rounded-card border-border-default bg-bg-secondary shadow-hard-card fixed inset-x-4 top-[15vh] z-[101] mx-auto max-w-lg overflow-hidden border-2"
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        {/* Search input */}
        <div className="border-border-default flex items-center gap-3 border-b-2 px-5 py-4">
          <Search className="text-text-tertiary h-5 w-5 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, users, certificates…"
            className="text-text-primary placeholder:text-text-tertiary flex-1 bg-transparent text-sm focus:outline-none"
            aria-label="Search"
          />
          <kbd className="border-border-default bg-bg-tertiary text-text-tertiary hidden rounded-lg border px-2 py-0.5 text-[10px] font-medium sm:block">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary sm:hidden"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {query && results.length === 0 && (
            <p className="text-text-tertiary px-4 py-8 text-center text-sm">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!query && (
            <p className="text-text-tertiary px-4 py-8 text-center text-sm">
              Start typing to search across courses, users, and certificates…
            </p>
          )}

          {results.map((result, i) => {
            const Icon = TYPE_ICONS[result.type];
            return (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                  i === selectedIndex ? "bg-accent-blue/10" : "hover:bg-bg-tertiary"
                )}
                role="option"
                aria-selected={i === selectedIndex}
              >
                <div className="bg-bg-tertiary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="text-text-tertiary h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary truncate text-sm font-medium">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-text-tertiary truncate text-xs">{result.subtitle}</p>
                  )}
                </div>
                <span className="text-text-tertiary shrink-0 text-[10px] font-medium tracking-wide uppercase">
                  {TYPE_LABELS[result.type]}
                </span>
                <ArrowRight className="text-text-tertiary h-3 w-3 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="border-border-default flex items-center justify-between border-t px-5 py-2.5">
          <div className="text-text-tertiary flex items-center gap-3 text-[10px]">
            <span>
              <kbd className="border-border-default bg-bg-tertiary rounded border px-1.5 py-0.5">
                ↑↓
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="border-border-default bg-bg-tertiary rounded border px-1.5 py-0.5">
                ↵
              </kbd>{" "}
              select
            </span>
            <span>
              <kbd className="border-border-default bg-bg-tertiary rounded border px-1.5 py-0.5">
                esc
              </kbd>{" "}
              close
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

/** Trigger button for nav bars */
function SearchTrigger({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-border-default bg-bg-secondary text-text-tertiary hover:border-border-strong hover:text-text-secondary flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm transition-colors",
        className
      )}
      aria-label="Open search"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search…</span>
      <kbd className="border-border-default bg-bg-tertiary ml-1 hidden rounded border px-1.5 py-0.5 text-[10px] font-medium lg:block">
        ⌘K
      </kbd>
    </button>
  );
}

export { CommandSearch, SearchTrigger };
