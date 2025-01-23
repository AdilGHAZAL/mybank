import axios from "axios";

// URL de l'API Backend
const API_URL = "http://localhost:8000/api"; // Change cette URL si nécessaire

// Fonction pour se connecter (exemple de login)
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Fonction pour récupérer toutes les opérations
export const getOperations = async () => {
  try {
    const response = await axios.get(`${API_URL}/operations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching operations:", error);
    throw error;
  }
};

// Fonction pour créer une opération
export const createOperation = async (operation: { description: string; amount: number; date: string; category: string }) => {
  try {
    const response = await axios.post(`${API_URL}/operations`, operation);
    return response.data;
  } catch (error) {
    console.error("Error creating operation:", error);
    throw error;
  }
};

// Fonction pour modifier une opération
export const updateOperation = async (id: number, operation: { description: string; amount: number; date: string; category: string }) => {
  try {
    const response = await axios.put(`${API_URL}/operations/${id}`, operation);
    return response.data;
  } catch (error) {
    console.error("Error updating operation:", error);
    throw error;
  }
};

// Fonction pour supprimer une opération
export const deleteOperation = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/operations/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting operation:", error);
    throw error;
  }
};
