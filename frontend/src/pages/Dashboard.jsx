import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Icon from '../components/Icon';

const currency = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
});

export default function Dashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el resumen del inventario');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0);
    const totalValue = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const lowStockProducts = products.filter(
      (product) => product.quantity <= product.minStock
    );
    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return { totalUnits, totalValue, lowStockProducts, recentProducts };
  }, [products]);

  if (loading) {
    return <p className="page-loading">Cargando resumen...</p>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Bienvenido{user ? `, ${user.name}` : ''}</h1>
        <p className="dashboard-subtitle">Resumen general de tu inventario</p>
      </header>

      {error && <p className="form-error">{error}</p>}

      <section className="stat-grid">
        <StatCard icon={<Icon name="package" />} label="Productos" value={products.length} />
        <StatCard icon={<Icon name="layers" />} label="Unidades en stock" value={stats.totalUnits} />
        <StatCard
          icon={<Icon name="dollar" />}
          label="Valor del inventario"
          value={currency.format(stats.totalValue)}
        />
        <StatCard
          icon={<Icon name="alert" />}
          label="Con stock bajo"
          value={stats.lowStockProducts.length}
          variant={stats.lowStockProducts.length > 0 ? 'alert' : 'default'}
        />
      </section>

      {stats.lowStockProducts.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title-alert">
            <Icon name="alert" size={20} />
            Productos con stock bajo
          </h2>
          <div className="table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((product) => (
                  <tr key={product._id} className="row-low-stock">
                    <td data-label="Producto">{product.name}</td>
                    <td data-label="SKU">{product.sku}</td>
                    <td data-label="Stock">{product.quantity}</td>
                    <td data-label="Mínimo">{product.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Últimos productos agregados</h2>
          <Link to="/products" className="btn-primary">
            Ver todos
          </Link>
        </div>

        {stats.recentProducts.length === 0 ? (
          <p className="empty-state">
            Aún no hay productos registrados. Crea el primero desde el inventario.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProducts.map((product) => (
                  <tr key={product._id}>
                    <td data-label="Producto">{product.name}</td>
                    <td data-label="SKU">{product.sku}</td>
                    <td data-label="Categoría">{product.category}</td>
                    <td data-label="Precio">{currency.format(product.price)}</td>
                    <td data-label="Stock">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
