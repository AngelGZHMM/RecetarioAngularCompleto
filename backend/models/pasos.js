const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pasos', {
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    receta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'RECETA',
        key: 'receta_id'
      }
    },
    descripcion: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    ingrediente: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cantidad: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    unidad_medida: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duracion: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    necesario: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'PASOS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "orden" },
          { name: "receta_id" },
        ]
      },
      {
        name: "PASOS_FK_RECETA",
        using: "BTREE",
        fields: [
          { name: "receta_id" },
        ]
      },
    ]
  });
};
