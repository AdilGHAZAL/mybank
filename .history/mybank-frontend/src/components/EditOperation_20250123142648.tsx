// EditOperation.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Operation {
  id: number;
  label: string;
  amount: number;
  date: string;
  category: string;
}

const EditOperation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [operation, setOperation] = useState<Operation | null>(null);

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  // Fetch the operation data based on the ID (you'll replace this with an API call)
  useEffect(() => {
    // Mock data for now
    const mockOperations: Operation[] = [
      { id: 1, label: "Groceries", amount: 50, date: "2023-10-01", category: "Food" },
      { id: 2, label: "Rent", amount: 1000, date: "2023-10-05", category: "Housing" },
    ];

    const selectedOperation = mockOperations.find((op) => op.id === parseInt(id!));
    if (selectedOperation) {
      setOperation(selectedOperation);
      setLabel(selectedOperation.label);
      setAmount(selectedOperation.amount);
      setDate(selectedOperation.date);
      setCategory(selectedOperation.category);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your logic to update the operation here
    console.log("Updated operation:", { id, label, amount, date, category });
    navigate("/operations"); // Redirect to the operations list after editing
  };

  if (!operation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Operation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Label:
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount:
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category:
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Operation
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOperation;