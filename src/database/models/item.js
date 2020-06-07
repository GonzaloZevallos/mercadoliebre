'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    salePrice: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    subTotal: DataTypes.INTEGER,
    state: DataTypes.TINYINT,
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    cartId: DataTypes.INTEGER
  });

  Item.associate = function(models) {

    Item.belongsTo(
      models.User, 
      {
        as: 'user',
        foreignKey: 'userId'
      }
    );

    Item.belongsTo(
      models.Cart,
      {
        as: 'cart',
        foreignKey: 'cartId'
      }
    );

    Item.belongsTo(
      models.Product,
      {
        as: 'product',
        foreignKey: 'productId'
      }
    );
  };
  return Item;
};