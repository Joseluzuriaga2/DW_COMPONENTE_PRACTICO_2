/**
 * Tabla reutilizable para listar productos con acciones de editar/eliminar.
 */
export default function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="empty-state">No hay productos registrados todavía.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className={product.lowStock ? 'row-low-stock' : ''}>
              <td data-label="Nombre">{product.name}</td>
              <td data-label="SKU">{product.sku}</td>
              <td data-label="Categoría">{product.category}</td>
              <td data-label="Precio">${Number(product.price).toFixed(2)}</td>
              <td data-label="Cantidad">{product.quantity}</td>
              <td data-label="Estado">{product.lowStock ? 'Stock bajo' : 'Normal'}</td>
              <td className="table-actions" data-label="Acciones">
                <button type="button" className="btn-edit" onClick={() => onEdit(product)}>
                  Editar
                </button>
                <button type="button" className="btn-delete" onClick={() => onDelete(product._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
