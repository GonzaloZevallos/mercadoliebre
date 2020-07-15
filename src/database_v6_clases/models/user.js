"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // associate with products
      this.hasMany(models.Product, {
        foreignKey: "userId",
        as: "products",
      });

      // associate with tokens
      this.hasMany(models.Token, {
        foreignKey: "userId",
        as: "tokens",
      });

      // associate with carts
      this.hasMany(models.Cart, {
        foreignKey: "userId",
        as: "carts",
      });

      // associate with items
      this.hasMany(models.Item, {
        foreignKey: "sellerId",
        as: "sales",
      });
    }
  }
  User.init(
    {
      admin: DataTypes.TINYINT,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
