// frontend/src/services/authService.ts
import axios from 'axios';
import { getCsrfToken } from './csrfService';

// Verifica el código OTP
export const verificarOtp = async (user_id: number, otp: string) => {
  const csrfToken = await getCsrfToken();

  return axios.post(
    '/api/verificar-otp',
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

// Cierra sesión
export const logout = async () => {
  const csrfToken = await getCsrfToken();

  return axios.post(
    '/api/logout',
    {},
    {
      headers: {
        'X-CSRFToken': csrfToken,
      },
      withCredentials: true,
    }
  );
};
