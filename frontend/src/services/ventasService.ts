// frontend/src/services/ventasService.ts
import axios from 'axios';
import { getCsrfToken } from './csrfService';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

const API = `${API_URL}/api/ventas`;

// 🔍 Buscar cliente en la BD interna
const buscarCliente = (documento: string) =>
  axios.get(`${API_URL}/api/clientes/por-documento/${documento}`, {
    withCredentials: true,
  });

// 🔍 Buscar producto por código de barra
const buscarProducto = (codigoBarra: string) =>
  axios.get(`${API_URL}/api/productos/por-codigo/${codigoBarra}`, {
    withCredentials: true,
  });

// 🧾 Registrar venta (POST con CSRF)
const crearVenta = async (data: any) => {
  const csrfToken = await getCsrfToken();
  return axios.post(API, data, {
    headers: {
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};

// 📃 Listar todas las ventas
const listarVentas = () => axios.get(API, {
  withCredentials: true,
});

// 📄 Obtener detalle por ID
const obtenerDetalle = (id: number) => axios.get(`${API}/${id}`, {
  withCredentials: true,
});

// 🌐 API externa: DNI y RUC (ApisPeru)
const TOKEN = import.meta.env.VITE_API_TOKEN || 'apis-token-14856.eMnuvsjJOggtLR0EwCCzlEAl3foy4Bx8';

const buscarDNI = (dni: string) =>
  axios.get(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${TOKEN}`);

const buscarRUC = (ruc: string) =>
  axios.get(`https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${TOKEN}`);

export default {
  buscarCliente,
  buscarProducto,
  crearVenta,
  listarVentas,
  obtenerDetalle,
  buscarDNI,
  buscarRUC
};
