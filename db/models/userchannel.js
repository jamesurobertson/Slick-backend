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
  };
  return UserChannel;
};
