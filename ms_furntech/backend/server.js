const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // your Vite dev URL
app.use(express.json());

app.post("/api/notifications/send-notification", async (req, res) => {
  const { title, description, area, status, token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, error: "FCM token is required" });
  }

  try {
    await admin.messaging().send({
      token,
      notification: {
        title,
        body: description,
      },
      data: {
        area: area || "",
        status: status || "",
      },
    });

    res.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("FCM send error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
