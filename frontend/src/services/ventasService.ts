// frontend/src/services/ventasService.ts
import axios from 'axios';

const API = '/api/ventas';

// Consultas internas
const buscarCliente = (documento: string) =>
  axios.get(`/api/clientes/por-documento/${documento}`);

const buscarProducto = (codigoBarra: string) =>
  axios.get(`/api/productos/por-codigo/${codigoBarra}`);

const crearVenta = (data: any) => axios.post(API, data);

const listarVentas = () => axios.get(API);

const obtenerDetalle = (id: number) => axios.get(`${API}/${id}`);

// API externa: Token de ApisPeru
const TOKEN = 'apis-token-14856.eMnuvsjJOggtLR0EwCCzlEAl3foy4Bx8';

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
