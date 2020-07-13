'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Brand, {
        as: "brand",
        foreingKey: "brandId",
      });

      this.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });

      this.belongsTo(models.Category, {
        as: "category",
        foreignKey: "categoryId",
      });

      this.hasMany(models.Item, {
        as: "items",
        foreignKey: "productId",
      });
    }
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    discount: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    brandId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};