const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Middleware simple para revisar el resultado de express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().withMessage('Correo electrónico inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Correo electrónico inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

module.exports = router;
