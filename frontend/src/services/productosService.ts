// frontend/src/services/productosService.ts

import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

const API = `${API_URL}/api/productos`;

// 🟢 Obtener todos los productos
export const getProductos = () => axios.get(API, {
  withCredentials: true,
});

// 🟡 Obtener productos con stock bajo (≤ 5)
export const listarStockBajo = () => axios.get(`${API}/stock-bajo`, {
  withCredentials: true,
});

// 🔴 Eliminar producto por ID
export const eliminarProducto = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/${id}`, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};

// 🟢 Guardar nuevo producto con imagen (POST multipart)
export const guardarProductoConImagen = async (formData: FormData) => {
  const csrfToken = await getCsrfToken();
  return axios.post(`${API}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": csrfToken,
    },
    withCredentials: true,
  });
};

// 🟡 Actualizar producto (PUT multipart)
export const actualizarProducto = async (id: number, data: any) => {
  const csrfToken = await getCsrfToken();
  const formData = new FormData();

  for (const key in data) {
    if (key === 'imagen' && data.imagen instanceof File) {
      formData.append('imagen', data.imagen);
    } else {
      formData.append(key, data[key]);
    }
  }

  return axios.put(`${API}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": csrfToken,
    },
    withCredentials: true,
  });
};

// 🔎 Verificar si el campo nombre o código de barra está duplicado
export const verificarDuplicado = (campo: string, valor: string) =>
  axios.get(`${API}/duplicado?campo=${campo}&valor=${encodeURIComponent(valor)}`, {
    withCredentials: true,
  });

// 🔍 Buscar producto por código de barras
export const buscarProductoPorCodigo = (codigo_barra: string) =>
  axios.get(`${API}/por-codigo/${codigo_barra}`, {
    withCredentials: true,
  });
