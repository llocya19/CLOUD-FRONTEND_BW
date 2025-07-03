// frontend/src/services/rolesService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

const API = `${API_URL}/api/roles`;

// 🔵 Obtener todos los roles
export const getRoles = async () => {
  return await axios.get(API, {
    withCredentials: true,
  });
};

// 🟢 Crear nuevo rol (POST)
export const createRole = async (data: any) => {
  const csrfToken = await getCsrfToken();
  return await axios.post(API, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// 🟡 Actualizar rol (PUT)
export const updateRole = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return await axios.put(`${API}/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// 🔴 Eliminar rol (DELETE)
export const deleteRole = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return await axios.delete(`${API}/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};
