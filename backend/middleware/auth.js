const jwt = require('jsonwebtoken'); // Asegurar que jsonwebtoken esté importado correctamente

module.exports = (req, res, next) => {
  try {

    // Leer token de cookies 
    console.log('Middleware auth.js: Verificando token en cookies...');
    console.log('archivo auth.js: ');
    const token = req.cookies.jwt
    console.log('Token recibido desde cookies:', token);
    
    if (!token || token === 'Bearer') {
      console.error('Token no válido o ausente:', token);
      return res.status(401).json({
        exito: false,
        error: {
          codigo: 'NO_AUTORIZADO',
          mensaje: 'Token no válido o ausente'
        }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      exito: false,
      error: {
        codigo: 'TOKEN_INVALIDO',
        mensaje: 'Token inválido o expirado'
      }
    });
  }
};