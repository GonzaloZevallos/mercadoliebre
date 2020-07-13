'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {

    static closeItems(id) {
      return sequelize.query(
        `UPDATE items SET state = 0 WHERE userId = ${id} AND state = 1`
      );
    }

    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });

      this.belongsTo(models.Cart, {
        as: "cart",
        foreignKey: "cartId",
      });

      this.belongsTo(models.Product, {
        as: "product",
        foreignKey: "productId",
      });

      this.belongsTo(models.User, {
        as: "seller",
        foreignKey: "sellerId",
      });
    }
  };
  Item.init({
    salePrice: DataTypes.DECIMAL,
    quantity: DataTypes.INTEGER,
    subtotal: DataTypes.INTEGER,
    state: DataTypes.TINYINT,
    userId: DataTypes.INTEGER,
    sellerId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    cartId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Item',
  });

  console.log(Item.prototype)

  return Item;
};