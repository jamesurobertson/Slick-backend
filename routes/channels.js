const express = require("express");
const { Message, Channel, UserChannel } = require("../db/models");
const { asyncHandler } = require("../utils");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);


// Creates a channel
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id

    const channel = await Channel.create({ name: `#${name}`, topic: 'Click here to Change Topic'});

    await UserChannel.create({
      channelId: channel.id,
      userId,
    });

    const { id, name: name1, topic } = channel;
    const numUsers = await channel.numUser();
    const payload = {
      id,
      name: name1,
      topic,
      numUsers,
    }

    res.status(201).json(payload);
  })
);

// get all channels

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const channels = await Channel.findAll();
    res.json(channels);
  })
);

// get all messages in a channel
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

// User joins channel
router.post(
  "/:channelName",
  asyncHandler(async (req, res) => {
    const name = req.params.channelName;
    const userId = req.user.id;
    const channel = await Channel.findOne({ where: { name } });
    const { id: channelId, name: name1, topic } = channel;

    await UserChannel.create({
      channelId,
      userId,
    });
    const numUsers = await channel.numUser();
    const payload = {
      id: channelId,
      name: name1,
      topic,
      numUsers,
    }


    res.json(payload);
  })
);

// updates channel info i.e. the topic
router.put(
  "/:channelId",
  asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.channelId, 10);
    const channel = await Channel.findByPk(channelId);

    if (channel) {
      await channel.update({ topic: req.body.topic });
      res.json({ channel });
    } else {
      next();
    }
  })
);

// Deletes a channel
// TODO: Add this feature / leaving channels to front end
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
