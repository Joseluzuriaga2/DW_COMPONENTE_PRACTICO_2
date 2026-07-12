const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

const productValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('sku').trim().notEmpty().withMessage('El SKU es obligatorio'),
  body('category').trim().notEmpty().withMessage('La categoría es obligatoria'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
  body('quantity').isInt({ min: 0 }).withMessage('La cantidad debe ser un entero mayor o igual a 0'),
];

// Todas las rutas de productos requieren autenticación
router.use(protect);

router.route('/').get(getProducts).post(productValidation, validate, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(productValidation, validate, updateProduct)
  .delete(deleteProduct);

module.exports = router;
