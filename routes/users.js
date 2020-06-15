const express = require("express");
const bcrypt = require("bcryptjs");
const { User, UserChannel, Channel } = require("../db/models");
const { asyncHandler } = require("../utils");
const { requireAuth, getUserToken } = require("../auth");
const { check, validationResult } = require("express-validator");

const router = express.Router();

validateUserFields = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("You'll need to enter a name."),
  check("email")
    .isEmail()
    .withMessage("You'll need to enter a valid email.")
    .custom((value) => {
      return User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(
            "The provided Email Address is already in use by another account"
          );
        }
      });
    }),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 charachters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
    .withMessage(
      'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("You'll need to confirm your password."),
];

const validateEmailPassword = [
  check("email")
    .isEmail()
    .exists({ checkFalsy: true })
    .withMessage("This is required - you'll need to enter a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("This is required - you'll need to enter a password."),
];

//get all users

router.get('/', asyncHandler(async(req, res) => {
    const users = await User.findAll({
        attributes: ['id','fullName', 'displayName', 'title', 'email', 'profileImageUrl']
    })

    res.json(users)
}))


router.post('/login', validateEmailPassword, asyncHandler(async(req, res) => {
    const validatorErrors = validationResult(req)

    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.json(["ERRORS", ...errors]);
        return
      }

      const {email, password} = req.body

    const user = await User.findOne({where: {email}})

    if (user !== null) {
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString())
        if (passwordMatch) {
            // loginUser(req, res, user)
            const token = getUserToken(user);
            res.status(201).json({
                user: { id: user.id },
                token,
              });
        } else {
            res.json(["ERRORS", 'Email or Password does not match'])
        }
    }
}))


// create a user
router.post(
  "/",
  validateUserFields,
  asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.json(["ERRORS", ...errors]);
      return
    }

    const { name: fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      hashedPassword,
    });
    const token = getUserToken(user);

    await UserChannel.create({
        channelId: 1,
        userId: user.id
    })

    res.status(201).json({
      user: { id: user.id },
      token,
    });
  })
);

// get user info
// TODO: CHANGE TO GET ID FROM JWT
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const user = await User.findOne({
      where: { id },
      attributes: [
        "fullName",
        "displayName",
        "title",
        "email",
        "profileImageUrl",
      ],
    });
    res.json(user);
  })
);

//get all channels that user is subscribed too
router.get(
  "/channel/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
      // TODO get userID from JWT instead of params
    const userId = parseInt(req.params.id, 10);
    const channels = await UserChannel.findAll({
      where: { userId },
      include: [{ model: Channel }],
    });
    const payload = []
    await Promise.all(channels.map(async channel => {
        const {Channel, Channel: { id, name, topic
        }} = channel
        const num = await Channel.numUser()
        Channel.numUsers = num
        payload.push({
            id,
            name,
            topic,
            numUsers: num
        })
        return Channel
    }))
    res.json(payload);
  })
);



router.put('/updateUser', requireAuth, asyncHandler(async (req, res) => {
    const id = req.user.id
    const userInfo = req.body
    const user = await User.findByPk(id)
    if (user) {
        await user.update(userInfo)
        res.json(user)
    } else {
        next()
    }
}))

module.exports = router;
