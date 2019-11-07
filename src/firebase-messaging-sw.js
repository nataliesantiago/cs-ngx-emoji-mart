importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '537955814682'
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
  let ruta = '/';
  if(payload.data.origen == 'recordatorio'){
    ruta = '/' + payload.data.route;
  }
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.body,
    icon: '/assets/images/favicon.png',
    data: ruta
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});