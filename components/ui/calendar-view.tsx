"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  endDate?: string;
  color?: "blue" | "green" | "purple" | "amber" | "red";
  type?: string;
}

interface CalendarViewProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

/* ─── Helpers ─── */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EVENT_COLORS: Record<string, string> = {
  blue: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  green: "bg-accent-green/10 text-accent-green border-accent-green/30",
  purple: "bg-accent-purple/10 text-accent-purple border-accent-purple/30",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
  red: "bg-accent-red/10 text-accent-red border-accent-red/30",
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/* ─── Component ─── */

function CalendarView({ events = [], onDateClick, onEventClick, className }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = useMemo(() => new Date(), []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDayOfWeek = days[0]?.getDay() ?? 0;

  // Map events by date string
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = new Date(event.date).toDateString();
      const existing = map.get(key) ?? [];
      existing.push(event);
      map.set(key, existing);
    }
    return map;
  }, [events]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div
      className={cn(
        "rounded-card border-border-default bg-bg-secondary shadow-hard-card border-2 p-4 sm:p-6",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-text-primary text-lg font-bold">
            {MONTHS[month]} {year}
          </h3>
          <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs">
            Today
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-text-tertiary py-1 text-center text-xs font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const dateKey = day.toDateString();
          const dayEvents = eventsByDate.get(dateKey) ?? [];
          const isToday = isSameDay(day, today);

          return (
            <button
              key={dateKey}
              onClick={() => onDateClick?.(day)}
              className={cn(
                "hover:bg-bg-tertiary flex flex-col items-center gap-0.5 rounded-xl p-1 text-center transition-all duration-150",
                isToday && "border-accent-blue/30 bg-accent-blue/5 border-2"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isToday ? "text-accent-blue" : "text-text-primary"
                )}
              >
                {day.getDate()}
              </span>

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        event.color === "green" && "bg-accent-green",
                        event.color === "purple" && "bg-accent-purple",
                        event.color === "amber" && "bg-accent-amber",
                        event.color === "red" && "bg-accent-red",
                        (!event.color || event.color === "blue") && "bg-accent-blue"
                      )}
                      aria-label={event.title}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Upcoming events list */}
      {events.length > 0 && (
        <div className="border-border-default mt-4 border-t pt-4">
          <h4 className="text-text-tertiary mb-2 text-xs font-medium tracking-wide uppercase">
            Upcoming Events
          </h4>
          <div className="space-y-2">
            {events
              .filter((e) => new Date(e.date) >= today)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className={cn(
                    "hover:bg-bg-tertiary flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                    EVENT_COLORS[event.color ?? "blue"]
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{event.title}</p>
                    <p className="text-xs opacity-70">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {event.type && (
                    <Badge variant="default" className="text-[10px]">
                      {event.type}
                    </Badge>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { CalendarView };
