// src/api.js

import axios from "axios";

const API_URL = "http://localhost:8000/api/operations";

export const getOperations = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createOperation = async (operation) => {
  const response = await axios.post(API_URL, operation);
  return response.data;
};

export const updateOperation = async (id, updatedOperation) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedOperation);
  return response.data;
};

export const deleteOperation = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
