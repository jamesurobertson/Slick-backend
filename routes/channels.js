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

// get all channels

router.get('/', asyncHandler(async(req,res) => {
    const channels = await Channel.findAll()
    res.json(channels)
}))


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
router.post('/:channelName', asyncHandler(async (req, res) => {
    const name = req.params.channelName
    console.log(name)
    // TODO: get userId from JWT instead of params
    const userId = req.user.id

    const channel = await Channel.findOne({where: {name}})
    console.log(channel)
    const {id: channelId } = channel
    console.log(channelId)

    await UserChannel.create({
        channelId,
        userId,
      });

      res.json(channel)
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
