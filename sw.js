// Subí la versión cada vez que cambies index.html para que se actualice en los celulares
const CACHE = 'mis-linduras-v3';
const SHELL = ['./', 'index.html', 'admin.html', 'manifest.json', 'admin-manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Supabase y cualquier otro dominio: siempre directo a la red (los turnos nunca se cachean)
  if (url.origin !== location.origin) return;
  // Archivos de la app: red primero (siempre la última versión), caché si no hay señal
  e.respondWith(fetch(req).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r;
  }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
});
