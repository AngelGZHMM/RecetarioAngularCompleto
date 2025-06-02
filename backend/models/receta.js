const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('receta', {
    receta_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'usuario_id'
      }
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    tiempo_preparacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dificultad: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    fecha_creacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tiempo_coccion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tiempo_total: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_publicacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    origen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    video_instrucciones: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valoracion_media: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true
    },
    numero_valoraciones: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    publica: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    categoria: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    autor: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    porciones: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    calorias_totales: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numvistas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    numfavoritos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'RECETA',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "receta_id" },
        ]
      },
    ]
  });
};
