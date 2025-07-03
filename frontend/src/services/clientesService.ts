// frontend/src/services/clientesService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

const API = `${API_URL}/api/clientes`;

// Obtener todos los clientes
export const getClientes = () => axios.get(API, { withCredentials: true });

// Verificar duplicado por email o dni
export const verificarDuplicado = (campo: string, valor: string) =>
  axios.get(`${API}/duplicado?campo=${campo}&valor=${encodeURIComponent(valor)}`, {
    withCredentials: true,
  });

// Eliminar cliente por ID (DELETE)
export const eliminarCliente = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Guardar lote de clientes (POST)
export const guardarClienteLote = async (clientes: any[]) => {
  const csrfToken = await getCsrfToken();
  return axios.post(`${API}/guardar`, clientes, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Editar cliente (PUT)
export const actualizarCliente = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.put(`${API}/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};
