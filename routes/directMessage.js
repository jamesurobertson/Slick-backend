const express = require("express");
const { Message, User, UserChannel, Channel } = require("../db/models");
const { asyncHandler } = require("../utils");
const { requireAuth } = require("../auth");
const Op = require('sequelize').Op


const router = express.Router();
router.use(requireAuth);


// Creates a directMessage
router.post(
    "/",
    asyncHandler(async (req, res) => {
      const { toMessageId } = req.body;
      const userId = req.user.id


      const userToMessage = await User.findByPk(toMessageId)

      if (!userToMessage) res.status(201).json('no user')

      const dm = await Channel.create({ name: `- ${userId} ${userToMessage.id}`, topic: 'Click here to Change Topic'});

      await UserChannel.create({
        channelId: dm.id,
        userId,
      });

      await UserChannel.create({
        channelId: dm.id,
        userId: toMessageId,
      });

    const { id, name, topic } = dm;
    const numUsers = await dm.numUser();
    const payload = {
      id,
      name,
      topic,
      numUsers,
    }


      res.status(201).json({payload, userToMessage: userToMessage.fullName});
    })
  );

  // get all directMessages that a user is apart of
router.get('/', requireAuth, asyncHandler(async(req, res) => {
    const userId = req.user.id
    const directMessages = await UserChannel.findAll({
        where: {userId},
    include: [{model: Channel, where: {name: {[Op.startsWith]: '-'}}}]
    })

    res.json(directMessages)
}))



  module.exports = router;
