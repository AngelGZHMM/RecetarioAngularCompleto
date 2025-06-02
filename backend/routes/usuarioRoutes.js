// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

// Rutas protegidas (requieren autenticación)
router.get('/buscar', auth, usuarioController.buscarUsuarios);
router.get('/todos', auth, usuarioController.listarUsuarios); // Nueva ruta para listar todos los usuarios
router.get('/perfil/:id', auth, usuarioController.obtenerPerfil);
router.get('/perfil', auth, usuarioController.obtenerPerfil);
router.get('/explorar', auth, usuarioController.explorarUsuarios);
router.post('/seguir/:id', auth, usuarioController.seguirUsuario);
router.delete('/seguir/:id', auth, usuarioController.dejarDeSeguir);
router.get('/seguidores/:id?', auth, usuarioController.listarSeguidores);
router.get('/seguidos/:id?', auth, usuarioController.listarSeguidos);

module.exports = router;