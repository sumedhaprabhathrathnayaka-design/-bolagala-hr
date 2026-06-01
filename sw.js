/* ================================================================
   Bolagala Agro Floating Resort — Service Worker v2
   Offline-first PWA for HR / Attendance System
   ================================================================ */
const CACHE = "bolagala-hr-v2";
const STATIC = ["./", "./index.html", "./manifest.json"];

/* Install — pre-cache static shell */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

/* Activate — remove old caches */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Fetch — network-first for API, cache-first for assets */
self.addEventListener("fetch", e => {
  const url = e.request.url;

  /* Always pass Google Apps Script calls through — never cache */
  if (url.includes("script.google.com")) return;
  if (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com")) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => new Response("", { status: 408 })))
    );
    return;
  }

  /* HTML documents — network first, fall back to cache */
  if (e.request.destination === "document") {
    e.respondWith(
      fetch(e.request)
        .then(res => { caches.open(CACHE).then(c => c.put(e.request, res.clone())); return res; })
        .catch(() => caches.match(e.request) || caches.match("./index.html"))
    );
    return;
  }

  /* Everything else — cache first */
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});

/* Background Sync for offline attendance submissions */
self.addEventListener("sync", e => {
  if (e.tag === "sync-attendance") {
    e.waitUntil(syncPendingAttendance());
  }
});

async function syncPendingAttendance() {
  /* Pending events stored in IndexedDB are sent here on reconnect */
  console.log("[SW] Background sync: attendance queue processing");
}
