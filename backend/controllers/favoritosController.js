// controllers/favoritosController.js
const sequelize = require('../config/sequelize');
const { Op } = require('sequelize');
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const Usuario = models.usuario;
const Receta = models.receta;
const Favoritos = models.favoritos;
const Respuesta = require('../utils/respuesta');

class FavoritosController {
  // Agregar receta a favoritos
  async agregarFavorito(req, res) {
    try {
      const { receta_id } = req.params;
      const usuario_id = req.usuario.usuario_id;

      // Verificar si la receta existe
      const receta = await Receta.findByPk(receta_id);
      if (!receta) {
        return res.status(404).json(
          Respuesta.errorObj('Receta no encontrada')
        );
      }

      // Verificar si ya existe el favorito
      const favoritoExistente = await Favoritos.findOne({
        where: {
          receta_id: receta_id,
          usuario_id: usuario_id
        }
      });

      if (favoritoExistente) {
        return res.status(409).json(
          Respuesta.errorObj('La receta ya está en favoritos')
        );
      }

      // Crear el nuevo favorito
      const nuevoFavorito = await Favoritos.create({
        receta_id: receta_id,
        usuario_id: usuario_id,
        fecha_favorito: new Date()
      });

      res.status(201).json(
        Respuesta.exito(nuevoFavorito, 'Receta agregada a favoritos')
      );

    } catch (error) {
      console.error('Error al agregar favorito:', error);
      res.status(500).json(
        Respuesta.errorObj('Error interno del servidor')
      );
    }
  }

  // Quitar receta de favoritos
  async quitarFavorito(req, res) {
    try {
      const { receta_id } = req.params;
      const usuario_id = req.usuario.usuario_id;

      // Buscar y eliminar el favorito
      const favoritoEliminado = await Favoritos.destroy({
        where: {
          receta_id: receta_id,
          usuario_id: usuario_id
        }
      });

      if (favoritoEliminado === 0) {
        return res.status(404).json(
          Respuesta.errorObj('Favorito no encontrado')
        );
      }

      res.status(200).json(
        Respuesta.exito(null, 'Receta eliminada de favoritos')
      );

    } catch (error) {
      console.error('Error al quitar favorito:', error);
      res.status(500).json(
        Respuesta.errorObj('Error interno del servidor')
      );
    }
  }
  // Obtener favoritos del usuario
  async obtenerFavoritos(req, res) {
    try {
      console.log('=== OBTENER FAVORITOS - INICIO ===');
      const usuario_id = req.usuario.usuario_id;
      console.log('Usuario ID:', usuario_id);
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      console.log('Paginación - Page:', page, 'Limit:', limit, 'Offset:', offset);

      console.log('Modelos disponibles:', Object.keys(models));
      console.log('Verificando modelo Favoritos:', !!Favoritos);
      console.log('Verificando modelo Receta:', !!Receta);
      console.log('Verificando modelo Usuario:', !!Usuario);

      console.log('Iniciando consulta a base de datos...');      const favoritos = await Favoritos.findAndCountAll({
        where: { usuario_id },
        include: [{
          model: Receta,
          as: 'receta',
          attributes: [
            'receta_id',
            'nombre',
            'descripcion',
            'tiempo_preparacion',
            'dificultad',
            'porciones',
            'imagen',
            'categoria',
            'usuario_id'
          ],
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['usuario_id', 'Nombre_de_usuario', 'Foto_de_perfil']
          }]
        }],
        order: [['fecha_favorito', 'DESC']],
        limit,
        offset
      });

      console.log('Consulta completada. Count:', favoritos.count, 'Rows:', favoritos.rows.length);

      const totalPages = Math.ceil(favoritos.count / limit);

      const resultado = {
        favoritos: favoritos.rows,
        paginacion: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: favoritos.count,
          itemsPerPage: limit
        }
      };

      console.log('=== OBTENER FAVORITOS - ÉXITO ===');
      res.status(200).json(
        Respuesta.exito(resultado, 'Favoritos obtenidos correctamente')
      );
    } catch (error) {
      console.error('=== OBTENER FAVORITOS - ERROR ===');
      console.error('Error al obtener favoritos:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json(
        Respuesta.errorObj('Error interno del servidor')
      );
    }
  }

  // Verificar si una receta es favorita del usuario
  async verificarFavorito(req, res) {
    try {
      const { receta_id } = req.params;
      const usuario_id = req.usuario.usuario_id;

      const favorito = await Favoritos.findOne({
        where: {
          receta_id: receta_id,
          usuario_id: usuario_id
        }
      });

      const esFavorito = favorito !== null;

      res.status(200).json(
        Respuesta.exito(
          { esFavorito, fecha_favorito: favorito?.fecha_favorito },
          'Estado de favorito verificado'
        )
      );
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      res.status(500).json(
        Respuesta.errorObj('Error interno del servidor')
      );
    }
  }

  // Obtener estadísticas de favoritos de una receta
  async obtenerEstadisticasFavoritos(req, res) {
    try {
      const { receta_id } = req.params;

      // Verificar si la receta existe
      const receta = await Receta.findByPk(receta_id);
      if (!receta) {
        return res.status(404).json(
          Respuesta.errorObj('Receta no encontrada')
        );
      }

      // Contar total de favoritos para esta receta
      const totalFavoritos = await Favoritos.count({
        where: { receta_id }
      });

      res.status(200).json(
        Respuesta.exito(
          { receta_id, totalFavoritos },
          'Estadísticas de favoritos obtenidas'
        )
      );

    } catch (error) {
      console.error('Error al obtener estadísticas de favoritos:', error);
      res.status(500).json(
        Respuesta.errorObj('Error interno del servidor')
      );
    }
  }

  // Alternar estado de favorito (agregar/quitar)
  async alternarFavorito(req, res) {
    try {
      const { receta_id } = req.params;
      const usuario_id = req.usuario.usuario_id;

      // Verificar si la receta existe
      const receta = await Receta.findByPk(receta_id);
      if (!receta) {
        return res.status(404).json(
          Respuesta.errorObj('Receta no encontrada')
        );
      }

      // Buscar si ya existe el favorito
      const favoritoExistente = await Favoritos.findOne({
        where: {
          receta_id: receta_id,
          usuario_id: usuario_id
        }
      });

      if (favoritoExistente) {
        // Si existe, eliminarlo
        await Favoritos.destroy({
          where: {
            receta_id: receta_id,
            usuario_id: usuario_id
          }
        });

        res.status(200).json(
          Respuesta.exito(
            { accion: 'eliminado', esFavorito: false },
            'Receta eliminada de favoritos'
          )
        );
      } else {
        // Si no existe, crearlo
        const nuevoFavorito = await Favoritos.create({
          receta_id: receta_id,
          usuario_id: usuario_id,
          fecha_favorito: new Date()
        });

        res.status(201).json(
          Respuesta.exito(
            { accion: 'agregado', esFavorito: true, favorito: nuevoFavorito },
            'Receta agregada a favoritos'
          )
        );
      }

    } catch (error) {
      console.error('Error al alternar favorito:', error);
      res.status(500).json(
        Respuesta.errorObj('Error interno del servidor')
      );
    }
  }
}

module.exports = new FavoritosController();
