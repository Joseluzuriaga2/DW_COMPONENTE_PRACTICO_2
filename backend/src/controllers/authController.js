const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Genera un token JWT firmado con el id del usuario
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

/**
 * @route  POST /api/auth/register
 * @desc   Registra un nuevo usuario
 * @access Público
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  POST /api/auth/login
 * @desc   Autentica a un usuario y devuelve un token JWT
 * @access Público
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  POST /api/auth/logout
 * @desc   Cierra sesión. Como JWT es stateless, el cierre real
 *         ocurre en el cliente eliminando el token almacenado;
 *         este endpoint existe para mantener un flujo explícito
 *         y permitir, a futuro, una lista negra de tokens.
 * @access Privado
 */
const logout = async (req, res) => {
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

/**
 * @route  GET /api/auth/profile
 * @desc   Devuelve los datos del usuario autenticado (valida el token)
 * @access Privado
 */
const getProfile = async (req, res) => {
  const { _id, name, email, role } = req.user;
  return res.status(200).json({ user: { id: _id, name, email, role } });
};

module.exports = { register, login, logout, getProfile };
