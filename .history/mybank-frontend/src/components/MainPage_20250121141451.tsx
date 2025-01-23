import React, { useState } from "react";

// Type pour les opérations
type Operation = {
  id: number;
  description: string;
  amount: number;
};

const MainPage: React.FC = () => {
  // État pour stocker les opérations
  const [operations, setOperations] = useState<Operation[]>([
    { id: 1, description: "Achat 1", amount: 100 },
    { id: 2, description: "Achat 2", amount: 200 },
  ]);

  // Supprimer une opération
  const deleteOperation = (id: number) => {
    setOperations((prev) => prev.filter((op) => op.id !== id));
  };

  // Modifier une opération
  const editOperation = (id: number, newDescription: string, newAmount: number) => {
    setOperations((prev) =>
      prev.map((op) =>
        op.id === id ? { ...op, description: newDescription, amount: newAmount } : op
      )
    );
  };

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
                  onClick={() =>
                    editOperation(operation.id, prompt("Nouvelle description :", operation.description) || operation.description, 
                      parseFloat(prompt("Nouveau montant :", operation.amount.toString()) || operation.amount.toString())
                    )
                  }
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
