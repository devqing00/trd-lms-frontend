"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerOptions {
  /** Total time in seconds */
  totalSeconds: number;
  /** Called when timer reaches zero */
  onExpire?: () => void;
  /** Auto-start the timer */
  autoStart?: boolean;
}

interface UseTimerReturn {
  /** Remaining time in seconds */
  remaining: number;
  /** Whether the timer is running */
  isRunning: boolean;
  /** Whether time has expired */
  isExpired: boolean;
  /** Start or resume the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset to initial value */
  reset: () => void;
  /** Formatted time string "MM:SS" */
  formatted: string;
  /** Progress percentage (0–100) remaining */
  progress: number;
}

export function useTimer({
  totalSeconds,
  onExpire,
  autoStart = false,
}: UseTimerOptions): UseTimerReturn {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);

  // Keep onExpire ref current without causing effect re-runs
  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!isRunning || isExpired) return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsExpired(true);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isExpired]);

  const start = useCallback(() => {
    if (!isExpired) setIsRunning(true);
  }, [isExpired]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setRemaining(totalSeconds);
    setIsRunning(false);
    setIsExpired(false);
  }, [totalSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;

  return {
    remaining,
    isRunning,
    isExpired,
    start,
    pause,
    reset,
    formatted,
    progress,
  };
}
