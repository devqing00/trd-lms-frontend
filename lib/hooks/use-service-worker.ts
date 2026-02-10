"use client";

import { useEffect } from "react";

/**
 * Registers the service worker and sets up background sync.
 * Call this in the root layout or instructor layout.
 */
export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[SW] Registered with scope:", registration.scope);

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated" && navigator.serviceWorker.controller) {
                console.log("[SW] New version available");
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log("[SW] Registration failed:", err);
      });
  }, []);
}

/**
 * Store attendance data in IndexedDB for offline sync.
 * When online, the service worker's background sync will POST these.
 */
export async function queueAttendanceForSync(record: {
  enrollmentId: string;
  userId: string;
  courseId: string;
  date: string;
  status: string;
  method: string;
}): Promise<void> {
  if (typeof window === "undefined") return;

  const db = await openDB();
  const tx = db.transaction("pending-attendance", "readwrite");
  const store = tx.objectStore("pending-attendance");
  await new Promise<void>((resolve, reject) => {
    const request = store.put({
      ...record,
      id: `pending-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
    });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  // Request sync if available
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (
        registration as unknown as { sync: { register: (tag: string) => Promise<void> } }
      ).sync.register("sync-attendance");
    } catch {
      // Sync not supported — will be sent on next page load
    }
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("lms-offline", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("pending-attendance")) {
        db.createObjectStore("pending-attendance", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
