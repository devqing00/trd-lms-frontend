"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight, Menu, X, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandSearch, SearchTrigger } from "@/components/ui/command-search";
import { NotificationBell } from "@/components/notification-bell";

const navLinks = [
  { label: "Courses", href: "#categories" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Global Cmd+K / Ctrl+K shortcut
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close explore dropdown on outside click
  useEffect(() => {
    if (!exploreOpen) return undefined;
    function handleClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [exploreOpen]);

  // Close explore dropdown on Escape
  useEffect(() => {
    if (!exploreOpen) return undefined;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setExploreOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [exploreOpen]);

  const handleNavClick = () => {
    setMobileOpen(false);
    setExploreOpen(false);
  };

  return (
    <nav
      className="border-border-default bg-bg-primary/80 sticky top-0 z-50 border-b-2 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-accent-blue shadow-hard-sm flex h-10 w-10 items-center justify-center rounded-full">
            <GraduationCap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-display text-text-primary text-xl font-bold tracking-tight">
            TRD LMS
          </span>
        </div>

        {/* ── Desktop / Tablet actions (sm+) ── */}
        <div className="hidden items-center gap-2 sm:flex">
          {/* Inline nav links — visible on xl+ screens, displayed in a straight horizontal line */}
          <div className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-secondary hover:bg-bg-tertiary hover:text-text-primary rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="bg-border-default mx-2 h-6 w-px" />
          </div>

          {/* Explore dropdown — visible on sm to lg screens, hidden on xl+ */}
          <div ref={exploreRef} className="relative xl:hidden">
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              className="border-border-default text-text-secondary hover:border-accent-blue hover:bg-bg-tertiary hover:text-text-primary flex items-center gap-1 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors"
              aria-expanded={exploreOpen ? "true" : "false"}
              aria-haspopup="true"
            >
              Explore
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown panel */}
            {exploreOpen && (
              <div className="border-border-default bg-bg-secondary shadow-hard-card absolute top-full left-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border-2">
                <div className="flex flex-col py-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={handleNavClick}
                      className="text-text-secondary hover:bg-bg-tertiary hover:text-text-primary px-4 py-2.5 text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <SearchTrigger onClick={() => setSearchOpen(true)} />
          <NotificationBell />
          <ThemeToggle />

          {/* Auth buttons — hide on small tablets for space, show md+ */}
          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register" className="hidden md:inline-flex">
            <Button variant="primary" size="sm">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* ── Mobile hamburger (below sm) ── */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setSearchOpen(true)}
            className="border-border-default text-text-secondary hover:bg-bg-tertiary hover:text-text-primary flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="border-border-default text-text-secondary hover:bg-bg-tertiary hover:text-text-primary flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {mobileOpen && (
        <div className="border-border-default bg-bg-secondary border-t-2 px-4 pt-3 pb-4 sm:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleNavClick}
                className="text-text-secondary hover:bg-bg-tertiary hover:text-text-primary rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-border-default my-2 border-t" />
            <Link href="/login" onClick={handleNavClick}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={handleNavClick}>
              <Button variant="primary" size="sm" className="w-full">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Global search dialog */}
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
