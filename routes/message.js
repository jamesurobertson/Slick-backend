const express = require("express");
const { Message } = require("../db/models");
const { asyncHandler } = require("../utils");

const router = express.Router();


// Send a message to a channel
router.post(
    "/:channelId/:userId",
    asyncHandler(async (req, res) => {
      const channelId = parseInt(req.params.channelId, 10);
      const userId = parseInt(req.params.userId, 10)
      const { content } = req.body;
      const message = await Message.create({
        userId,
        content,
        messageableType: "channel",
        messageableId: channelId,
        channelId,
      });

      await res.status(201).json({ message });
    })
  );


module.exports = router;
