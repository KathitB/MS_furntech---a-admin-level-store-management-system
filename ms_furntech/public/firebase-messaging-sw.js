// Import the Firebase app and messaging compat SDKs
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

// Firebase configuration for fcm-test-123-725a2 (matches the backend service account key)
// const firebaseConfig = {
//   apiKey: "AIzaSyChxu5eIVM_XAE1onIEKCnXYvjq3RoN-jI",
//   authDomain: "fcm-test-123-725a2.firebaseapp.com",
//   projectId: "fcm-test-123-725a2",
//   storageBucket: "fcm-test-123-725a2.firebasestorage.app",
//   messagingSenderId: "789919713098",
//   appId: "1:789919713098:web:b8c65d9a6c1ca0b01a23b3"
// };


const firebaseConfig = {
  apiKey: "AIzaSyBntkKVEQ7YJ7S2l2tzDHFJUpAHb1kmQxY",
  authDomain: "furniture-app-notification.firebaseapp.com",
  projectId: "furniture-app-notification",
  storageBucket: "furniture-app-notification.firebasestorage.app",
  messagingSenderId: "298956114705",
  appId: "1:298956114705:web:ba90218dbb5e70f4635ab0"
};

// Initialize Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages by displaying native browser notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  if (payload && payload.notification) {
    const { title, body } = payload.notification;
    self.registration.showNotification(title, {
      body,
      icon: "/vite.svg", // app icon
    });
  }
});