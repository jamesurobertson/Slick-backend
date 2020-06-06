"use strict";
const bcrypt = require("bcryptjs");
const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const channels = await queryInterface.bulkInsert(
      "Channels",
      [
        {
          name: "General",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    const users = await queryInterface.bulkInsert(
      "Users",
      [
        {
          fullName: "James Robertson",
          email: "jamesurobertson@gmail.com",
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          fullName: "Bryce Morgan",
          email: "bryce@gmail.com",
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    const userChannels = await queryInterface.bulkInsert(
      "UserChannels",
      [
        {
          channelId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    return queryInterface.bulkInsert("Messages", [
      {
        userId: 1,
        content: "Hey Bryce! What's up??",
        messageableType: "user",
        messageableId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        userId: 1,
        content: "What's up General",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete("Messages", null, {});
    await queryInterface.bulkDelete("UserChannels", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    return queryInterface.bulkDelete("Channels", null, {});
  },
};
