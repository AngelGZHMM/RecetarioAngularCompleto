// models/user.js
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuario', {
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nombre_de_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Apellidos: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Gmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    Contrasena: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Foto_de_perfil: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Preferencias_de_contenido: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Modo_oscuro_claro: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Rol: {
      type: DataTypes.STRING(50),
      defaultValue: 'usuario'
    },
    Pais: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Lenguaje_de_preferencia: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    Fecha_de_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    Tipo_de_cuenta: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Empresa_Organizacion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Aceptacion_TYC: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Aceptacion_Politica: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'usuarios'
  });

  // Añadir asociaciones para seguidores
  Usuario.associate = function(models) {
    // Un usuario puede seguir a muchos usuarios
    Usuario.belongsToMany(models.usuario, {
      through: models.Seguidores,
      as: 'seguidos',
      foreignKey: 'usuario_seguidor_id',
      otherKey: 'usuario_seguido_id'
    });

    // Un usuario puede tener muchos seguidores
    Usuario.belongsToMany(models.usuario, {
      through: models.Seguidores,
      as: 'seguidores',
      foreignKey: 'usuario_seguido_id',
      otherKey: 'usuario_seguidor_id'
    });
  };
  
  return Usuario;
};
