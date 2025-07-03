// frontend/src/services/modulosService.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Revisa tu archivo .env");
}

const API = `${API_URL}/api/modulos`;

// Obtener lista de módulos
export const getModulos = () => axios.get(API, {
  withCredentials: true,
});
