// public/sw.js
console.log("Service Worker Loaded.");

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log("Push received...", data);
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon.png' // You can add an icon in your public folder
    });
});