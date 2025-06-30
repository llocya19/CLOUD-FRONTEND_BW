import { useEffect } from 'react';

const useInactividad = (onLogout: () => void, tiempoLimite = 2* 60 * 1000) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        onLogout();
      }, tiempoLimite);
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
