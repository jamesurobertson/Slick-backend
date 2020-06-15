'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
    messageId: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    emojiId: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    skin: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
  }, {});
  Reaction.associate = function(models) {
    // associations can be defined here
    Reaction.belongsTo(models.Message, {foreignKey: 'messageId'})
  };
  return Reaction;
};
