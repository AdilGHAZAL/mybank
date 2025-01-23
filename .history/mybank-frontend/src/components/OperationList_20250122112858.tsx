import React, { useState, useEffect } from 'react';
import api from '../api';

interface Operation {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const OperationList: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const response = await api.get('/operations');
        setOperations(response.data);
      } catch (error) {
        console.error('Error fetching operations:', error);
      }
    };

    fetchOperations();
  }, []);

  return (
    <div>
      <h3>Operations List</h3>
      <ul>
        {operations.map((operation) => (
          <li key={operation.id}>
            {operation.description} - {operation.amount}€ - {operation.date} - {operation.category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperationList;
