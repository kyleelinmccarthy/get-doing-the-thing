// Service Worker for Push Notifications

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const payload = event.data.json();

  const options = {
    body: payload.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: payload.data || {},
    actions: [
      { action: "did-it", title: "Did it" },
      { action: "snooze", title: "Snooze" },
    ],
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "Do the thing.", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data;
  const action = event.action;

  let url = "/dashboard";

  if (data.url) {
    url = data.url;
  }

  if (action === "did-it" && data.thingId) {
    url = `/dashboard?action=completed&thingId=${data.thingId}`;
  } else if (action === "snooze" && data.thingId) {
    url = `/dashboard?action=deferred&thingId=${data.thingId}`;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/dashboard") && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});

self.addEventListener("notificationclose", (event) => {
  // Notification dismissed — no action needed for now
});
