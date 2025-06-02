module.exports = (sequelize, DataTypes) => {
  const RecetasIngredientes = sequelize.define('Recetas_Ingredientes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    receta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ingrediente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Cantidad: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Unidad: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'Recetas_Ingredientes'
  });

  return RecetasIngredientes;
};