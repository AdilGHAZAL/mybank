// DEPRECATED: Use pages/CreateOperation.tsx + organisms/OperationForm.tsx instead
// CreateOperationLegacy.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOperation, getCategories, Category } from "../services/api";

const CreateOperationLegacy: React.FC = () => {
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id); // Set first category as default
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await createOperation({ 
        label, 
        amount, 
        date, 
        category: categoryId 
      });
      navigate("/operations");
    } catch (error) {
      console.error("Failed to create operation:", error);
      setError("Failed to create operation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Operation</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Operation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOperationLegacy;