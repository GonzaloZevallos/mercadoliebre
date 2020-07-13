'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
  return Item;
};