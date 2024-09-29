'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "2c128b71f476ac11522ac17fb20e3297",
"assets/AssetManifest.bin.json": "10a3d5a3deebb64f74a8cb07c5599d4b",
"assets/AssetManifest.json": "ae2e3dd92803af7c0868b31c86499b2e",
"assets/assets/images/android.png": "16d76bcc1b7c452ee1a0d10bd9f3c9a1",
"assets/assets/images/countdown-app.jpeg": "13a957c3032cdcf54fdf6fc8fa8116e5",
"assets/assets/images/dart.png": "75566a02b5bef2aa0a7425a79cb8655c",
"assets/assets/images/flutter.png": "0a674529a450354b57ba26279d7a37bc",
"assets/assets/images/ios.png": "18c20820f0ac8df484df61d49a49c1b5",
"assets/assets/images/logo.png": "8c2b6f1da6274a3166e8606c7b8ffb61",
"assets/assets/images/mobile-app.png": "e84c6df94d5c7b7765be2c041bceee59",
"assets/assets/images/todo-app.jpeg": "ae8604d2d7b441fe67128d898ffe45a3",
"assets/assets/images/voting-app.jpeg": "be37b85186c6589a1830ad6e3c7f70f7",
"assets/assets/images/waseemullahkhan.png": "63ca59f462e5157a325680e63c4f8224",
"assets/assets/images/web-app.png": "1f3b68264d0df4a4d0e1ee2a0b7a589b",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "97c556f0045704601c0fb0960df557d3",
"assets/NOTICES": "d3a3d80e02b466517e2e081949548734",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "be5fdd5875f2ac91182a98dec12b5ff2",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "220db5cfe5e14e729625099b0bfcaee8",
"icons/Icon-192.png": "c0c22b2c302b984b12b2725378e18156",
"icons/Icon-512.png": "bcb913635a10579527c4ee92929ae244",
"icons/Icon-maskable-192.png": "2574a300d7aae01003f277f549a057be",
"icons/Icon-maskable-512.png": "6ef7d52f4b20e4b0f105cefc0bcc3b7c",
"index.html": "b22335b0474d60b38552f8d21e58b9d4",
"/": "b22335b0474d60b38552f8d21e58b9d4",
"main.dart.js": "1b049805c0e1f2b57af7647feeac5b95",
"manifest.json": "e74af8957b5899dc6da961caee768ec9",
"splash/img/dark-1x.png": "b79662bbb6d44b01ea647dfd56b57782",
"splash/img/dark-2x.png": "fb9ae0fb67ce50267b2033407d70f006",
"splash/img/dark-3x.png": "0d97104eff62d195aa8e831783722d2d",
"splash/img/dark-4x.png": "14392ae60039bb2e01af34959f2e4b30",
"splash/img/light-1x.png": "b79662bbb6d44b01ea647dfd56b57782",
"splash/img/light-2x.png": "fb9ae0fb67ce50267b2033407d70f006",
"splash/img/light-3x.png": "0d97104eff62d195aa8e831783722d2d",
"splash/img/light-4x.png": "14392ae60039bb2e01af34959f2e4b30",
"version.json": "0325640b78b9f97959290dc5ebb8b3ed"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
