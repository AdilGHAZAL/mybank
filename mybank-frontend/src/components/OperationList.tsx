// OperationList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOperations, deleteOperation } from "../services/api";

interface Operation {
  id: number;
  label: string;
  amount: number;
  date: string;
  category: string;
}

const OperationList: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);

  // Fetch operations from the backend
  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const data = await getOperations();
        setOperations(data);
      } catch (error) {
        console.error("Failed to fetch operations:", error);
      }
    };
    fetchOperations();
  }, []);

  // Handle deletion
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this operation?")) {
      try {
        await deleteOperation(id);
        setOperations(operations.filter((op) => op.id !== id));
      } catch (error) {
        console.error("Failed to delete operation:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Operations</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {operations.map((operation) => (
              <tr key={operation.id}>
                <td className="px-6 py-4 whitespace-nowrap">{operation.label}</td>
                <td className="px-6 py-4 whitespace-nowrap">{operation.amount}€</td>
                <td className="px-6 py-4 whitespace-nowrap">{operation.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{operation.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/edit-operation/${operation.id}`}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(operation.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationList;