'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserChannel = sequelize.define('UserChannel', {
    channelId: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    userId: {
        allowNull: false,
        type: DataTypes.INTEGER
    }
  }, {});
  UserChannel.associate = function(models) {
    // associations can be defined here
    UserChannel.belongsTo(models.Channel, {foreignKey: "channelId"})
    UserChannel.belongsTo(models.User, {foreignKey: "userId"})
  };
  return UserChannel;
};
