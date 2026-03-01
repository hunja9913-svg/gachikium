const CACHE = 'gachikium-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/hangul-touch.html',
  '/number-touch.html',
  '/quiz-hint.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 페이지 이동(navigate)은 브라우저에게 위임 — Cloudflare 리다이렉트 충돌 방지
  if (e.request.mode === 'navigate') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request.url)  // URL로 재요청해 redirect:follow 보장
    )
  );
});


