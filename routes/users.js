const express = require("express");
const { Message, Channel, UserChannel } = require("../db/models");
const { asyncHandler } = require("../utils");


const router = express.Router();


router.post('/', asyncHanler(async (req, res) => {
    console.log('created user!')
    // TODO setup validation and then do user create routes
}))
