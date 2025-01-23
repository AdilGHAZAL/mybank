// CreateOperation.tsx
import React, { useState } from "react";

const CreateOperation: React.FC = () => {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your logic to save the operation here
    console.log("New operation:", { label, amount, date, category });
    setLabel("");
    setAmount(0);
    setDate("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Label:</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Operation</button>
    </form>
  );
};

export default CreateOperation;