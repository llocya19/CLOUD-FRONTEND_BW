import axios from 'axios';

export const obtenerUsuarioPorId = async (id: number) => {
  return await axios.get(`/api/usuarios/${id}`);
};
