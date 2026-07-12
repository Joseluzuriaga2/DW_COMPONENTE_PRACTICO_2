const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'El código SKU es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad en stock es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
      default: 0,
    },
    minStock: {
      type: Number,
      min: [0, 'El stock mínimo no puede ser negativo'],
      default: 5,
    },
    // Relación: cada producto queda asociado al usuario que lo creó
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Índice para acelerar búsquedas por nombre/categoría
productSchema.index({ name: 'text', category: 'text' });

// Campo virtual: indica si el producto está bajo el stock mínimo
productSchema.virtual('lowStock').get(function getLowStock() {
  return this.quantity <= this.minStock;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
