import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOperationById, Operation } from '../services/api';
import MainLayout from '../components/templates/MainLayout';
import OperationForm from '../components/organisms/OperationForm';

const EditOperation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOperation = async () => {
      if (!id) {
        setError('Operation ID is required');
        setLoading(false);
        return;
      }

      try {
        const data = await getOperationById(parseInt(id));
        setOperation(data);
      } catch (error) {
        console.error('Failed to fetch operation:', error);
        setError('Failed to load operation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOperation();
  }, [id]);

  if (loading) {
    return (
      <MainLayout title="Edit Operation" subtitle="Update expense details">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading operation...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !operation) {
    return (
      <MainLayout title="Edit Operation" subtitle="Update expense details">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error || 'Operation not found'}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Operation" subtitle="Update expense details">
      <div className="max-w-2xl mx-auto">
        <OperationForm operation={operation} isEditing={true} />
      </div>
    </MainLayout>
  );
};

export default EditOperation;
