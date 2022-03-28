let cacheName = 'CudNatury-v1';

let cacheFiles = [
  "/",
  "/images/**",
  "/fonts/**",
  "/css/**",
  "/js/**"
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installed');

    e.waitUntil(
      caches.open(cacheName).then(function (cache) {
          console.log('[ServiceWorker] Caching cacheFiles');
          return cache.addAll(cacheFiles);
      })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(
      // Get all the cache keys (cacheName)
      caches.keys().then(function (cacheNames) {
          return Promise.all(cacheNames.map(function (thisCacheName) {

              // If a cached item is saved under a previous cacheName
              if (thisCacheName !== cacheName) {

                  // Delete that cached file
                  console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
                  return caches.delete(thisCacheName);
              }
          }));
      })
    ); // end e.waitUntil
});

// self.addEventListener("fetch", function(event) {
//     event.respondWith(
//       fetch(event.request).catch(function() {
//           return caches.match(event.request).then(function(response) {
//               if (response) {
//                   return response;
//               } else if (event.request.headers.get("accept").includes("text/html")) {
//                   return caches.match(offlineURL);
//               }
//           });
//       })
//     );
// });

function update(request) {
    return caches.open(cacheName).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
}
