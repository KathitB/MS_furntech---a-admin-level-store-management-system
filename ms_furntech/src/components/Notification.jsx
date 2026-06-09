import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { onMessageListener } from "../firebase";

const Notification = () => {
  useEffect(() => {
    let active = true;

    const listenForMessages = () => {
      onMessageListener()
        .then((payload) => {
          if (!active) return;
          console.log("Foreground message payload in component:", payload);
          if (payload && payload.notification) {
            const { title, body } = payload.notification;
            toast.info(
              <div>
                <strong style={{ display: "block", marginBottom: "4px" }}>{title}</strong>
                <span style={{ fontSize: "0.9em", opacity: 0.9 }}>{body}</span>
              </div>
            );
          }

          listenForMessages();
        })
        .catch((err) => {
          console.log("Error in foreground message listener:", err);
          if (active) {
            setTimeout(listenForMessages, 5000);
          }
        });
    };

    listenForMessages();

    return () => {
      active = false;
    };
  }, []);

  return null;
};

export default Notification;
