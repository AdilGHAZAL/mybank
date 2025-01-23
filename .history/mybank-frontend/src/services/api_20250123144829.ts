// src/services/api.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with your Symfony backend URL

// Fetch all operations
export const getOperations = async () => {
  const response = await axios.get(`${API_URL}/operations`);
  return response.data;
};

// Fetch a single operation by ID
export const getOperationById = async (id: number) => {
  const response = await axios.get(`${API_URL}/operations/${id}`);
  return response.data;
};

// Create a new operation
export const createOperation = async (operation: {
  description: string;
  amount: number;
  date: string;
}) => {
  const response = await axios.post(`${API_URL}/operations`, operation);
  return response.data;
};

// Update an operation
export const updateOperation = async (
  id: number,
  operation: {
    description: string;
    amount: number;
    date: string;
  }
) => {
  const response = await axios.put(`${API_URL}/operations/${id}`, operation);
  return response.data;
};

// Delete an operation
export const deleteOperation = async (id: number) => {
  const response = await axios.delete(`${API_URL}/operations/${id}`);
  return response.data;
};