import React, { useState, useEffect } from "react";
import axios from "axios";

type Operation = {
  id: number;
  description: string;
  amount: number;
  date: string;
};

const MainPage: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fonction pour récupérer les opérations depuis l'API
  const fetchOperations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/operations");
      setOperations(response.data);  // On utilise directement les données retournées par l'API
    } catch (err) {
      setError("Impossible de récupérer les données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, []);  // Le tableau vide [] signifie que l'effet ne se déclenche qu'une fois

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Opérations</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Montant</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {operations.map((operation) => (
              <tr key={operation.id}>
                <td className="border border-gray-300 p-2 text-center">{operation.id}</td>
                <td className="border border-gray-300 p-2">{operation.description}</td>
                <td className="border border-gray-300 p-2 text-right">{operation.amount}€</td>
                <td className="border border-gray-300 p-2">{operation.date}</td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                    onClick={() => alert("Modifier opération")}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => alert("Supprimer opération")}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MainPage;
