/// <reference lib="webworker" />

// Service Worker for TRD LMS PWA
// Provides offline caching, asset caching, and background sync

const CACHE_NAME = "trd-lms-cache-v2";
const OFFLINE_FALLBACK = "/offline.html";

// Assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/courses",
  "/dashboard",
  "/login",
  "/manifest.json",
];

// Offline fallback HTML (embedded to avoid extra network request)
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - TRD LMS</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #FAFAFA; color: #09090B; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; }
    .container { text-align: center; max-width: 400px; }
    .icon { width: 64px; height: 64px; margin: 0 auto 1.5rem; background: #3B82F6; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .icon svg { width: 32px; height: 32px; color: white; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #52525B; margin-bottom: 1.5rem; }
    button { background: #3B82F6; color: white; border: none; padding: 0.75rem 2rem; border-radius: 999px; font-weight: bold; cursor: pointer; font-size: 1rem; }
    button:hover { background: #60A5FA; }
    @media (prefers-color-scheme: dark) {
      body { background: #09090B; color: #FAFAFA; }
      p { color: #A1A1AA; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072M15.536 8.464a5 5 0 010 7.072M12 12h.01"/>
      </svg>
    </div>
    <h1>You're Offline</h1>
    <p>It looks like you've lost your internet connection. Some features may be limited.</p>
    <button onclick="window.location.reload()">Try Again</button>
  </div>
</body>
</html>`;

// Install: pre-cache shell and offline page
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache the offline fallback page
      const offlineResponse = new Response(OFFLINE_HTML, {
        headers: { "Content-Type": "text/html" },
      });
      await cache.put(OFFLINE_FALLBACK, offlineResponse);

      // Pre-cache app shell (ignore failures for individual URLs)
      const promises = PRECACHE_URLS.map((url) =>
        cache.add(url).catch(() => {
          console.log(`[SW] Failed to pre-cache: ${url}`);
        })
      );
      await Promise.all(promises);
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith("http")) return;

  // API requests: Network-first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ?? new Response(JSON.stringify({ error: "Offline" }), {
                status: 503,
                headers: { "Content-Type": "application/json" },
              })
          )
        )
    );
    return;
  }

  // Static assets: Cache-first (fonts, images, JS, CSS)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2?|ttf|otf|ico|webp|avif)$/) ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            if (response.ok) {
              const cloned = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            }
            return response;
          }).catch(() => new Response("", { status: 503 }))
      )
    );
    return;
  }

  // Pages: Network-first with offline fallback
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached ?? caches.match(OFFLINE_FALLBACK))
            .then((response) => response ?? new Response(OFFLINE_HTML, {
              headers: { "Content-Type": "text/html" },
            }))
        )
    );
    return;
  }

  // Everything else: Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => cached ?? new Response("", { status: 503 }));

      return cached ?? fetchPromise;
    })
  );
});

// Background Sync: replay attendance records when online
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-attendance") {
    event.waitUntil(syncAttendance());
  }
});

async function syncAttendance() {
  try {
    const db = await openDB();
    const tx = db.transaction("pending-attendance", "readonly");
    const store = tx.objectStore("pending-attendance");
    const allRecords = await getAllFromStore(store);

    for (const record of allRecords) {
      try {
        await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        });
        // Remove from pending on success
        const deleteTx = db.transaction("pending-attendance", "readwrite");
        deleteTx.objectStore("pending-attendance").delete(record.id);
      } catch {
        // Will retry on next sync
        break;
      }
    }
  } catch {
    // IndexedDB not available or empty
  }
}

function openDB() {
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

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title ?? "TRD LMS", {
        body: data.body ?? "",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: data.tag ?? "default",
        data: data.url ? { url: data.url } : undefined,
      })
    );
  } catch {
    // Non-JSON push data
  }
});

// Notification click: open URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // Focus existing tab if available
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open new tab
      return self.clients.openWindow(url);
    })
  );
});
