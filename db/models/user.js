"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      fullname: {
        type: DataTypes.STRING,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImageUrl: {
        type: DataTypes.STRING,
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false
    },
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here

    const columnMapping = {
        foreignKey: 'userId',
        through: 'UserChannel',
        otherKey: 'channelId'
    }

    User.belongsToMany(models.Channel, columnMapping)

    // to see if this user messaged another user
    User.belongsToMany(models.User, {
        as: 'messagedUser',
        through: {
            model: 'Message',
            scope: {
                followableType: 'user'
            }
        },
        foreignKey: 'userId',
        constraints: false
    })

    // to ensure this user can be messaged

    User.belongsToMany(models.User, {
        as: 'userMessaged',
        through: {
            model: 'Message',
            scope: {
                followableType: 'user'
            }
        },
        foreignKey: 'messageableId',
        constraints: false
    })


  };
  return User;
};
