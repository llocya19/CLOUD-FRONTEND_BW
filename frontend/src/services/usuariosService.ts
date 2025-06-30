// frontend/src/services/usuariosService.ts
import axios from 'axios';
import { getCsrfToken } from './csrfService'; // Asegúrate de tener este servicio

const API = '/api/usuarios';

// Obtener todos los usuarios
export const getUsuarios = () => axios.get(API);

// Crear usuario (con CSRF)
export const createUsuario = async (data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.post(API, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Actualizar usuario (con CSRF)
export const updateUsuario = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.put(`${API}/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Eliminar usuario (con CSRF)
export const deleteUsuario = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Obtener todos los roles
export const getTodosRoles = () => axios.get('/api/roles');

// Obtener roles asignados a un usuario
export const getRolesPorUsuario = (id: number) => axios.get(`/api/usuarios/${id}/roles`);
