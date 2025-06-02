// controllers/usuarioController.js
const sequelize = require('../config/sequelize');
const { Op } = require('sequelize');
// Importar los modelos directamente
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const Usuario = models.usuario; // Corregido: usar "usuario" en lugar de "user"
const Seguidores = models.seguidores; // Usar directamente la referencia correcta
const Respuesta = require('../utils/respuesta');

// Obtener perfil de usuario
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.params.id || req.usuario.usuario_id;
    
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['Contrasena'] } // Excluir solo la contraseña, incluir todos los demás campos
    });

    if (!usuario) {
      return Respuesta.error(res, 404, 'Usuario no encontrado');
    }

    // Contar seguidores
    const seguidores = await Seguidores.count({
      where: { usuario_seguido_id: usuarioId }
    });

    // Contar seguidos
    const seguidos = await Seguidores.count({
      where: { usuario_seguidor_id: usuarioId }
    });

    // Verificar si el usuario que solicita está siguiendo al usuario del perfil
    let siguiendo = false;
    if (req.usuario && req.usuario.usuario_id !== parseInt(usuarioId)) {
      const relacion = await Seguidores.findOne({
        where: {
          usuario_seguidor_id: req.usuario.usuario_id,
          usuario_seguido_id: usuarioId
        }
      });
      siguiendo = !!relacion;
    }

    const perfil = {
      ...usuario.toJSON(),
      seguidores,
      seguidos,
      siguiendo
    };

    return Respuesta.success(res, 200, 'Perfil obtenido correctamente', perfil);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return Respuesta.error(res, 500, 'Error al obtener perfil de usuario');
  }
};

// Buscar usuarios
exports.buscarUsuarios = async (req, res) => {
  try {
    const { q, page = 1, itemsPerPage = 10 } = req.query;
    const usuarioActualId = req.usuario ? req.usuario.usuario_id : null;
    if (!q) {
      return Respuesta.error(res, 400, 'Se requiere un término de búsqueda');
    }
    const offset = (parseInt(page) - 1) * parseInt(itemsPerPage);
    const limit = parseInt(itemsPerPage);
    // Buscar usuarios que coincidan con el término
    const { rows: usuarios, count: totalItems } = await Usuario.findAndCountAll({
      where: {
        [Op.or]: [
          { Nombre_de_usuario: { [Op.like]: `%${q}%` } },
          { Nombre: { [Op.like]: `%${q}%` } },
          { Apellidos: { [Op.like]: `%${q}%` } }
        ]
      },
      attributes: ['usuario_id', 'Nombre_de_usuario', 'Nombre', 'Apellidos', 'Foto_de_perfil', 'Pais', 'Fecha_de_creacion'],
      offset,
      limit
    });
    let usuariosSeguidos = [];
    if (usuarioActualId) {
      usuariosSeguidos = await Seguidores.findAll({
        attributes: ['usuario_seguido_id'],
        where: { usuario_seguidor_id: usuarioActualId }
      });
      usuariosSeguidos = usuariosSeguidos.map(s => s.usuario_seguido_id);
    }
    const usuariosConSiguiendo = usuarios.map(usuario => {
      const usuarioData = usuario.toJSON();
      usuarioData.siguiendo = usuariosSeguidos.includes(usuario.usuario_id);
      // Normaliza las propiedades para que no tengan tildes
      if (usuarioData['Pais'] === undefined && usuarioData['País'] !== undefined) {
        usuarioData['Pais'] = usuarioData['País'];
        delete usuarioData['País'];
      }
      if (usuarioData['Contrasena'] === undefined && usuarioData['Contraseña'] !== undefined) {
        usuarioData['Contrasena'] = usuarioData['Contraseña'];
        delete usuarioData['Contraseña'];
      }
      if (usuarioData['Empresa_Organizacion'] === undefined && usuarioData['Empresa_Organización'] !== undefined) {
        usuarioData['Empresa_Organizacion'] = usuarioData['Empresa_Organización'];
        delete usuarioData['Empresa_Organización'];
      }
      if (usuarioData['Aceptacion_TYC'] === undefined && usuarioData['Aceptación_TYC'] !== undefined) {
        usuarioData['Aceptacion_TYC'] = usuarioData['Aceptación_TYC'];
        delete usuarioData['Aceptación_TYC'];
      }
      if (usuarioData['Aceptacion_Politica'] === undefined && usuarioData['Aceptación_Política'] !== undefined) {
        usuarioData['Aceptacion_Politica'] = usuarioData['Aceptación_Política'];
        delete usuarioData['Aceptación_Política'];
      }
      if (usuarioData['Fecha_de_creacion'] === undefined && usuarioData['Fecha_de_creación'] !== undefined) {
        usuarioData['Fecha_de_creacion'] = usuarioData['Fecha_de_creación'];
        delete usuarioData['Fecha_de_creación'];
      }
      return usuarioData;
    });
    return res.status(200).json({
      exito: true,
      mensaje: 'Búsqueda completada',
      datos: {
        datos: usuariosConSiguiendo,
        totalItems
      }
    });
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    return Respuesta.error(res, 500, 'Error al buscar usuarios');
  }
};

// Explorar usuarios (sugerencias)
exports.explorarUsuarios = async (req, res) => {
  try {
    const { page = 1, itemsPerPage = 10 } = req.query;
    const usuarioId = req.usuario.usuario_id;
    const offset = (parseInt(page) - 1) * parseInt(itemsPerPage);
    const limit = parseInt(itemsPerPage);
    const { rows: usuariosNoSeguidos, count: totalItems } = await Usuario.findAndCountAll({
      attributes: ['usuario_id', 'Nombre_de_usuario', 'Nombre', 'Apellidos', 'Foto_de_perfil', 'Pais', 'Fecha_de_creacion'],
      where: {
        usuario_id: {
          [Op.ne]: usuarioId,
          [Op.notIn]: sequelize.literal(`(SELECT usuario_seguido_id FROM seguidores WHERE usuario_seguidor_id = ${usuarioId})`)
        }
      },
      offset,
      limit,
      order: sequelize.random()
    });
    // Al procesar los usuarios, mapea la propiedad para quitar la tilde
    const usuariosProcesados = usuariosNoSeguidos.map(usuario => {
      const usuarioData = usuario.toJSON();
      usuarioData.siguiendo = false;
      return usuarioData;
    });
    return res.status(200).json({
      exito: true,
      mensaje: 'Sugerencias de usuarios obtenidas correctamente',
      datos: {
        datos: usuariosProcesados,
        totalItems
      }
    });
  } catch (error) {
    console.error('Error al explorar usuarios:', error);
    return Respuesta.error(res, 500, 'Error al obtener sugerencias de usuarios');
  }
};

// Seguir a un usuario
exports.seguirUsuario = async (req, res) => {
  try {
    const seguidorId = req.usuario.usuario_id;
    const seguidoId = req.params.id;
    
    // Verificar que no sea el mismo usuario
    if (parseInt(seguidorId) === parseInt(seguidoId)) {
      return Respuesta.error(res, 400, 'No puedes seguirte a ti mismo');
    }

    // Verificar que el usuario a seguir exista
    const usuarioSeguido = await Usuario.findByPk(seguidoId);
    if (!usuarioSeguido) {
      return Respuesta.error(res, 404, 'El usuario que intentas seguir no existe');
    }

    // Verificar si ya lo sigue
    const relacion = await Seguidores.findOne({
      where: {
        usuario_seguidor_id: seguidorId,
        usuario_seguido_id: seguidoId
      }
    });

    if (relacion) {
      return Respuesta.error(res, 409, 'Ya sigues a este usuario');
    }

    // Crear la relación de seguimiento
    await Seguidores.create({
      usuario_seguidor_id: seguidorId,
      usuario_seguido_id: seguidoId
    });

    return Respuesta.success(res, 201, 'Has comenzado a seguir al usuario');
  } catch (error) {
    console.error('Error al seguir usuario:', error);
    return Respuesta.error(res, 500, 'Error al intentar seguir al usuario');
  }
};

// Dejar de seguir a un usuario
exports.dejarDeSeguir = async (req, res) => {
  try {
    const seguidorId = req.usuario.usuario_id;
    const seguidoId = req.params.id;

    // Verificar que la relación existe
    const relacion = await Seguidores.findOne({
      where: {
        usuario_seguidor_id: seguidorId,
        usuario_seguido_id: seguidoId
      }
    });

    if (!relacion) {
      return Respuesta.error(res, 404, 'No sigues a este usuario');
    }

    // Eliminar la relación
    await relacion.destroy();

    return Respuesta.success(res, 200, 'Has dejado de seguir al usuario');
  } catch (error) {
    console.error('Error al dejar de seguir:', error);
    return Respuesta.error(res, 500, 'Error al intentar dejar de seguir al usuario');
  }
};

// Listar seguidores de un usuario
exports.listarSeguidores = async (req, res) => {
  try {
    const usuarioId = req.params.id || req.usuario.usuario_id;

    const seguidores = await Seguidores.findAll({
      where: { usuario_seguido_id: usuarioId },
      include: [{
        model: Usuario,
        as: 'seguidor',
        attributes: ['usuario_id', 'Nombre_de_usuario', 'Nombre', 'Apellidos', 'Foto_de_perfil']
      }]
    });

    const listaSeguidores = seguidores.map(s => s.seguidor);

    return Respuesta.success(res, 200, 'Lista de seguidores obtenida', listaSeguidores);
  } catch (error) {
    console.error('Error al listar seguidores:', error);
    return Respuesta.error(res, 500, 'Error al obtener lista de seguidores');
  }
};

// Listar usuarios seguidos por un usuario
exports.listarSeguidos = async (req, res) => {
  try {
    const usuarioId = req.params.id || req.usuario.usuario_id;

    const seguidos = await Seguidores.findAll({
      where: { usuario_seguidor_id: usuarioId },
      include: [{
        model: Usuario,
        as: 'seguido',
        attributes: ['usuario_id', 'Nombre_de_usuario', 'Nombre', 'Apellidos', 'Foto_de_perfil']
      }]
    });

    const listaSeguidos = seguidos.map(s => s.seguido);

    return Respuesta.success(res, 200, 'Lista de seguidos obtenida', listaSeguidos);
  } catch (error) {
    console.error('Error al listar seguidos:', error);
    return Respuesta.error(res, 500, 'Error al obtener lista de seguidos');
  }
};

// Listar todos los usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const { page = 1, itemsPerPage = 10 } = req.query;
    const usuarioActualId = req.usuario ? req.usuario.usuario_id : null;
    const offset = (parseInt(page) - 1) * parseInt(itemsPerPage);
    const limit = parseInt(itemsPerPage);
    const { rows: usuarios, count: totalItems } = await Usuario.findAndCountAll({
      attributes: ['usuario_id', 'Nombre_de_usuario', 'Nombre', 'Apellidos', 'Foto_de_perfil', 'Pais', 'Fecha_de_creacion'],
      offset,
      limit
    });
    let usuariosSeguidos = [];
    if (usuarioActualId) {
      usuariosSeguidos = await Seguidores.findAll({
        attributes: ['usuario_seguido_id'],
        where: { usuario_seguidor_id: usuarioActualId }
      });
      usuariosSeguidos = usuariosSeguidos.map(s => s.usuario_seguido_id);
    }
    const usuariosConSiguiendo = usuarios.map(usuario => {
      const usuarioData = usuario.toJSON();
      usuarioData.siguiendo = usuariosSeguidos.includes(usuario.usuario_id);
      // Normaliza las propiedades para que no tengan tildes
      if (usuarioData['Pais'] === undefined && usuarioData['País'] !== undefined) {
        usuarioData['Pais'] = usuarioData['País'];
        delete usuarioData['País'];
      }
      if (usuarioData['Contrasena'] === undefined && usuarioData['Contraseña'] !== undefined) {
        usuarioData['Contrasena'] = usuarioData['Contraseña'];
        delete usuarioData['Contraseña'];
      }
      if (usuarioData['Empresa_Organizacion'] === undefined && usuarioData['Empresa_Organización'] !== undefined) {
        usuarioData['Empresa_Organizacion'] = usuarioData['Empresa_Organización'];
        delete usuarioData['Empresa_Organización'];
      }
      if (usuarioData['Aceptacion_TYC'] === undefined && usuarioData['Aceptación_TYC'] !== undefined) {
        usuarioData['Aceptacion_TYC'] = usuarioData['Aceptación_TYC'];
        delete usuarioData['Aceptación_TYC'];
      }
      if (usuarioData['Aceptacion_Politica'] === undefined && usuarioData['Aceptación_Política'] !== undefined) {
        usuarioData['Aceptacion_Politica'] = usuarioData['Aceptación_Política'];
        delete usuarioData['Aceptación_Política'];
      }
      if (usuarioData['Fecha_de_creacion'] === undefined && usuarioData['Fecha_de_creación'] !== undefined) {
        usuarioData['Fecha_de_creacion'] = usuarioData['Fecha_de_creación'];
        delete usuarioData['Fecha_de_creación'];
      }
      return usuarioData;
    });
    const respuesta = {
      exito: true,
      mensaje: 'Usuarios obtenidos correctamente',
      datos: {
        datos: usuariosConSiguiendo,
        totalItems
      }
    };
    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    return Respuesta.error(res, 500, 'Error al obtener la lista de usuarios');
  }
};