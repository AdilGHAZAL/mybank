import React from 'react';
import MainLayout from '../components/templates/MainLayout';
import OperationForm from '../components/organisms/OperationForm';

const CreateOperation: React.FC = () => {
  console.log('CreateOperation page is loading!');
  
  return (
    <MainLayout title="Add New Operation" subtitle="Track a new expense">
      <div className="max-w-2xl mx-auto">
        <OperationForm />
      </div>
    </MainLayout>
  );
};

export default CreateOperation;
