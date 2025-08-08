import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOperations, Operation } from '../services/api';
import MainLayout from '../components/templates/MainLayout';
import OperationTable from '../components/organisms/OperationTable';
import Button from '../components/atoms/Button';

const Operations: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      setLoading(true);
      const data = await getOperations();
      setOperations(data);
    } catch (error) {
      console.error('Failed to fetch operations:', error);
      setError('Failed to load operations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOperationDeleted = (deletedId: number) => {
    setOperations(prev => prev.filter(op => op.id !== deletedId));
  };

  if (loading) {
    return (
      <MainLayout title="Operations" subtitle="Manage your expenses">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading operations...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Operations" subtitle="Manage your expenses">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={fetchOperations}>Try Again</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Operations" subtitle="Manage your expenses">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            {operations.length} operation{operations.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link to="/create-operation">
          <Button variant="primary">+ Add New Operation</Button>
        </Link>
      </div>

      <OperationTable 
        operations={operations} 
        onOperationDeleted={handleOperationDeleted}
      />
    </MainLayout>
  );
};

export default Operations;
