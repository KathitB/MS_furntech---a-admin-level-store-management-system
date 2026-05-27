// // importScripts(
// //   "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
// // );
// // importScripts(
// //   "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
// // );

// // firebase.initializeApp({
// //   //   apiKey: "YOUR_API_KEY",
// //   //   authDomain: "YOUR_AUTH_DOMAIN",
// //   //   projectId: "YOUR_PROJECT_ID",
// //   //   storageBucket: "YOUR_STORAGE_BUCKET",
// //   //   messagingSenderId: "YOUR_SENDER_ID",
// //   //   appId: "YOUR_APP_ID",

// //   apiKey: "AIzaSyDLS0ZMN-J_aTrW_RcIg9gEMW98Ku9774s",
// //   authDomain: "ms-furntech.firebaseapp.com",
// //   projectId: "ms-furntech",
// //   storageBucket: "ms-furntech.firebasestorage.app",
// //   messagingSenderId: "508831270378",
// //   appId: "1:508831270378:web:3ede06e0d00c45bf2e9e93",
// //   measurementId: "G-DY5E5731D8",
// // });

// // const messaging = firebase.messaging();

// // messaging.onBackgroundMessage((payload) => {
// //   console.log("Background Message:", payload);

// //   self.registration.showNotification(payload.notification.title, {
// //     body: payload.notification.body,
// //     icon: "/logo192.png",
// //   });
// // });

// // public/firebase-messaging-sw.js
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
// );

// firebase.initializeApp({
//   apiKey: "AIzaSyDLS0ZMN-J_aTrW_RcIg9gEMW98Ku9774s",
//   authDomain: "ms-furntech.firebaseapp.com",
//   projectId: "ms-furntech",
//   storageBucket: "ms-furntech.firebasestorage.app",
//   messagingSenderId: "508831270378",
//   appId: "1:508831270378:web:3ede06e0d00c45bf2e9e93",
// });

// const messaging = firebase.messaging();

// // Handle background notifications
// messaging.onBackgroundMessage((payload) => {
//   console.log("Background message received:", payload);
//   const { title, body } = payload.notification;
//   self.registration.showNotification(title, {
//     body,
//     icon: "/vite.svg", // your app icon
//   });
// });

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyChxu5eIVM_XAE1onIEKCnXYvjq3RoN-jI",
  authDomain: "fcm-test-123-725a2.firebaseapp.com",
  projectId: "fcm-test-123-725a2",
  storageBucket: "fcm-test-123-725a2.firebasestorage.app",
  messagingSenderId: "789919713098",
  appId: "1:789919713090:web:b8c65d9a6c1ca0b01a23b3",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/vite.svg",
  });
});
