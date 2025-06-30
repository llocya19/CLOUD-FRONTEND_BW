// frontend/src/services/categoriasService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService'; // asegúrate que este servicio exista

const API = '/api/categorias';

// Obtener todas las categorías
export const getCategorias = () => axios.get(API);

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
