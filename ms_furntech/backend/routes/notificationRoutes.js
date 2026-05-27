const express = require("express");
const router = express.Router();
const admin = require("../firebase");

router.post("/send-notification", async (req, res) => {
  try {
    const { title, description, token } = req.body;

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
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
