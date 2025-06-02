const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { authorization } = require("../middleware/authorization");
const RecetaController = require("../controllers/recetaController");

// Obtener todas las recetas con paginación y filtrado
router.get("/todas_las_recetas", authMiddleware, RecetaController.getAllReceta);

// Obtener receta por ID
router.get("/receta_por_id/:receta_id", authMiddleware, RecetaController.getRecetaById);

// Crear una nueva receta
router.post("/crear_receta", authMiddleware, RecetaController.createReceta);

// Editar una receta existente
router.put("/editar_receta/:receta_id", authMiddleware, authorization, RecetaController.updateReceta);

// Eliminar una receta
router.delete("/eliminar_receta/:receta_id", authMiddleware, authorization, RecetaController.deleteReceta);

// Obtener recetas personales del usuario
router.get("/mis-recetas", authMiddleware, RecetaController.getRecetasPersonales);

// Obtener recetas de un usuario por su id
router.get("/recetasdelusuario/:usuario_id", authMiddleware, RecetaController.getRecetasPorUsuarioId);

module.exports = router;
