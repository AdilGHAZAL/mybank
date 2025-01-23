// CreateOperation.tsx
import React, { useState } from "react";
import { createOperation } from "/api"; // Assurez-vous d'importer la fonction API

const CreateOperation: React.FC = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState("");

  const handleCreate = async () => {
    const newOperation = { description, amount, category, date: new Date().toISOString() };
    await createOperation(newOperation); // Créer l'opération via l'API
    alert("Opération créée !");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Create Operation</h2>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 mb-2"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Montant"
        className="border p-2 mb-2"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="border p-2 mb-4"
      />
      <button onClick={handleCreate} className="bg-green-500 text-white p-2">
        Create Operation
      </button>
    </div>
  );
};

export default CreateOperation;
