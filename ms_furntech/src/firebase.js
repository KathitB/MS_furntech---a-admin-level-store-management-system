// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

// Your web app's Firebase configuration (using fcm-test-123-725a2 to match backend service account)
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const messagingPromise = isSupported().then((supported) =>
  supported ? getMessaging(app) : null,
);

export const requestForToken = () => {
  return messagingPromise.then((messaging) => {
    if (!messaging) {
      console.log("FCM is not supported in this browser.");
      return;
    }
    return getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          console.log("currenttokenforclient ", currentToken);
          localStorage.setItem("FCMToken", currentToken);
          localStorage.setItem("fcmToken", currentToken);
          console.log(currentToken, "currentToken");
        } else {
          console.log(
            "No registration token available. Request permission to generate one.",
          );
        }
      });
  }).catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
  });
};

requestForToken();

export const onMessageListener = () =>
  new Promise((resolve) => {
    messagingPromise.then((messaging) => {
      if (!messaging) return;
      onMessage(messaging, (payload) => {
        console.log("Foreground payload received:", payload);
        resolve(payload);
      });
    });
  });

// Keep misspelled version for safety in case of import checks elsewhere
export const onMessgaeListener = onMessageListener;
