// api.ts
import axios from "axios";

const apiUrl = "http://localhost:8000/api"; // L'URL de ton backend Symfony

// Récupérer toutes les opérations
export const getOperations = async () => {
  const response = await axios.get(`${apiUrl}/operations`);
  return response.data;
};

// Créer une nouvelle opération
export const createOperation = async (operation: any) => {
  const token = localStorage.getItem("token"); // Récupérer le token de l'utilisateur connecté
  const response = await axios.post(
    `${apiUrl}/operations`,
    operation,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Ajouter le token dans les headers pour l'authentification
      },
    }
  );
  return response.data;
};

// Supprimer une opération
export const deleteOperation = async (id: number) => {
  const token = localStorage.getItem("token"); // Récupérer le token de l'utilisateur connecté
  await axios.delete(`${apiUrl}/operations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Ajouter le token dans les headers
    },
  });
};
