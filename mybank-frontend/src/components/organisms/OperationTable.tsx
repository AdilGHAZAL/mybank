import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Operation, deleteOperation } from '../../services/api';
import Button from '../atoms/Button';
import Card from '../molecules/Card';

interface OperationTableProps {
  operations: Operation[];
  onOperationDeleted: (id: number) => void;
}

const OperationTable: React.FC<OperationTableProps> = ({ operations, onOperationDeleted }) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this operation?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteOperation(id);
      onOperationDeleted(id);
    } catch (error) {
      console.error('Failed to delete operation:', error);
      alert('Failed to delete operation. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (operations.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">💳</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No operations yet</h3>
        <p className="text-gray-600 mb-6">Start tracking your expenses by adding your first operation.</p>
        <Link to="/create-operation">
          <Button variant="primary">Add Your First Operation</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {operations.map((operation) => (
              <tr key={operation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {operation.label}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatAmount(operation.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {operation.category?.title || 'No Category'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(operation.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link to={`/edit-operation/${operation.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(operation.id)}
                      disabled={deletingId === operation.id}
                    >
                      {deletingId === operation.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OperationTable;
