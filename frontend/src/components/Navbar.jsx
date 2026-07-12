import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Sistema de Inventario
      </Link>
      {user && (
        <div className="navbar-links">
          <Link to="/products">Productos</Link>
          <span className="navbar-user">{user.name}</span>
          <button type="button" onClick={handleLogout} className="btn-logout">
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
