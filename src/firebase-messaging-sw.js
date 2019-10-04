importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '537955814682'
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler((payload) => {
  console.log('Message received. ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.body,
    icon: '/assets/images/favicon.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});