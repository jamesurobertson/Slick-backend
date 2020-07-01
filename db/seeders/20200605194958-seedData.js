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
          name: "#General",
          topic: "Click here to change the topic",
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
          fullName: "Bryce Morgan",
          displayName: "Bryce Morgan",
          title: "Here to help",
          email: "bryce@gmail.com",
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1592191753603.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Bakari Holmes",
          displayName: "Bakari Holme",
          title: "React Wiz",
          email: "bakari@gmail.com",
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1592191771114.jpeg',
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "John Wick",
          displayName: "John Wick",
          title: "Dog Lover",
          email: "wick@gmail.com",
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1592191779575.jpg',
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Elon Musk",
          displayName: "Elon",
          title: "Zoom Zoom",
          email: "elon@gmail.com",
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1592191794322.jpg',
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Jeff Bezoz",
          displayName: "Jeff",
          title: "Buy $AMZN",
          email: "bezos@gmail.com",
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1592191802396.jpg',
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Bill Gates",
          displayName: "Billy",
          email: "gates@gmail.com",
          title: "People Everywhere love Windows",
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1592191873440.jpg',
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Alissa Crane",
          displayName: "Alissa Crane",
          title: "Gone but not forgotten",
          email: "alissa@gmail.com",
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1592191880597.png',
          hashedPassword: bcrypt.hashSync(faker.internet.password()),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Bob Ross",
          displayName: "",
          title: "Let's get Crazy",
          email: "bobross@gmail.com",
          profileImageUrl: 'http://localhost:8080/aws/get_file/IMAGE-1593492676395.png',
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
        {
          channelId: 1,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          userId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          userId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          userId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          channelId: 1,
          userId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
            channelId: 1,
            userId: 8,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
      ],
      { returning: true }
    );

    return queryInterface.bulkInsert("Messages", [
      {
        userId: 1,
        content: "Hey Everyone! Bryce here checking in... This app is awesome!",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        content: "Hey Bryce, yea it's looking sweet! Maybe we'll switch to using this instead of slack? I wonder who all is here?",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 7,
        content: "Hey, I'm here too! Everyone is telling me how cool Slick is.",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        content: "I'd hire the person who built this. Who is the creator?",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        content: "Yo what's up Bezos! James Robetson built this. You can check out his github by clicking your your name in the top left.",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 5,
        content: "Cool, thanks Bryce. That is awesome!",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 6,
        content: "Hey there Jeff. I know you're richest person in the world but I'm sure James would rather come work for me.",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        content: "What about me? Cars go vroom vroom. To the moooooon!!!",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        content: "John Wick checking in. Has anyone seen my dog?",
        messageableType: "channel",
        messageableId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 8,
        content: "There are no mistakes, just happy accidents.",
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
