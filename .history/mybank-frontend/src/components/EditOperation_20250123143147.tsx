// EditOperation.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOperationById, updateOperation } from "../services/api";

const EditOperation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  // Fetch operation data
  useEffect(() => {
    const fetchOperation = async () => {
      try {
        const operation = await getOperationById(parseInt(id!));
        setLabel(operation.label);
        setAmount(operation.amount);
        setDate(operation.date);
        setCategory(operation.category);
      } catch (error) {
        console.error("Failed to fetch operation:", error);
      }
    };
    fetchOperation();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateOperation(parseInt(id!), { label, amount, date, category });
      navigate("/operations"); // Redirect to the operations list after update
    } catch (error) {
      console.error("Failed to update operation:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Operation</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields (same as before) */}
        </form>
      </div>
    </div>
  );
};

export default EditOperation;