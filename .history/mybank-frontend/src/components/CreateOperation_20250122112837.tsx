import React, { useState } from 'react';
import api from '../api';

const CreateOperation: React.FC = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/operations',
        { description, amount, date, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Operation created');
    } catch (error) {
      console.error('Error creating operation', error);
      alert('Failed to create operation');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <button type="submit">Create Operation</button>
    </form>
  );
};

export default CreateOperation;
