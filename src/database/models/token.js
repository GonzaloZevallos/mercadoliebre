'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    token: DataTypes.STRING
  });
  Token.associate = function(models) {
    // associations can be defined here
    Token.belongsTo(
      models.User,
      {
        as: 'user',
        foreignKey: 'userId'
      }
    );
  };
  return Token;
};