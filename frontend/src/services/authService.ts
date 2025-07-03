// frontend/src/services/authService.ts
import axios from 'axios';
import { getCsrfToken } from './csrfService';

// Obtiene la URL del backend desde .env
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

// 🔐 LOGIN - Método faltante (¡Este es el clave para tu error actual!)
export const login = async (email: string, contraseña: string) => {
  const csrfToken = await getCsrfToken();

  return axios.post(
    `${API_URL}/api/login`,
    { email, contraseña },
    {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
      withCredentials: true, // ⚠️ Importante para sesiones/cookies
    }
  );
};

// 🔐 Verifica el código OTP
export const verificarOtp = async (user_id: number, otp: string) => {
  const csrfToken = await getCsrfToken();

  return axios.post(
    `${API_URL}/api/verificar-otp`,
    { user_id, otp },
    {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );
};

// 🔓 Cierra sesión
export const logout = async () => {
  const csrfToken = await getCsrfToken();

  return axios.post(
    `${API_URL}/api/logout`,
    {},
    {
      headers: {
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,
    }
  );
};
