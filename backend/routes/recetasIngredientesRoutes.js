const express = require('express');
const router = express.Router();
const recetasIngredientesController = require('../controllers/recetasIngredientesController');
const authMiddleware = require('../middleware/auth');
const { authorization } = require('../middleware/authorization');

// Ruta para obtener todos los ingredientes de una receta
router.get('/receta/:receta_id', recetasIngredientesController.getIngredientesByReceta);

// Ruta para añadir un ingrediente a una receta
router.post('/', authMiddleware, authorization, recetasIngredientesController.addIngredienteToReceta);

// Ruta para actualizar un ingrediente de una receta
router.put('/:id', authMiddleware, authorization, recetasIngredientesController.updateIngredienteReceta);

// Ruta para eliminar un ingrediente de una receta
router.delete('/:id', authMiddleware, authorization, recetasIngredientesController.removeIngredienteFromReceta);

module.exports = router;