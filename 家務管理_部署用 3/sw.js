// Service Worker for 家務管理 PWA
const VERSION = 'housework-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

// 收到 Web Push 推播時顯示系統通知（需要 server-side push 才會真的觸發）
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(_) {}
  const title = data.title || '家務管理新訊息';
  const body = data.body || '';
  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: data.tag || 'msg',
      requireInteraction: !!data.urgent,
      vibrate: data.urgent ? [300,150,300,150,300] : [200],
      data: data,
    })
  );
});

// 通知點擊：打開或聚焦到 App
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if ('focus' in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow('/');
      })
  );
});
