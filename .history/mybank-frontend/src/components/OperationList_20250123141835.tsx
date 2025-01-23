// OperationList.tsx
import React from "react";

interface Operation {
  id: number;
  label: string;
  amount: number;
  date: string;
  category: string;
}

const OperationList: React.FC = () => {
  const mockOperations: Operation[] = [
    { id: 1, label: "Groceries", amount: 50, date: "2023-10-01", category: "Food" },
    { id: 2, label: "Rent", amount: 1000, date: "2023-10-05", category: "Housing" },
  ];

  return (
    <div>
      <h2>Operations</h2>
      <ul>
        {mockOperations.map((operation) => (
          <li key={operation.id}>
            <span>{operation.label}</span> - <span>{operation.amount}€</span> -{" "}
            <span>{operation.date}</span> - <span>{operation.category}</span>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperationList;