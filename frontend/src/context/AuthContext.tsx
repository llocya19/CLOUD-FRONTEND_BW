import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { getCsrfToken } from '../services/csrfService'; // ajusta según tu estructura
// ✅ servicio para obtener token CSRF

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  estado: string;
  foto: string;
  rol: string;
  modulos: any[];
}

interface AuthContextType {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  login: (email: string, contraseña: string) => Promise<any>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error al parsear el usuario almacenado:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // ✅ Login con CSRF token
  const login = async (email: string, contraseña: string) => {
    try {
      const csrfToken = await getCsrfToken(); // 🔐 Obtener token CSRF
      const res = await axios.post(
        '/api/login',
        { email, contraseña },
        {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true
        }
      );
      return res;
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
