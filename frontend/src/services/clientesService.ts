// frontend/src/services/clientesService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService'; // ✅ Importar token CSRF

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Obtener todos los clientes
export const getClientes = () => axios.get(`${API}/api/clientes`);

// Verificar duplicado por email o dni
export const verificarDuplicado = (campo: string, valor: string) =>
  axios.get(`${API}/api/clientes/duplicado?campo=${campo}&valor=${encodeURIComponent(valor)}`);

// Eliminar cliente por ID (DELETE)
export const eliminarCliente = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/api/clientes/${id}`, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Guardar lote de clientes (POST)
export const guardarClienteLote = async (clientes: any[]) => {
  const csrfToken = await getCsrfToken();
  return axios.post(`${API}/api/clientes/guardar`, clientes, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};

// Editar cliente (PUT)
export const actualizarCliente = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.put(`${API}/api/clientes/${id}`, data, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });
};
