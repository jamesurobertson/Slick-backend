"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      fullName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      displayName: {
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
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
                messageableType: 'user'
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
                messageableType: 'user'
            }
        },
        foreignKey: 'messageableId',
        constraints: false
    })

  };
  return User;
};
