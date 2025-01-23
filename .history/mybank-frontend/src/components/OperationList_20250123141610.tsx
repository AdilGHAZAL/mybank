import React from "react";

interface Operation {
  id: number;
  label: string;
  amount: number;
  date: string;
  category: string;
}

interface OperationListProps {
  operations: Operation[];
  onDelete: (id: number) => void;
}

const OperationList: React.FC<OperationListProps> = ({ operations, onDelete }) => {
  return (
    <div>
      <h2>Operations</h2>
      <ul>
        {operations.map((operation) => (
          <li key={operation.id}>
            <span>{operation.label}</span> - <span>{operation.amount}€</span> -{" "}
            <span>{operation.date}</span> - <span>{operation.category}</span>
            <button onClick={() => onDelete(operation.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OperationList;