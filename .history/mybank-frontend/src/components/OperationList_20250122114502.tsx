// OperationList.tsx
import React, { useState, useEffect } from "react";
import { getOperations, deleteOperation } from "./api"; // API pour récupérer et supprimer les opérations

const OperationList: React.FC = () => {
  const [operations, setOperations] = useState([]);

  useEffect(() => {
    const fetchOperations = async () => {
      const data = await getOperations();
      setOperations(data.member);
    };
    fetchOperations();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteOperation(id);
    setOperations(operations.filter((op: any) => op.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Operations List</h2>
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
          {operations.map((operation: any) => (
            <tr key={operation.id}>
              <td className="border border-gray-300 p-2">{operation.id}</td>
              <td className="border border-gray-300 p-2">{operation.description}</td>
              <td className="border border-gray-300 p-2">{operation.amount}€</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleDelete(operation.id)}
                  className="bg-red-500 text-white px-4 py-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperationList;
