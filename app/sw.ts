import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, NetworkFirst, NetworkOnly, Serwist, StaleWhileRevalidate } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Only the main list page is allowed to work offline. Everything else
// (edit/catalog, admin) must always hit the network.
const OFFLINE_PATHS = new Set(['/', '/grocerylist']);

// defaultCache from @serwist/next ships its own page-caching rules — for
// full document loads ("pages"), and for the RSC data Next fetches on
// client-side <Link> navigations ("pages-rsc" / "pages-rsc-prefetch").
// Left in place, all three would let every route — including
// /grocerylist/edit and /admin — end up cached and available offline. We
// strip those three out and replace them with our own scoped-down rules
// below, then keep the rest of defaultCache (JS/CSS/font caching etc.)
// as-is, since the app shell still needs those to hydrate the list page
// while offline.
const PAGE_CACHE_NAMES = new Set(['pages', 'pages-rsc', 'pages-rsc-prefetch']);
const defaultCacheWithoutDocuments = defaultCache.filter((entry) => {
  const handler = entry.handler as { cacheName?: string };
  return !PAGE_CACHE_NAMES.has(handler.cacheName ?? '');
});

// True for both a full page load (destination === 'document') and a
// same-origin RSC fetch Next.js makes under the hood for client-side
// navigations — matching how @serwist/next's own default rules detect
// "this request is for page content".
function isPageRequest(request: Request, sameOrigin: boolean, pathname: string): boolean {
  if (!sameOrigin || pathname.startsWith('/api/')) return false;
  if (request.destination === 'document') return true;
  return request.headers.get('RSC') === '1';
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Images: serve from cache first, update in background
    {
      matcher: /\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'product-images',
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              return response && response.status === 200 ? response : null;
            },
          },
        ],
      }),
    },
    // The grocery list page itself: serve from cache first for offline,
    // then try network to update. This ensures the page loads immediately
    // when offline instead of showing the fallback page.
    {
      matcher: ({ request, url, sameOrigin }) =>
        isPageRequest(request, sameOrigin, url.pathname) && OFFLINE_PATHS.has(url.pathname),
      handler: new CacheFirst({
        cacheName: 'grocery-list-page',
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              // Only cache successful responses
              return response && response.status === 200 ? response : null;
            },
          },
        ],
      }),
    },
    // Every other page (edit/catalog, admin, anything else): never cache,
    // never served offline.
    {
      matcher: ({ request, url, sameOrigin }) =>
        isPageRequest(request, sameOrigin, url.pathname) && !OFFLINE_PATHS.has(url.pathname),
      handler: new NetworkOnly(),
    },
    // Default Next.js caching rules for everything that isn't a page
    // document (JS/CSS chunks, fonts, etc.) — needed so the list page can
    // actually render while offline.
    ...defaultCacheWithoutDocuments,
  ],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request, url }) {
          // Only show offline fallback for pages that aren't the grocery list
          // The grocery list should work offline with cached content
          if (request.destination !== 'document') return false;
          const pathname = url.pathname;
          return !OFFLINE_PATHS.has(pathname);
        },
      },
    ],
  },
});

serwist.addEventListeners();
