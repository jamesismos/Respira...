self.addEventListener('notificationclick', event => {
  const path = event.notification && event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : '/home'
  const targetUrl = new URL(path, self.location.origin).href

  event.notification.close()
  event.waitUntil((async () => {
    const openClients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    })

    for (const client of openClients) {
      if (new URL(client.url).origin !== self.location.origin) continue
      if ('navigate' in client) await client.navigate(targetUrl)
      return client.focus()
    }

    return self.clients.openWindow(targetUrl)
  })())
})
