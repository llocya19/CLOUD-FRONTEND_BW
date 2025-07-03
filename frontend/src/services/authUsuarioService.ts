import axios from 'axios';

// Usa la variable de entorno para obtener la URL del backend
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

// ✅ Obtener usuario por ID
export const obtenerUsuarioPorId = async (id: number) => {
  return await axios.get(`${API_URL}/api/usuarios/${id}`, {
    withCredentials: true, // importante si usas sesiones o cookies
  });
};
