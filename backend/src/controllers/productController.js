const Product = require('../models/Product');

/**
 * @route  POST /api/products
 * @desc   Crea un nuevo producto en el inventario
 * @access Privado
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, description, price, quantity, minStock } = req.body;

    const product = await Product.create({
      name,
      sku,
      category,
      description,
      price,
      quantity,
      minStock,
      createdBy: req.user._id,
    });

    return res.status(201).json({ message: 'Producto creado correctamente', product });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/products
 * @desc   Lista todos los productos, con filtro opcional por nombre/categoría
 * @access Privado
 */
const getProducts = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search ? { $text: { $search: search } } : {};

    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ count: products.length, products });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  GET /api/products/:id
 * @desc   Obtiene un producto por su ID
 * @access Privado
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  PUT /api/products/:id
 * @desc   Actualiza un producto existente
 * @access Privado
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json({ message: 'Producto actualizado correctamente', product });
  } catch (error) {
    next(error);
  }
};

/**
 * @route  DELETE /api/products/:id
 * @desc   Elimina un producto del inventario
 * @access Privado
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
