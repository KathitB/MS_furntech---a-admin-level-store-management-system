// const admin = require("firebase-admin");
// const serviceAccount = require("./ms-furntech-firebase-adminsdk-fbsvc-d75eec4e4b.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;

import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyChxu5eIVM_XAE1onIEKCnXYvjq3RoN-jI",
  authDomain: "fcm-test-123-725a2.firebaseapp.com",
  projectId: "fcm-test-123-725a2",
  storageBucket: "fcm-test-123-725a2.firebasestorage.app",
  messagingSenderId: "789919713098",
  appId: "1:789919713098:web:b8c65d9a6c1ca0b01a23b3",
};

const app = initializeApp(firebaseConfig);

export const messagingPromise = isSupported().then((supported) =>
  supported ? getMessaging(app) : null,
);

export default app;
