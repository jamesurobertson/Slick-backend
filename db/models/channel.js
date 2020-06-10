
'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserChannel = sequelize.import('./userchannel');

  const Channel = sequelize.define('Channel', {
    name: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    topic: {
        type:DataTypes.STRING
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

  Channel.prototype.numUser = async function() {
    const number = await UserChannel.findAll({where: {channelId: this.id}})
    return number.length
  }

  return Channel;
};
