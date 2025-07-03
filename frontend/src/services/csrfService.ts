// src/services/csrfService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("⚠️ VITE_API_URL no está definido. Verifica tu archivo .env");
}

export const getCsrfToken = async (): Promise<string> => {
  const response = await axios.get(`${API_URL}/api/csrf-token`, {
    withCredentials: true,
  });
  return response.data.csrf_token;
};
