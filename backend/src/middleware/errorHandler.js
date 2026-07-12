/**
 * Middleware centralizado de manejo de errores.
 * Traduce errores comunes de Mongoose/Express a respuestas JSON claras.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Error de clave duplicada (unique)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `El valor de '${field}' ya está en uso` });
  }

  // ID de Mongo con formato inválido
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Identificador inválido: ${err.value}` });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
  });
};

// Middleware para rutas no encontradas (404)
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Ruta no encontrada: ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
