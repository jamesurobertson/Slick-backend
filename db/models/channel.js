'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    name: {
        type:DataTypes.STRING,
        allowNull: false,
    }

  }, {});
  Channel.associate = function(models) {
    // associations can be defined here

    Channel.belongsToMany(models.User, {
        through: {
            model: 'Messages',
            scope: {
                messageableType: 'channel'
            }
        }
    })

    const columnMapping = {
        foreignKey: 'channelId',
        through: 'UserChannel',
        otherKey: 'userId'
    }

    Channel.belongsToMany(models.User, columnMapping)
  };
  return Channel;
};
