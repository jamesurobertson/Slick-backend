const express = require("express");
const { Message, Channel, UserChannel } = require("../db/models");
const { asyncHandler } = require("../utils");
const {requireAuth} = require('../auth')

const router = express.Router();
router.use(requireAuth)
// Creates a channel
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

//get # of users that belong to a channel
// router.get('/users/:channelId', asyncHandler(async (req, res) => {
//     const channelId = parseInt(req.params.channelId, 10)
//     const number = await UserChannel.findAll({where: {channelId}})
//     res.json(number.length)
// }))

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

// User joins a channel
router.post('/:channelId/:userId', asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.channelId, 10)
    // TODO: get userId from JWT instead of params
    const userId = parseInt(req.params.userId, 10)

    const followed = await UserChannel.create({
        channelId,
        userId,
      });

      res.json(followed)
}))


// updates channel info i.e. the topic
router.put('/:channelId', asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.channelId, 10)
    const channel = await Channel.findByPk(channelId)


    if (channel) {
        await channel.update({topic: req.body.topic})
        res.json({channel})
    } else {
        next()
    }
}))


// Deletes a channel
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
