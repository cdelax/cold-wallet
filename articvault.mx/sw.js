const CACHE_NAME = 'coldwallet-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/main.js',
  '/style.css',
  '/libs/ethers.min.js',
  '/libs/bsv.min.js',
  '/libs/crypto-js.min.js',
  '/assets/icon.png',
  '/assets/splash.png',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
