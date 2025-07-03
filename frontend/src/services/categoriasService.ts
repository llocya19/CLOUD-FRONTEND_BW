// frontend/src/services/categoriasService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

const API = `${API_URL}/api/categorias`;

// Obtener todas las categorías
export const getCategorias = () => axios.get(API, {
  withCredentials: true,
});

// Crear nueva categoría (con CSRF)
export const createCategoria = async (data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.post(API, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Actualizar categoría (con CSRF)
export const updateCategoria = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.put(`${API}/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Eliminar categoría (con CSRF)
export const deleteCategoria = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};
