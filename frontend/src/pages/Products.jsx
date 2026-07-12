import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/products', { params: query ? { search: query } : {} });
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleCreateOrUpdate = async (productData) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el producto');
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Inventario de productos</h1>
        <button type="button" className="btn-primary" onClick={handleNewProduct}>
          + Nuevo producto
        </button>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-secondary">
          Buscar
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {showForm && (
        <div className="form-panel">
          <h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
          <ProductForm
            initialProduct={editingProduct}
            submitLabel={editingProduct ? 'Guardar cambios' : 'Crear producto'}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
