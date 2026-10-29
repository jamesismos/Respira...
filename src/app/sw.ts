'use strict'

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

self.addEventListener("notificationclick", (event) => {
  const requestedPath = event.notification.data?.url;
  const target = new URL(
    typeof requestedPath === "string" ? requestedPath : "/home",
    self.location.origin,
  );

  // Notifications may only navigate inside Respira, never to an external URL.
  if (target.origin !== self.location.origin) {
    target.href = new URL("/home", self.location.origin).href;
  }

  event.notification.close();
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clients) {
        if (new URL(client.url).origin !== self.location.origin) continue;
        try {
          await client.navigate(target.href);
        } catch {
          // A focused existing client is still better than dropping the action.
        }
        return client.focus();
      }

      return self.clients.openWindow(target.href);
    })(),
  );
});
