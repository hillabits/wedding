// Minimal service worker: makes the app installable and keeps the shell available offline.
// Network-first, so you always get the newest version when online. API calls (Supabase) are never cached.
const CACHE = 'wedding-dream-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(r, c)); } return res; })
      .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('./') : undefined)))
  );
});
