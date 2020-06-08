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
    .exists({ checkFalsy: true })
    .withMessage("You'll need to enter a valid email.")
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
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password")
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

router.post(
  "/",
  validateUserFields,
  asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.json(["ERRORS", ...errors]);
    }

    const { name: fullName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      hashedPassword,
    });
    const token = getUserToken(user);
    res.status(201).json({
      user: { id: user.id },
      token,
    });
  })
);

// get user info
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
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const channels = await UserChannel.findAll({
      where: { userId },
      include: [{ model: Channel }],
    });
    res.json(channels);
  })
);

module.exports = router;
