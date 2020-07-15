"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static closeItems(id) {
      return sequelize.query(
        `UPDATE items SET state = 0 WHERE userId = ${id} AND state = 1`
      );
    }

    static closeItems(idUser) {
      return sequelize.query(
        `UPDATE items SET state = 0 WHERE userId = ${idUser} AND state = 1`
      );
    }

    static assignItems(idUser, idCart) {
      return sequelize.query(
        `UPDATE items SET cartId = ${idCart} WHERE userId = ${idUser} AND cartId IS NULL`
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
  }
  Item.init(
    {
      salePrice: DataTypes.DECIMAL,
      quantity: DataTypes.INTEGER,
      subTotal: DataTypes.INTEGER,
      state: DataTypes.TINYINT,
      userId: DataTypes.INTEGER,
      sellerId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      cartId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );

  return Item;
};