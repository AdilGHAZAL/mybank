// api.ts
import axios from "axios";

const apiUrl = "http://localhost:8000/api";

export const getOperations = async () => {
  const response = await axios.get(`${apiUrl}/operations`);
  return response.data;
};

export const createOperation = async (operation: any) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${apiUrl}/operations`,
    operation,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteOperation = async (id: number) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${apiUrl}/operations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const loginUser = async (credentials: any) => {
  const response = await axios.post(`${apiUrl}/login_check`, credentials);
  return response.data;
};
