const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware que protege rutas privadas.
 * Valida el token JWT enviado en el header Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No autorizado, token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'No autorizado, el usuario ya no existe' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sesión expirada, inicia sesión nuevamente' });
    }
    return res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

module.exports = { protect };
