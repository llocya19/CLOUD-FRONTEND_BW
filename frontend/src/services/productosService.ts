import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Obtener todos los productos
export const getProductos = () => axios.get(`${API}/api/productos`);

// Obtener productos con stock bajo (menor o igual a 5)
export const listarStockBajo = () => axios.get(`${API}/api/productos/stock-bajo`);

// Eliminar producto
export const eliminarProducto = async (id: number) => {
  const csrfToken = await getCsrfToken();
  return axios.delete(`${API}/api/productos/${id}`, {
    headers: {
      "X-CSRFToken": csrfToken
    },
    withCredentials: true
  });
};

// Enviar nuevo producto con imagen (POST)
export const guardarProductoConImagen = async (formData: FormData) => {
  const csrfToken = await getCsrfToken();
  return axios.post(`${API}/api/productos/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": csrfToken
    },
    withCredentials: true
  });
};

// Actualizar producto (PUT) con imagen o sin imagen
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

  return axios.put(`${API}/api/productos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": csrfToken
    },
    withCredentials: true
  });
};

// Verificar si un campo (nombre o código de barra) está duplicado
export const verificarDuplicado = (campo: string, valor: string) =>
  axios.get(`${API}/api/productos/duplicado?campo=${campo}&valor=${encodeURIComponent(valor)}`);

// Buscar producto por código de barras
export const buscarProductoPorCodigo = (codigo_barra: string) =>
  axios.get(`${API}/api/productos/por-codigo/${codigo_barra}`);
