// frontend/src/services/rolesService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API = '/api/roles';

// Obtener todos los roles (no requiere CSRF)
export const getRoles = async () => {
  return await axios.get(API);
};

// Crear un nuevo rol (requiere CSRF)
export const createRole = async (data: any) => {
  const csrfToken = await getCsrfToken();
  return await axios.post(API, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Actualizar un rol existente (requiere CSRF)
export const updateRole = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return await axios.put(`${API}/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Eliminar un rol (requiere CSRF)
export const deleteRole = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return await axios.delete(`${API}/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};
