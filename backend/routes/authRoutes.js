const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');


// Registro
router.post('/registrar', authController.registrar);

// Login
router.post('/login', authController.login);

// Validar token
router.post('/validar-token', authMiddleware, authController.validarToken);

// Logout
router.post('/logout', authMiddleware, authController.logout);

// Obtener datos del usuario
router.get('/usuario', authMiddleware, authController.obtenerDatos);
//Actualizar datos del usuario
router.put('/actualizarusuario', authMiddleware, authController.actualizarDatos);


module.exports = router;