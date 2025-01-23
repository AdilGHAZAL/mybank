// CreateOperation.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOperation } from "../services/api";

const CreateOperation: React.FC = () => {
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOperation({ label, amount, date, category });
      navigate("/operations"); // Redirect to the operations list after creation
    } catch (error) {
      console.error("Failed to create operation:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Operation</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields (same as before) */}
        </form>
      </div>
    </div>
  );
};

export default CreateOperation;