const { Op } = require("sequelize");
const { receta: Receta } = require("../models/init-models")(require("../config/sequelize"));
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

// Importar modelos para incluir datos del usuario
const initModels = require("../models/init-models");
const sequelize = require("../config/sequelize");
const models = initModels(sequelize);

// Obtener todas las recetas con paginación y filtrado
exports.getAllReceta = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const filterCriteria = req.query.filterCriteria || null;
    const searchQuery = req.query.searchQuery || null;
    const whereClause = {};

    if (filterCriteria && searchQuery) {
      if (filterCriteria === "fecha_creacion" || filterCriteria === "fecha_publicacion") {
        if (searchQuery.includes('|')) {
          const [fechaDesde, fechaHasta] = searchQuery.split('|');
          whereClause[filterCriteria] = {
            [Op.between]: [fechaDesde, fechaHasta]
          };
        } else {
          whereClause[filterCriteria] = {
            [Op.gte]: searchQuery
          };
        }
      } else {
        whereClause[filterCriteria] = { [Op.like]: `${searchQuery}%` };
      }
    }

    // Multi-ingredientes: aceptar lista de IDs
    let ingredientesParam = req.query.ingredientes;
    let ingredientesArray = [];
    if (ingredientesParam) {
      if (typeof ingredientesParam === 'string') {
        ingredientesArray = ingredientesParam.split(',').map(x => x.trim()).filter(x => x);
      } else if (Array.isArray(ingredientesParam)) {
        ingredientesArray = ingredientesParam;
      }
    }

    let recetaInclude = [];
    let useDistinct = false;
    if (ingredientesArray.length > 0) {
      recetaInclude.push({
        model: models.Recetas_Ingredientes,
        as: 'Recetas_Ingredientes',
        required: true,
        where: { ingrediente_id: { [Op.in]: ingredientesArray.map(Number) } }
      });
      useDistinct = true;
    }

    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const { rows: data, count: totalItems } = await models.receta.findAndCountAll({
      where: whereClause,
      include: recetaInclude,
      offset,
      limit,
      distinct: useDistinct // Solo usar distinct si hay filtro de ingredientes
    });

    res.status(200).json({
      datos: data,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      currentPage: page,
      mensaje: "Datos de recetas recuperados",
    });
  } catch (err) {
    console.error("Error al recuperar las recetas:", err);
    res.status(500).json({ mensaje: `Error al recuperar las recetas: ${err.message}` });
  }
};

// Obtener receta por ID
exports.getRecetaById = async (req, res) => {
  try {
    const recetaConUsuario = await Receta.findByPk(req.params.receta_id, {
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['usuario_id', 
          'Nombre_de_usuario', 
          // 'Nombre', 'Apellidos', 
          'Foto_de_perfil']
      }]
    });

    if (!recetaConUsuario) {
      // Asegurarnos explícitamente de que la respuesta es JSON
      res.setHeader('Content-Type', 'application/json');
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }
    
    // Configurar explícitamente el encabezado Content-Type como JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Devolver la respuesta con una estructura similar a getAllReceta
    return res.status(200).json({
      datos: recetaConUsuario,
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      mensaje: "Receta recuperada correctamente"
    });
  } catch (err) {
    console.error("Error al recuperar la receta:", err);
    // Asegurarnos explícitamente de que la respuesta de error es JSON
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ mensaje: `Error al recuperar la receta: ${err.message}` });
  }
};

// Crear una nueva receta
exports.createReceta = async (req, res) => {
  try {
    // Validar que el token esté presente en las cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    // Decodificar el token para obtener el usuario_id
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }

    // Asignar usuario_id desde el token decodificado
    req.body.usuario_id = decoded.usuario_id;

    // Validar campos obligatorios
    const { nombre, descripcion, tiempo_preparacion, dificultad, imagen } = req.body;
    if (!nombre || !descripcion || !tiempo_preparacion || !dificultad || !imagen) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Si el usuario no proporciona una fecha de creación, usar la fecha actual
    if (!req.body.fechaCreacion) {
      req.body.fecha_creacion = new Date().toISOString().split("T")[0];
    } else {
      // Si proporciona una fecha, usarla
      req.body.fecha_creacion = req.body.fechaCreacion;
    }
    
    // Extraer y mapear los campos
    const { videoLink, esPublica, autorOriginal, origen, fechaCreacion, ingredientes, ...datosReceta } = req.body;
    
    // Asignar los campos a las columnas correspondientes en la base de datos
    if (videoLink) datosReceta.video_instrucciones = videoLink;
    if (esPublica !== undefined) datosReceta.publica = esPublica;
    if (autorOriginal) datosReceta.autor = autorOriginal;
    if (origen) datosReceta.origen = origen;

    // Crear la receta
    const nuevaReceta = await Receta.create(datosReceta);
    
    // Si hay ingredientes, guardarlos en la tabla intermedia
    if (ingredientes && Array.isArray(ingredientes) && ingredientes.length > 0) {
      // Importar el modelo RecetasIngredientes para crear las relaciones
      const { Recetas_Ingredientes } = require("../models/init-models")(require("../config/sequelize"));
      
      // Crear una entrada en la tabla intermedia para cada ingrediente
      for (const ingrediente of ingredientes) {
        await Recetas_Ingredientes.create({
          receta_id: nuevaReceta.receta_id,
          ingrediente_id: ingrediente.id,
          Cantidad: ingrediente.cantidad,
          Unidad: ingrediente.unidad
        });
      }
    }
    
    res.status(201).json({
      receta: nuevaReceta,
      mensaje: "Receta creada correctamente con sus ingredientes"
    });
  } catch (err) {
    console.error("Error al crear la receta:", err);
    res.status(500).json({ mensaje: `Error al crear la receta: ${err.message}` });
  }
};

// Editar una receta existente
exports.updateReceta = async (req, res) => {
  try {
    // Validar que el token esté presente en las cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    // Decodificar el token para obtener el usuario_id
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }

    const usuario_id = decoded.usuario_id;
    const receta_id = req.params.receta_id;
    
    // Buscar la receta
    const receta = await Receta.findByPk(receta_id);
    if (!receta) {
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }
    
    // Verificar si el usuario es el propietario de la receta
    if (receta.usuario_id !== usuario_id) {
      return res.status(403).json({ mensaje: "No tienes permiso para editar esta receta" });
    }
    
    // Extraer los ingredientes del cuerpo de la solicitud
    const { ingredientes, ...datosReceta } = req.body;
    
    // Actualizar la receta
    await receta.update(datosReceta);
    
    // Actualizar los ingredientes si se proporcionaron
    if (ingredientes && Array.isArray(ingredientes) && ingredientes.length > 0) {
      try {
        // Importar correctamente el modelo de ingredientes de recetas
        const models = require("../models/init-models")(require("../config/sequelize"));
        // Verificar qué modelo está disponible para recetas_ingredientes
        console.log("Modelos disponibles:", Object.keys(models));
        
        // Intentar acceder al modelo correcto (puede ser recetasIngredientes o recetas_ingredientes)
        let RecetasIngredientesModel;
        if (models.recetasIngredientes) {
          RecetasIngredientesModel = models.recetasIngredientes;
        } else if (models.recetas_ingredientes) {
          RecetasIngredientesModel = models.recetas_ingredientes;
        } else {
          // Buscar cualquier modelo que pueda contener "recetas" e "ingredientes" en su nombre
          const possibleModelName = Object.keys(models).find(key => 
            key.toLowerCase().includes('receta') && key.toLowerCase().includes('ingrediente')
          );
          
          if (possibleModelName) {
            RecetasIngredientesModel = models[possibleModelName];
          } else {
            throw new Error("No se pudo encontrar el modelo de ingredientes de recetas");
          }
        }
        
        if (!RecetasIngredientesModel) {
          throw new Error("El modelo de ingredientes de recetas no está disponible");
        }
        
        // Eliminar los ingredientes actuales de la receta
        await RecetasIngredientesModel.destroy({
          where: { receta_id: receta_id }
        });
        
        // Crear nuevas entradas para los ingredientes actualizados
        for (const ingrediente of ingredientes) {
          await RecetasIngredientesModel.create({
            receta_id: receta_id,
            ingrediente_id: ingrediente.ingrediente_id,
            Cantidad: ingrediente.cantidad,
            Unidad: ingrediente.unidad
          });
        }
      } catch (err) {
        console.error("Error al actualizar los ingredientes:", err);
        return res.status(500).json({ mensaje: `Error al actualizar los ingredientes: ${err.message}` });
      }
    }
    
    // Obtener la receta actualizada con todos sus datos
    const recetaActualizada = await Receta.findByPk(receta_id);
    
    res.status(200).json({
      receta: recetaActualizada,
      mensaje: "Receta actualizada correctamente"
    });
  } catch (err) {
    console.error("Error al editar la receta:", err);
    res.status(500).json({ mensaje: `Error al editar la receta: ${err.message}` });
  }
};

// Eliminar una receta
exports.deleteReceta = async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.receta_id);
    if (!receta) {
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }
    await receta.destroy();
    res.status(200).json({ mensaje: "Receta eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar la receta:", err);
    res.status(500).json({ mensaje: `Error al eliminar la receta: ${err.message}` });
  }
};

// Obtener recetas personales del usuario
exports.getRecetasPersonales = async (req, res) => {
  
  try {
    // Validar que el token esté presente en las cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    // Decodificar el token para obtener el usuario_id
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return res.status(401).json({ mensaje: "Token inválido o expirado" });
    }

    const usuario_id = decoded.usuario_id;

    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const filterCriteria = req.query.filterCriteria || null;
    const searchQuery = req.query.searchQuery || null;

    const whereClause = { usuario_id }; // Filtrar por usuario_id

    if (filterCriteria && searchQuery) {
      if (filterCriteria === "fecha_creacion" || filterCriteria === "fecha_publicacion") {
        // Check if searchQuery contains a date range (fecha1|fecha2)
        if (searchQuery.includes("|")) {
          const [fechaDesde, fechaHasta] = searchQuery.split("|");
          whereClause[filterCriteria] = {
            [Op.between]: [fechaDesde, fechaHasta]
          };
        } else {
          // Single date search - use greater than or equal
          whereClause[filterCriteria] = {
            [Op.gte]: searchQuery
          };
        }
      } else {
        whereClause[filterCriteria] = { [Op.like]: `${searchQuery}%` };
      }
    }

    const offset = (page - 1) * itemsPerPage;
    const limit = itemsPerPage;

    const { rows: data, count: totalItems } = await Receta.findAndCountAll({
      where: whereClause,
      offset,
      limit,
    });

    res.status(200).json({
      datos: data,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      currentPage: page,
      mensaje: "Recetas personales recuperadas",
    });
  } catch (err) {
    console.error("Error al recuperar las recetas personales:", err);
    res.status(500).json({ mensaje: `Error al recuperar las recetas personales: ${err.message}` });
  }
};

// Obtener todas las recetas de un usuario por su id
exports.getRecetasPorUsuarioId = async (req, res) => {
  try {
    const usuario_id = Number(req.params.usuario_id);
    if (!usuario_id) {
      return res.status(400).json({ exito: false, mensaje: 'Falta el parámetro usuario_id' });
    }
    console.log('Buscando recetas para usuario_id:', usuario_id);
    const recetas = await Receta.findAll({
      where: { usuario_id },
      order: [['fecha_creacion', 'DESC']]
    });
    return res.status(200).json({ exito: true, datos: recetas });
  } catch (error) {
    console.error('Error al obtener recetas del usuario:', error);
    return res.status(500).json({ exito: false, mensaje: 'Error al obtener recetas del usuario' });
  }
};
