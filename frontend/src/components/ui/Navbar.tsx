// frontend/src/components/ui/Navbar.tsx
import '../../styles/base.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type NavbarProps = {
  onToggleMenu: () => void;
};

const Navbar = ({ onToggleMenu }: NavbarProps) => {
  const { user } = useAuth();
  const modulos = user?.modulos || [];

  const tieneModulo = (nombre: string) => modulos.some((m) => m.nombre === nombre);

  return (
    <nav className="navbar navbar-dark px-3 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-light me-2" type="button" onClick={onToggleMenu}>
          ☰
        </button>
        <span className="navbar-brand mb-0 h1">🏪 Sistema de Ventas</span>
      </div>

      {/* Scroll horizontal en móviles */}
      <div className="navbar-icons d-flex align-items-center gap-2 overflow-auto flex-nowrap">
        {tieneModulo('Ventas') && (
          <Link to="/ventas" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Ventas">
            <img src="/images/carrito_compra.png" className="module-icon" alt="Ventas" style={{ width: '48px', height: '48px' }} />
            <small>Ventas</small>
          </Link>
        )}
        {tieneModulo('Productos') && (
          <Link to="/productos" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Productos">
            <img src="/images/mayorista.png" className="module-icon" alt="Productos" style={{ width: '48px', height: '48px' }} />
            <small>Productos</small>
          </Link>
        )}
        {tieneModulo('Clientes') && (
          <Link to="/clientes" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Clientes">
            <img src="/images/cliente.png" className="module-icon" alt="Clientes" style={{ width: '48px', height: '48px' }} />
            <small>Clientes</small>
          </Link>
        )}
        {tieneModulo('Categorías') && (
          <Link to="/categorias" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Categorías">
            <img src="/images/categoria.png" className="module-icon" alt="Categorías" style={{ width: '48px', height: '48px' }} />
            <small>Categorías</small>
          </Link>
        )}
        {tieneModulo('Roles') && (
          <Link to="/roles" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Roles">
            <img src="/images/permisos.png" className="module-icon" alt="Roles" style={{ width: '48px', height: '48px' }} />
            <small>Roles</small>
          </Link>
        )}
        {tieneModulo('Usuarios') && (
          <Link to="/usuarios" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Usuarios">
            <img src="/images/usuario.png" className="module-icon" alt="Usuarios" style={{ width: '48px', height: '48px' }} />
            <small>Usuarios</small>
          </Link>
        )}
        {tieneModulo('Marcas') && (
          <Link to="/marcas" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Marcas">
            <img src="/images/marca.png" className="module-icon" alt="Marcas" style={{ width: '48px', height: '48px' }} />
            <small>Marcas</small>
          </Link>
        )}
        {tieneModulo('Estadisticas') && (
          <Link to="/estadisticas" className="btn btn-outline-light p-1 d-flex flex-column align-items-center" title="Estadísticas">
            <img src="/images/estadistica.png" className="module-icon" alt="Estadísticas" style={{ width: '48px', height: '48px' }} />
            <small>Estadísticas</small>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
