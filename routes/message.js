const express = require("express");
const { Message, User } = require("../db/models");
const { asyncHandler } = require("../utils");
const {requireAuth} = require('../auth')

const router = express.Router();
router.use(requireAuth)

// get all messages
router.get('/', asyncHandler(async (req, res) => {
    const messages = await Message.findAll({
        attributes: ['id', 'createdAt', 'userId', 'content', 'messageableType', 'messageableId'],
        include: [{model:User}]
    })


    await res.json(messages)
}))

// Send a message to a channel
router.post(
    "/:channelId",
    asyncHandler(async (req, res) => {
      const channelId = parseInt(req.params.channelId, 10);
      const userId = req.user.id
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
