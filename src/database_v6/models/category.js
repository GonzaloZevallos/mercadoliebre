
// Tenemos que requerir a Model porque el modelo nuestro va a extender de ahí
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    // Acá podrían crear métodos propios (RE PIOLA)

    static associate(models) {
      // Acá mandan las relaciones
      // Si se fijan es exactamente igual que de la manera antigua solo que ahora
      // tenemos que hacer referencia al modelo con THIS porque estamos dentro de una clase
      this.hasMany(models.Product, {
        as: "products",
        foreignKey: "categoryId",
      });
    }
  };

  // init() es el método que hereda de Model y es quien viene a reemplazar al querido define()
  // Ojo con los parámetros que desaparece el 'alias' y ahora el nombre del modelo se aclara en las configuraciones
  Category.init(
    {
      // Configuración de las columnas
      name: DataTypes.STRING,
    },
    {
      // Acá van las configuraciones adicionales

      // Configuraciones OBLIGATORIAS
      sequelize, // Necesitamos pasar la conexión
      modelName: "Category", // El antiguo alias ahora es una configuración adicional OBLIGATORIA
      // Configuraciones adicionales NO OBLIGATORIAS
      timestamps: true
    }
  );
  return Category;
};





