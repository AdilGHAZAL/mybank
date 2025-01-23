import React, { useState, useEffect } from "react";
import axios from "axios";

// Type pour les opérations
type Operation = {
  id: number;
  description: string;
  amount: number;
};

const MainPage: React.FC = () => {
  // État pour stocker les opérations
  const [operations, setOperations] = useState<Operation[]>([]);

  // Récupérer les opérations depuis l'API
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/operations")
      .then((response) => {
        setOperations(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des opérations :", error);
      });
  }, []);

  // Supprimer une opération
  const deleteOperation = (id: number) => {
    axios
      .delete(`http://localhost:8000/api/operations/${id}`)
      .then(() => {
        setOperations((prev) => prev.filter((op) => op.id !== id));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'opération :", error);
      });
  };

  // Modifier une opération
  const editOperation = (id: number, newDescription: string, newAmount: number) => {
    axios
      .put(`http://localhost:8000/api/operations/${id}`, {
        description: newDescription,
        amount: newAmount,
      })
      .then(() => {
        setOperations((prev) =>
          prev.map((op) =>
            op.id === id ? { ...op, description: newDescription, amount: newAmount } : op
          )
        );
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'opération :", error);
      });
  };

  // Vérification de la validité du montant
  const isValidAmount = (amount: string) => !isNaN(parseFloat(amount)) && parseFloat(amount) >= 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Opérations</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Montant</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation) => (
            <tr key={operation.id}>
              <td className="border border-gray-300 p-2 text-center">{operation.id}</td>
              <td className="border border-gray-300 p-2">{operation.description}</td>
              <td className="border border-gray-300 p-2 text-right">{operation.amount}€</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => {
                    const newDescription = prompt("Nouvelle description :", operation.description);
                    const newAmountStr = prompt("Nouveau montant :", operation.amount.toString());
                    if (newDescription && newAmountStr && isValidAmount(newAmountStr)) {
                      const newAmount = parseFloat(newAmountStr);
                      editOperation(operation.id, newDescription, newAmount);
                    } else {
                      alert("Montant invalide !");
                    }
                  }}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteOperation(operation.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainPage;
