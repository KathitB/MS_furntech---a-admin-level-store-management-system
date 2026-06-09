import { getToken, onMessage } from "firebase/messaging";
import { messagingPromise } from "./firebase";

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestNotificationPermission = async () => {
  console.log("VAPID KEY BEING USED:", vapidKey);
  try {
    if (!vapidKey) {
      throw new Error("Firebase VAPID key is not configured.");
    }

    // 1. Register service worker FIRST before anything else
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // 2. Wait for it to be active
    await navigator.serviceWorker.ready;

    // 3. Now get messaging
    const messaging = await messagingPromise;

    if (!messaging) {
      throw new Error("Firebase messaging is not supported in this browser.");
    }

    // 4. Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      console.log("FCM Token:", token);
      localStorage.setItem("fcmToken", token);
      localStorage.setItem("FCMToken", token);

      return token;
    }

    throw new Error("Notification permission denied.");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const foregroundMessage = () =>
  new Promise((resolve) => {
    messagingPromise.then((messaging) => {
      if (!messaging) {
        resolve(null);
        return;
      }
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });
  });
