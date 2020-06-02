'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    productName: DataTypes.STRING,
    order: DataTypes.INTEGER,
    image: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    subTotal: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    state: DataTypes.TINYINT,
    userId: DataTypes.INTEGER
  });

  Cart.associate = function(models) {

    Cart.belongsTo(
      models.User, 
      {
        as: 'user',
        foreignKey: 'userId'
      }
    );
  };
  return Cart;
};