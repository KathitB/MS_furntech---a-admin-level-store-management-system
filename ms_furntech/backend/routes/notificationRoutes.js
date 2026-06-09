const express = require("express");
const router = express.Router();
const admin = require("../firebase");

router.post("/send-notification", async (req, res) => {
  try {
    const { title, description, token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "FCM token is required",
      });
    }

    const message = {
      notification: {
        title,
        body: description,
      },
      token,
    };

    const response = await admin.messaging().send(message);

    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("FCM Send Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
