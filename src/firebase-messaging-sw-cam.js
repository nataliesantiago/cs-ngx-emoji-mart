importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '659384240459'
});
const messaging = firebase.messaging();
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
})
messaging.setBackgroundMessageHandler((payload) => {
  console.log('Message received. ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.body,
    icon: '/assets/images/favicon.png',
    data: '/'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});