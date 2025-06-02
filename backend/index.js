// Importar libreria para manejo de ficheros de configuración dependiendo de la variable de entorno NODE_ENV
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const authRoutes = require('./routes/authRoutes');

// Importar fichero de configuración con variables de entorno
const config = require("./config/config");
// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar libreria CORS
const cors = require("cors");
// Importar gestores de rutas

const recetaRoutes = require("./routes/recetaRoutes");
const pasosRoutes = require("./routes/pasosRoutes");
const reporteRoutes = require('./routes/reporteRoutes');
const ingredientesPrincipalesRoutes = require('./routes/ingredientesPrincipalesRoutes');
const recetasIngredientesRoutes = require('./routes/recetasIngredientesRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const cookieParser = require('cookie-parser');

// Configurar middleware para analizar JSON en las solicitudes
app.use(cookieParser());

app.use(express.json());

// Configuración CORS mejorada
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:4200"], // Corregido para incluir el puerto correcto del backend
  credentials: true, // Permitir envío de cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Asegurarse de permitir DELETE
  allowedHeaders: ["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"]
}));

// IMPORTANTE: Configuración para que Express siempre devuelva JSON para solicitudes a la API
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Configurar rutas de la API Rest
app.use('/api/auth', authRoutes);
const authMiddleware = require('./middleware/auth');
app.use('/api/reportes', authMiddleware, reporteRoutes);
app.use('/api/receta', authMiddleware, recetaRoutes); // RUTA ORIGINAL
app.use('/api/recetas', authMiddleware, recetaRoutes); // RUTA ADICIONAL (PLURAL)
app.use('/api/pasos', authMiddleware, pasosRoutes);

// Rutas para ingredientes principales
app.use('/api/ingredientesPrincipales', ingredientesPrincipalesRoutes);

// Rutas para ingredientes de recetas
app.use('/api/recetasIngredientes', recetasIngredientesRoutes);

// Rutas para favoritos
app.use('/api/favoritos', favoritosRoutes);

// Rutas para usuarios y seguidores
app.use('/api/usuarios', usuarioRoutes);

// Servir archivos estáticos y ruta de captura para SPA
if (process.env.NODE_ENV !== "production") {
  console.log("Sirviendo ficheros de desarrollo");
  app.use(express.static(path.join(__dirname, "public")));
  
  // IMPORTANTE: Este capturador de rutas debe ir DESPUÉS de todas las rutas de la API
  // para que no intercepte las solicitudes a la API y solo maneje las rutas del frontend
  app.get("*", (req, res) => {
    // No interceptará las rutas /api/* porque ya están definidas arriba
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
} else {
  console.log("Sirviendo ficheros de producción");
  app.use(express.static(path.join(__dirname, "public")));
  
  // IMPORTANTE: Este capturador de rutas debe ir DESPUÉS de todas las rutas de la API
  app.get("*", (req, res) => {
    // No interceptará las rutas /api/* porque ya están definidas arriba
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Iniciar el servidor solo si no estamos en modo de prueba
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`Servidor escuchando en el puerto ${config.port}`);
  });
}

// Exportamos la aplicación para poder hacer pruebas
module.exports = app;