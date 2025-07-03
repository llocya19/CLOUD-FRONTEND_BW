// frontend/src/services/empresaService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService';

// Validación de entorno
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

// Ruta base completa
const API = `${API_URL}/api/empresa`;

const empresaService = {
  // Obtener información de la empresa
  obtener: () =>
    axios.get(API, {
      withCredentials: true, // ✅ Necesario si usas sesiones o cookies
    }),

  // Guardar información de empresa (con imagen u otro archivo)
  guardar: async (formData: FormData) => {
    const csrfToken = await getCsrfToken();
    return axios.put(API, formData, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // ✅ Mantiene sesión en backend
    });
  },
};

export default empresaService;
