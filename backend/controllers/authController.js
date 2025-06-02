// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const initModels = require('../models/init-models');
const sequelize = require('../config/sequelize');
const models = initModels(sequelize);
const Usuario = models.usuario;

class AuthController {
  async registrar(req, res) {
    try {
      const { 
        Nombre_de_usuario, 
        Contrasena, 
        Gmail, 
        Nombre,
        Apellidos,
        Foto_de_perfil,
        Preferencias_de_contenido,
        Modo_oscuro_claro,
        Rol = 'usuario',
        Pais,
        Lenguaje_de_preferencia,
        Tipo_de_cuenta,
        Empresa_Organizacion,
        Aceptacion_TYC,
        Aceptacion_Politica
      } = req.body;

      // Validación básica: se requieren al menos Nombre_de_usuario, Contrasena y Gmail
      if (!Nombre_de_usuario || !Contrasena || !Gmail) {
        return res.status(400).json({
          exito: false,
          error: {
            codigo: 'CAMPOS_REQUERIDOS',
            mensaje: 'Nombre_de_usuario, Contrasena y Gmail son obligatorios'
          }
        });
      }

      // Verificar si el usuario ya existe (por nombre de usuario o Gmail)
      const usuarioExistente = await Usuario.findOne({
        where: {
          [Op.or]: [
            { Nombre_de_usuario },
            { Gmail }
          ]
        }
      });
      if (usuarioExistente) {
        return res.status(409).json({
          exito: false,
          error: {
            codigo: 'USUARIO_EXISTENTE',
            mensaje: 'El nombre de usuario o Gmail ya están registrados'
          }
        });
      }

      // Hash de la contraseña
      const contrasenaHasheada = await bcrypt.hash(Contrasena, 10);
      
      // Crear el nuevo usuario
      const nuevoUsuario = await Usuario.create({
        Nombre_de_usuario,
        Contrasena: contrasenaHasheada,
        Gmail,
        Nombre,
        Apellidos,
        Foto_de_perfil,
        Preferencias_de_contenido,
        Modo_oscuro_claro,
        Rol,
        Pais,
        Lenguaje_de_preferencia,
        Tipo_de_cuenta,
        Empresa_Organizacion,
        Aceptacion_TYC,
        Aceptacion_Politica
      });

      // Preparar la respuesta sin datos sensibles
      const usuarioRespuesta = {
        usuario_id: nuevoUsuario.usuario_id,
        Nombre_de_usuario: nuevoUsuario.Nombre_de_usuario,
        Gmail: nuevoUsuario.Gmail,
        Rol: nuevoUsuario.Rol,
        Fecha_de_creacion: nuevoUsuario.Fecha_de_creacion
      };

      res.status(201).json({
        exito: true,
        datos: usuarioRespuesta
      });
    } catch (error) {
      console.error('[Error en registro]', error);
      res.status(500).json({
        exito: false,
        error: {
          codigo: 'ERROR_INTERNO',
          mensaje: 'Error al procesar el registro',
          detalle: process.env.NODE_ENV === 'development' ? error.message : null
        }
      });
    }
  }

  async login(req, res) {
    try {
      const { Nombre_de_usuario, Contrasena } = req.body;
      if (!Nombre_de_usuario || !Contrasena) {
        return res.status(400).json({
          exito: false,
          error: {
            codigo: 'CREDENCIALES_INVALIDAS',
            mensaje: 'Nombre_de_usuario y Contrasena son requeridos'
          }
        });
      }
      const usuario = await Usuario.findOne({
        where: { Nombre_de_usuario }
      });
      if (!usuario) {
        return res.status(401).json({
          exito: false,
          error: {
            codigo: 'USUARIO_NO_ENCONTRADO',
            mensaje: 'Credenciales inválidas'
          }
        });
      }
      const contrasenaValida = await bcrypt.compare(Contrasena, usuario.Contrasena);
      if (!contrasenaValida) {
        return res.status(401).json({
          exito: false,
          error: {
            codigo: 'CREDENCIALES_INVALIDAS',
            mensaje: 'Credenciales inválidas'
          }
        });
      }
      const token = jwt.sign(
        {
          usuario_id: usuario.usuario_id,
          Nombre_de_usuario: usuario.Nombre_de_usuario, // Agregar el nombre de usuario al token
          Rol: usuario.Rol,
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
        },
        process.env.JWT_SECRET
      );
      res.cookie('jwt', token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600 * 1000
      });
      res.json({
        exito: true,
        datos: {
          usuario: {
            usuario_id: usuario.usuario_id,
            Nombre_de_usuario: usuario.Nombre_de_usuario,
            Rol: usuario.Rol
          }
        }
      });
    } catch (error) {
      console.error('[Error en login]', error);
      res.status(500).json({
        exito: false,
        error: {
          codigo: 'ERROR_INTERNO',
          mensaje: 'Error al procesar el login',
          detalle: process.env.NODE_ENV === 'development' ? error.message : null
        }
      });
    }
  }

  // controllers/authController.js (fragmento actualizado)
async obtenerDatos(req, res) {
  try {
    // Se asume que el middleware de autenticación ha agregado 'req.usuario' con al menos el usuario_id
    const { usuario_id } = req.usuario;
    const usuario = await Usuario.findByPk(usuario_id, {
      attributes: { exclude: ['Contraseña'] } // No se envía la contraseña
    });
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        error: {
          codigo: 'USUARIO_NO_ENCONTRADO',
          mensaje: 'No se encontró el usuario'
        }
      });
    }
    res.json({
      exito: true,
      datos: usuario
    });
  } catch (error) {
    console.error('[Error obteniendo datos del usuario]', error);
    res.status(500).json({
      exito: false,
      error: {
        codigo: 'ERROR_INTERNO',
        mensaje: 'Error al recuperar datos del usuario'
      }
    });
  }
}


  async validarToken(req, res) {
    try {
      res.json({ 
        exito: true,
        datos: { usuario: req.usuario }
      });
    } catch (error) {
      console.error('[Error validando token]', error);
      res.status(500).json({
        exito: false,
        error: {
          codigo: 'ERROR_VALIDACION_TOKEN',
          mensaje: 'Error al validar el token'
        }
      });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
      res.json({ 
        exito: true,
        mensaje: 'Sesión cerrada correctamente'
      });
    } catch (error) {
      console.error('[Error en logout]', error);
      res.status(500).json({
        exito: false,
        error: {
          codigo: 'ERROR_LOGOUT',
          mensaje: 'Error al cerrar la sesión'
        }
      });
    }
  }

  //Funcion para actualizar los datos del usuario
  async actualizarDatos(req, res) {
    try {
      const { usuario_id } = req.usuario; // Obtener el ID del usuario desde el token
      const { 
        Nombre_de_usuario, 
        Gmail, 
        Nombre,
        Apellidos,
        Foto_de_perfil,
        Preferencias_de_contenido,
        Modo_oscuro_claro,
        Rol = 'usuario',
        Pais,
        Lenguaje_de_preferencia,
        Tipo_de_cuenta,
        Empresa_Organizacion,
        Aceptacion_TYC,
        Aceptacion_Politica
      } = req.body;

      // Validación básica: se requieren al menos Nombre_de_usuario y Gmail
      if (!Nombre_de_usuario || !Gmail) {
        return res.status(400).json({
          exito: false,
          error: {
            codigo: 'CAMPOS_REQUERIDOS',
            mensaje: 'Nombre_de_usuario y Gmail son obligatorios'
          }
        });
      }

      // Verificar si el usuario existe
      const usuarioExistente = await Usuario.findByPk(usuario_id);
      if (!usuarioExistente) {
        return res.status(404).json({
          exito: false,
          error: {
            codigo: 'USUARIO_NO_ENCONTRADO',
            mensaje: 'El usuario no existe'
          }
        });
      }

      // Actualizar el usuario
      await Usuario.update(
        {
          Nombre_de_usuario,
          Gmail,
          Nombre,
          Apellidos,
          Foto_de_perfil,
          Preferencias_de_contenido,
          Modo_oscuro_claro,
          Rol,
          Pais,
          Lenguaje_de_preferencia,
          Tipo_de_cuenta,
          Empresa_Organizacion,
          Aceptacion_TYC,
          Aceptacion_Politica
        },
        { where: { usuario_id } }
      );

      res.json({
        exito: true,
        mensaje: 'Datos actualizados correctamente'
      });
    } catch (error) {
      console.error('[Error actualizando datos]', error);
      res.status(500).json({
        exito: false,
        error: {
          codigo: 'ERROR_ACTUALIZACION',
          mensaje: 'Error al actualizar los datos del usuario'
        }
      });
    }
  }
}

module.exports = new AuthController();
