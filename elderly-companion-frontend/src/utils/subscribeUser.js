// src/utils/subscribeUser.js
import axios from 'axios';

// This is the VAPID public key from your .env file
const vapidPublicKey = 'BF_i7vtJmzWL71ktB0IME12QEDARu3r94T9tuVeqeobBwr7OnbpvuN12_UmK2uyvdCr9HZfqOU2rIb5_V0re0vs'; // <-- PASTE YOUR PUBLIC KEY HERE

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUser() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker Registered.');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      console.log('User is subscribed.');

      // Send subscription to the backend
      await axios.post('http://localhost:5000/api/notifications/subscribe', subscription);
      console.log('Subscription sent to server.');

    } catch (err) {
      console.error('Failed to subscribe the user: ', err);
    }
  }
}