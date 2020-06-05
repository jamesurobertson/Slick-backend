const express = require("express");
const { Message, Channel, UserChannel } = require("../db/models");
const { asyncHandler } = require("../utils");

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, userId } = req.body;
    const channel = await Channel.create({ name: `#${name}` });
    res.status(201).json({ channel });

    await UserChannel.create({
      channelId: channel.id,
      userId,
    });
  })

);

router.get(
  "/:id(\\d+)",
  asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.id, 10);
    const messages = await Message.findAll({
      where: { messageableType: "channel", messageableId: channelId },
    });

    res.json({ messages });
  })
);

router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.id, 10);
    const { userId, content } = req.body;
    const message = await Message.create({
      userId,
      content,
      messageableType: "channel",
      messageableId: channelId,
      channelId,
    });

    const user = await res.status(201).json({ message });
  })
);

router.post('/:channelId/:userId', asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.channelId, 10)
    const userId = parseInt(req.params.userId, 10)

    const followed = await UserChannel.create({
        channelId,
        userId,
      });

      res.json(followed)
}))


router.delete(
  "/:id(\\d+)",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    const messages = await Message.findAll({
      where: { messageableId: id },
    });

    const userChannels = await UserChannel.findAll({
      where: { channelId: id },
    });

    const channel = await Channel.findOne({
      where: { id },
    });

    if (userChannels) {
      userChannels.forEach((channel) => channel.destroy());
    }

    if (messages) {
      messages.forEach((message) => message.destroy());
    }

    channel.destroy();

    res.send(204).end();
  })
);

module.exports = router;