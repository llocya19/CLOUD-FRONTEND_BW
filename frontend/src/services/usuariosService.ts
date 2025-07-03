// frontend/src/services/usuariosService.ts
import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

const API = `${API_URL}/api/usuarios`;
const API_ROLES = `${API_URL}/api/roles`;

// 🔵 Obtener todos los usuarios
export const getUsuarios = () => axios.get(API, {
  withCredentials: true,
});

// 🟢 Crear usuario
export const createUsuario = async (data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.post(API, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// 🟡 Actualizar usuario
export const updateUsuario = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.put(`${API}/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// 🔴 Eliminar usuario
export const deleteUsuario = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// 🎯 Obtener todos los roles
export const getTodosRoles = () => axios.get(API_ROLES, {
  withCredentials: true,
});

// 🎯 Obtener roles asignados a un usuario
export const getRolesPorUsuario = (id: number) =>
  axios.get(`${API}/${id}/roles`, {
    withCredentials: true,
  });
