import { useState, useEffect } from 'react';

const emptyProduct = {
  name: '',
  sku: '',
  category: '',
  description: '',
  price: '',
  quantity: '',
  minStock: 5,
};

/**
 * Formulario controlado y reutilizable para crear/editar productos.
 * Recibe el producto inicial (para edición) y un callback onSubmit.
 */
export default function ProductForm({ initialProduct, onSubmit, onCancel, submitLabel }) {
  const [formData, setFormData] = useState(emptyProduct);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProduct) {
      setFormData({ ...emptyProduct, ...initialProduct });
    } else {
      setFormData(emptyProduct);
    }
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es obligatorio';
    if (!formData.category.trim()) newErrors.category = 'La categoría es obligatoria';
    if (formData.price === '' || Number(formData.price) < 0)
      newErrors.price = 'Ingresa un precio válido';
    if (formData.quantity === '' || Number(formData.quantity) < 0)
      newErrors.quantity = 'Ingresa una cantidad válida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      minStock: Number(formData.minStock) || 0,
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
        {errors.sku && <span className="field-error">{errors.sku}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoría</label>
        <input id="category" name="category" value={formData.category} onChange={handleChange} />
        {errors.category && <span className="field-error">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Cantidad</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="minStock">Stock mínimo</label>
          <input
            id="minStock"
            name="minStock"
            type="number"
            value={formData.minStock}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
