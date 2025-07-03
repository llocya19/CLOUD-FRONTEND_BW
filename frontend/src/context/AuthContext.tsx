import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import axios from 'axios';
import { getCsrfToken } from '../services/csrfService';

// ✅ Verifica que la URL del backend esté definida en .env
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error('⚠️ VITE_API_URL no está definido. Verifica tu archivo .env');
}

// 🧑‍💼 Tipo de usuario autenticado
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  estado: string;
  foto: string;
  rol: string;
  modulos: any[];
}

// 🔐 Tipo de contexto de autenticación
interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  login: (email: string, contraseña: string) => Promise<any>;  // ← CAMBIO: ya no es Promise<boolean>
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  // Cargar usuario desde localStorage (si está)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al parsear usuario almacenado:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // 🔐 Iniciar sesión
  const login = async (email: string, contraseña: string): Promise<any> => {
  const csrfToken = await getCsrfToken();

  const res = await axios.post(
    `${API_URL}/api/login`,
    { email, contraseña },
    {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

  if (res.data && res.data.user) {
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }

  return res;
};

  // 🔓 Cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      const csrfToken = await getCsrfToken();
      await axios.post(
        `${API_URL}/api/logout`,
        {},
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.warn('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🧠 Hook para usar el contexto en cualquier parte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
