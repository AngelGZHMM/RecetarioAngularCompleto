const express = require("express");
const router = express.Router();
const PasosController = require("../controllers/pasosController");
const { authorization } = require("../middleware/authorization");

const pasosController = new PasosController();

// Rutas públicas (solo lectura)
router.get("/", pasosController.getAllPasos.bind(pasosController));
router.get("/receta/:receta", pasosController.getPasosByReceta.bind(pasosController)); // Ruta modificada para ser más explícita
router.get("/paso/:orden/:receta", pasosController.getPaso.bind(pasosController)); // Ruta modificada para ser más explícita

// Rutas que requieren autenticación y verificación de propiedad
router.post("/", authorization, pasosController.createPaso.bind(pasosController));
router.delete("/:orden/:receta", authorization, pasosController.deletePaso.bind(pasosController));
router.put("/:orden/:receta", authorization, pasosController.updatePaso.bind(pasosController));

module.exports = router;
