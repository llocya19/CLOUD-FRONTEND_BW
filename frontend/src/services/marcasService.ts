// frontend/src/services/marcasService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService';

// Validar que esté definida la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

const API = `${API_URL}/api/marcas`;

// GET: Listar marcas
export const getMarcas = () => axios.get(API, { withCredentials: true });

// POST: Crear marca
export const createMarca = async (data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.post(API, data, {
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};

// PUT: Actualizar marca
export const updateMarca = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.put(`${API}/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};

// DELETE: Eliminar marca
export const deleteMarca = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};
