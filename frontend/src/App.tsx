// frontend/src/App.tsx

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import RolesPage from './pages/RolesPage';
import UsuariosPage from './pages/UsuariosPage';
import CategoriasPage from './pages/CategoriasPage';
import MarcasPage from './pages/MarcasPage';
import ProductosPage from './pages/ProductosPage';
import ClientesPage from './pages/ClientesPage';
import VentasPage from './pages/VentasPage';
import EmpresaInfo from './components/empresa/EmpresaInfo';
import LoginPage from './pages/Login';
import NoAutorizado from './pages/NoAutorizado';
import ProtectedRoute from './routes/ProtectedRoute';
import OtpVerify from './pages/OtpVerify';
import Navbar from './components/ui/Navbar';
import { Sidebar } from './components/ui/Sidebar';
import Toast from './components/ui/Toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import useInactividad from './hooks/useInactividad';

function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' }>({
    msg: '',
    type: 'success',
  });

  const { user, logout } = useAuth();

  // ⏱️ Cerrar sesión automáticamente tras 2 minutos (120000 ms) de inactividad
  useInactividad(logout, 2 * 60 * 1000);

  const handleToggleMenu = () => {
    setShowSidebar(!showSidebar);
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  return (
    <div className="app-container">
      {user && <Navbar onToggleMenu={handleToggleMenu} />}
      {user && <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />}

      <main className="main-content p-4">
        <Routes>
          {/* Público */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute requiredModules={['Roles']}>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute requiredModules={['Usuarios']}>
                <UsuariosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias"
            element={
              <ProtectedRoute requiredModules={['Categorías']}>
                <CategoriasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marcas"
            element={
              <ProtectedRoute requiredModules={['Marcas']}>
                <MarcasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute requiredModules={['Productos']}>
                <ProductosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute requiredModules={['Clientes']}>
                <ClientesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ventas"
            element={
              <ProtectedRoute requiredModules={['Ventas']}>
                <VentasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresa"
            element={
              <ProtectedRoute requiredModules={['Empresa']}>
                <EmpresaInfo showToast={showToast} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {toast.msg && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}

export default AppWrapper;
