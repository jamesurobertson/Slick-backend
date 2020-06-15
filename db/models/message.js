"use strict";
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'Users'
        }
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      messageableType: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      messageableId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {}
  );
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User, {foreignKey: 'userId'})
    Message.hasMany(models.Reaction, {foreignKey: 'messageId'})
  };
  return Message;
};
