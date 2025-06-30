import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  requiredModules?: string[]; // Ahora es opcional
};

const ProtectedRoute = ({ children, requiredModules }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si no se requieren módulos específicos, solo verifica autenticación
  if (!requiredModules || requiredModules.length === 0) {
    return <>{children}</>;
  }

  // Verificar si el usuario tiene al menos uno de los módulos requeridos
  const tienePermiso =
    Array.isArray(user.modulos) &&
    requiredModules.some((mod) =>
      user.modulos.some((m) => m.nombre === mod)
    );

  if (!tienePermiso) {
    return <Navigate to="/no-autorizado" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
