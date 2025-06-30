// frontend/src/services/marcasService.ts
import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API = '/api/marcas';

// GET: Listar marcas
export const getMarcas = () => axios.get(API);

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
