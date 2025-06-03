//Importar libreria para respuestas
const Respuesta = require("../utils/respuesta")
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js")
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Recuperar el modelo pedidos
const Pasos = models.pasos

// Recuperar el modelo platos
const Receta = models.receta

class PasosController {
  async getAllPasos(req, res) {
    try {
      const data = await Pasos.findAll({
        order: [
          ["receta_id", "ASC"],
          ["orden", "ASC"],
        ],
      })
      res.json(Respuesta.success(data, "Datos de pedidos recuperados"))
    } catch (err) {
      res.status(500).json(Respuesta.error(null, `Error al recuperar los datos de los pasos: ${req.originalUrl}`))
    }
  }

  //Buscar pasos por codigo receta
  async getPasosByReceta(req, res) {
    try {
      // Obtener el ID de la receta desde los parámetros
      const recetaId = req.params.receta;
      console.log(`Buscando pasos para la receta con ID: ${recetaId}`);
      
      // Verificar si la receta existe usando el nombre de columna correcto
      const recetaExiste = await Receta.findByPk(recetaId);
      
      if (!recetaExiste) {
        console.log(`Receta con ID ${recetaId} no encontrada`);
        return res.status(404).json(Respuesta.error(res, null, `Receta con ID ${recetaId} no encontrada`));
      }
      
      // Especificar explícitamente las columnas para evitar problemas
      const data = await Pasos.findAll({
        attributes: [
          'orden', 
          'receta_id', 
          'descripcion', 
          'ingrediente', 
          'cantidad', 
          'unidad_medida', 
          'tipo', 
          'duracion', 
          'necesario'
        ],
        where: {
          receta_id: recetaId
        },
        order: [["orden", "ASC"]],
      });
      
      console.log(`Pasos encontrados para receta ${recetaId}: ${data ? data.length : 0}`);
      
      // Aunque no haya pasos, devolvemos un array vacío con código 200, no es un error
      return Respuesta.success(res, 200, `Datos de pasos para receta ${recetaId} recuperados`, data);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      console.error(`Stack: ${err.stack}`);
      console.log(err);

      res.status(500).json(Respuesta.error(res, null, `Error al recuperar los datos de los pasos: ${req.originalUrl}. Detalles: ${err.message}`));
    }
  }

  // Método auxiliar para verificar permisos
  async verificarPermisoReceta(recetaId, usuarioId, esAdmin) {
    try {
      const receta = await Receta.findByPk(recetaId)
      if (!receta) {
        return { permitido: false, mensaje: "Receta no encontrada" }
      }

      // Si es admin o es el creador de la receta
      if (esAdmin || receta.usuario_id === usuarioId) {
        return { permitido: true }
      }

      return { permitido: false, mensaje: "No tienes permisos para modificar esta receta" }
    } catch (error) {
      console.error("Error verificando permisos:", error)
      return { permitido: false, mensaje: "Error al verificar permisos" }
    }
  }

  //Crear un paso
  async createPaso(req, res) {
    try {
      console.log("Datos recibidos:", req.body)
      // Verificar permisos para la receta
      const recetaId = req.body.receta_id
      const { permitido, mensaje } = await this.verificarPermisoReceta(recetaId, req.usuarioId, req.esAdmin)
      if (!permitido) {
        return res.status(403).json(Respuesta.error(res, null, mensaje))
      }
      const { descripcion, cantidad, unidad_medida, tipo, duracion } = req.body
      // Validaciones
      if (descripcion.length < 7) {
        return Respuesta.error(res, 400, "Descripción debe ser más larga.");
      }
      if (cantidad && !unidad_medida) {
        return Respuesta.error(res, 400, "Debe haber unidad de medida si hay cantidad.");
      }
      if (!cantidad && unidad_medida) {
        return Respuesta.error(res, 400, "Debe haber cantidad si hay unidad de medida.");
      }
      if (!tipo) {
        return Respuesta.error(res, 400, "El campo tipo es obligatorio.");
      }
      if (!duracion) {
        return Respuesta.error(res, 400, "El campo duración es obligatorio.");
      }
      // Calcular el siguiente número de orden disponible para la receta
      const maxPaso = await Pasos.max('orden', { where: { receta_id: recetaId } });
      const nuevoOrden = (maxPaso || 0) + 1;
      // Crear el paso con el nuevo orden
      const pasoData = {
        ...req.body,
        cantidad: cantidad ? Number.parseFloat(cantidad) : null,
        orden: nuevoOrden // forzar el orden correcto
      }
      const data = await Pasos.create(pasoData)
      return Respuesta.success(res, 201, "Paso creado correctamente", data);
    } catch (err) {
      console.error(`Error al crear el paso: ${err.message}`)
      console.error("Error stack:", err.stack)
      console.error("Error details:", err)
      return Respuesta.error(res, 500, `Error al crear el paso, Ya existe.`);
    }
  }

  //borrar paso x de la receta x
  async deletePaso(req, res) {
    try {
      const orden = req.params.orden
      const recetaId = req.params.receta

      // Verificar permisos para la receta
      const { permitido, mensaje } = await this.verificarPermisoReceta(recetaId, req.usuarioId, req.esAdmin)

      if (!permitido) {
        return res.status(403).json(Respuesta.error(res, null, mensaje))
      }

      const data = await Pasos.destroy({
        where: {
          orden: orden,
          receta_id: recetaId,
        },
      })

      if (data == 1) {
        res.json(Respuesta.success(data, "Paso eliminado correctamente"))
      } else {
        return Respuesta.error(res, 404, "No se pudo eliminar el paso")
      }
    } catch (err) {
      console.error(`Error al eliminar el paso: ${err.message}`)
      console.error(err)

      res.status(500).json(Respuesta.error(res, null, `Error al eliminar el paso: ${req.originalUrl}`))
    }
  }

  //actualizar paso
  async updatePaso(req, res) {
    try {
      const orden = req.params.orden
      const recetaId = req.params.receta

      // Verificar permisos para la receta
      const { permitido, mensaje } = await this.verificarPermisoReceta(recetaId, req.usuarioId, req.esAdmin)

      if (!permitido) {
        return res.status(403).json(Respuesta.error(res, null, mensaje))
      }

      console.log(`Parámetros recibidos - Orden: ${orden}, Receta: ${recetaId}`)

      const { descripcion, cantidad, unidad_medida, tipo, duracion } = req.body

      // Validaciones
      if (descripcion && descripcion.length < 7) {
        return res.status(400).json(Respuesta.error(res, null, "Descripción debe ser más larga."))
      }

      if (cantidad && !unidad_medida) {
        return res.status(400).json(Respuesta.error(res, null, "Debe haber unidad de medida si hay cantidad."))
      }
      if (!cantidad && unidad_medida) {
        return res.status(400).json(Respuesta.error(res, null, "Debe haber cantidad si hay unidad de medida."))
      }

      if (tipo === undefined || tipo === null) {
        return res.status(400).json(Respuesta.error(res, null, "El campo tipo es obligatorio."))
      }

      if (duracion === undefined || duracion === null) {
        return res.status(400).json(Respuesta.error(res, null, "El campo duración es obligatorio."))
      }

      // Verificar si el paso existe
      const paso = await Pasos.findOne({
        where: {
          orden: orden,
          receta_id: recetaId,
        },
      })

      console.log(`Resultado de la búsqueda del paso: ${JSON.stringify(paso)}`)

      if (!paso) {
        console.log("El paso no existe")
        return res.status(404).json(Respuesta.error(res, null, "El paso no existe"))
      }

      const pasoData = {
        ...req.body,
        cantidad: cantidad ? Number.parseFloat(cantidad) : null,
      }

      // Intentar actualizar el paso
      const [updated] = await Pasos.update(pasoData, {
        where: {
          orden: orden,
          receta_id: recetaId,
        },
      })

      console.log(`Resultado de la actualización: ${updated}`)

      if (updated) {
        res.json(Respuesta.success(updated, "Paso actualizado correctamente"))
      } else {
        return Respuesta.error(res, 400, "No se pudo actualizar el paso, los datos son iguales")
      }
    } catch (err) {
      console.error(`Error al actualizar el paso: ${err.message}`)
      console.error(err)

      res.status(500).json(Respuesta.error(res, null, `Error al actualizar el paso: ${req.originalUrl}`))
    }
  }

  //Buscar un paso por orden y receta
  async getPaso(req, res) {
    try {
      const data = await Pasos.findOne({
        where: {
          orden: req.params.orden,
          receta_id: req.params.receta,
        },
      })

      res.json(Respuesta.success(data, "Datos del paso recuperados"))
    } catch (err) {
      console.error(`Error: ${err.message}`)
      console.log(err)

      res.status(500).json(Respuesta.error(res, null, `Error al recuperar los datos del paso: ${req.originalUrl}`))
    }
  }
}

module.exports = PasosController
