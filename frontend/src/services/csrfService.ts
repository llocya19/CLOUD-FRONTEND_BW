import axios from "axios";

export const getCsrfToken = async (): Promise<string> => {
  const response = await axios.get("/api/csrf-token", {
    withCredentials: true,
  });
  return response.data.csrf_token;
};
