import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Bienvenido{user ? `, ${user.name}` : ''}</h1>
      <p>Administra el inventario de productos de forma rápida y segura.</p>
      <Link to="/products" className="btn-primary">
        Ir al inventario
      </Link>
    </div>
  );
}
