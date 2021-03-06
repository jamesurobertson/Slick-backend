const express = require("express");
const { Message, User, Reaction } = require("../db/models");
const { asyncHandler } = require("../utils");
const { requireAuth } = require("../auth");

const router = express.Router();
router.use(requireAuth);

// get all messages
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const messages = await Message.findAll({
      attributes: [
        "id",
        "createdAt",
        "userId",
        "content",
        "messageableType",
        "messageableId",
      ],
      include: [User],
    });

    await res.json(messages);
  })
);

// Send a message to a channel
router.post(
  "/:channelId",
  asyncHandler(async (req, res) => {
    const channelId = parseInt(req.params.channelId, 10);
    const userId = req.user.id;
    const { content } = req.body;
    const message = await Message.create({
      userId,
      content,
      messageableType: "channel",
      messageableId: channelId,
    });

    await res.status(201).json({ message });
  })
);

router.post(
  "/reaction/:id",
  asyncHandler(async (req, res) => {
    const messageId = parseInt(req.params.id, 10);
    const { id: emojiId, skin } = req.body;
    const reaction = await Reaction.create({
      messageId,
      emojiId,
      skin: skin || 1,
    });

    res.json(reaction);
  })
);

// router.get('/check/:id', asyncHandler( async(req, res) => {
//     const messageId = parseInt(req.params.id, 10)
//     const message = await Message.findByPk(messageId)
//     res.json(message)
// }))

router.get(
  "/reactions",
  asyncHandler(async (req, res) => {
    const reactions = await Reaction.findAll();
    res.json(reactions);
  })
);

router.put('/:messageId', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.messageId, 10)
    const {content} = req.body
        await Message.update({
            content
        },
        {where: {id}})
        res.sendStatus(200).end();
}))

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);

    Message.destroy({
      where: {
        id,
      },
    });

    res.sendStatus(200).end();
  })
);

module.exports = router;
