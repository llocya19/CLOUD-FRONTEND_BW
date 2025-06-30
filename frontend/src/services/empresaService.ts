// frontend/src/services/empresaService.ts
import axios from 'axios';
import { getCsrfToken } from './csrfService'; // ✅ Asegúrate de tener esto

const API = '/api/empresa';

const empresaService = {
  obtener: () => axios.get(API),

  guardar: async (formData: FormData) => {
    const csrfToken = await getCsrfToken();
    return axios.put(API, formData, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
  }
};

export default empresaService;
