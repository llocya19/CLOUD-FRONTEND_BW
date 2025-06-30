// frontend/src/components/ui/Sidebar.tsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout as logoutService } from '../../services/authService';

type SidebarProps = {
  show: boolean;
  onClose: () => void;
};

export const Sidebar = ({ show, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutService(); // si usas API para cerrar sesión
      logout(); // limpia el contexto
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <div
      className={`offcanvas offcanvas-start ${show ? 'show' : ''}`}
      tabIndex={-1}
      style={{
        visibility: show ? 'visible' : 'hidden',
        backgroundColor: '#1c1c1c',
        color: 'white',
        width: '260px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        transform: show ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1050,
        overflowY: 'auto',
      }}
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title"> Mi Perfil</h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>

      <div className="offcanvas-body d-flex flex-column px-3">
        {user ? (
          <>
            {/* Foto y nombre */}
            <div className="text-center mb-3">
              <img
                src={user.foto || '/images/user.png'}
                alt="Usuario"
                className="rounded-circle shadow"
                style={{ width: '90px', height: '90px', objectFit: 'cover' }}
              />
              <p className="mt-2 mb-0 fs-5 fw-bold">{user.nombre || 'Usuario'}</p>
              <span
                className={`badge px-3 py-1 mt-1 ${
                  user.estado === 'activo' ? 'bg-success' : 'bg-secondary'
                }`}
              >
                {user.estado?.toUpperCase() || 'INACTIVO'}
              </span>
              <div className="mt-2 text-light">
                <strong>Rol:</strong> {user.rol}
              </div>
            </div>

            <hr className="bg-secondary" />

            {/* Acciones */}
            <button
              className="btn btn-outline-light mb-2 w-100 text-start"
              onClick={() => navigate('/empresa')}
            >
              🏢 Información de la Empresa
            </button>

            <button
              className="btn btn-outline-light mb-2 w-100 text-start"
              onClick={() => alert('Configuración aún no implementada')}
            >
              ⚙️ Configuración
            </button>

            {/* Botón cerrar sesión */}
            <div className="mt-auto">
              <button
                className="btn btn-danger w-100 text-start"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted mt-5">
            <p>Inicia sesión para acceder a tu perfil</p>
          </div>
        )}
      </div>
    </div>
  );
};
