const express = require("express");
const { Message, User, Reaction} = require("../db/models");
const { asyncHandler } = require("../utils");
const {requireAuth} = require('../auth')

const router = express.Router();
router.use(requireAuth)

// get all messages
router.get('/', asyncHandler(async (req, res) => {
    const messages = await Message.findAll({
        attributes: ['id', 'createdAt', 'userId', 'content', 'messageableType', 'messageableId'],
        include: [User],
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

router.post('/reaction/:id', asyncHandler( async(req, res) => {
    console.log('do we get here?')
    const messageId = parseInt(req.params.id, 10)
    const {id: emojiId, skin} = req.body
    console.log(req.body)
    const reaction = await Reaction.create({
        messageId,
        emojiId,
        skin: skin || 1
    })

    console.log(reaction)

    res.json(reaction)
}))

router.get('/reactions', asyncHandler(async(req, res) => {
    const reactions = await Reaction.findAll()
    res.json(reactions)
}))

module.exports = router;
