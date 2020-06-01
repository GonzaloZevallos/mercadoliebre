'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, 
  {
    tablename: 'categories'
  });
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(
      models.Product,
      {
        as: 'products',
        foreignKey: 'categoryId'
      }
    );
  };
  return Category;
};