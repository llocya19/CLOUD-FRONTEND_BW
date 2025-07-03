// hooks/useInactividad.ts
import { useEffect } from 'react';
import axios from 'axios';
import { getCsrfToken } from '../services/csrfService';

const API = import.meta.env.VITE_API_URL;

const useInactividad = (onLogout: () => void, tiempoLimite = 2 * 60 * 1000) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const cerrarSesion = async () => {
      try {
        const csrfToken = await getCsrfToken();
        await axios.post(`${API}/api/logout`, {}, {
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error al cerrar sesión automáticamente:", error);
      } finally {
        onLogout(); // ⚠️ Ejecuta la lógica local (borrar token, redirigir, etc.)
      }
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(cerrarSesion, tiempoLimite);
    };

    const eventos = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    eventos.forEach((evento) => window.addEventListener(evento, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      eventos.forEach((evento) => window.removeEventListener(evento, resetTimer));
    };
  }, [onLogout, tiempoLimite]);
};

export default useInactividad;
