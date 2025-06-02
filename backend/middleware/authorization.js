// middleware/authorization.js
// Verificar si el usuario tiene permisos para acceder a la receta
function authorization(req, res, next) {
  try {
    // El middleware de autenticación ya ha añadido req.usuario con la información del usuario
    const { usuario_id, Rol } = req.usuario;

    // Si es admin, permitir acceso inmediato
    if (Rol === "admin") {
      return next();
    }

    // Guardar el ID del usuario para usar en los controladores
    req.usuarioId = usuario_id;
    req.esAdmin = Rol === "admin";

    // Continuar al siguiente middleware o controlador
    next();
  } catch (error) {
    console.error("Error en middleware de autorización:", error);
    return res.status(500).json({
      exito: false,
      error: {
        codigo: "ERROR_AUTORIZACION",
        mensaje: "Error al verificar permisos",
      },
    });
  }
}

module.exports = { authorization };
