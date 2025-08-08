import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOperation, updateOperation, getCategories, Category, Operation } from '../../services/api';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import Card from '../molecules/Card';

interface OperationFormProps {
  operation?: Operation;
  isEditing?: boolean;
}

const OperationForm: React.FC<OperationFormProps> = ({ operation, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    label: operation?.label || '',
    amount: operation?.amount || 0,
    date: operation?.date ? new Date(operation.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    categoryId: operation?.category?.id || 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // Ensure data is an array
        const categoriesArray = Array.isArray(data) ? data : [];
        setCategories(categoriesArray);
        if (!isEditing && categoriesArray.length > 0 && !formData.categoryId && categoriesArray[0].id) {
          setFormData(prev => ({ ...prev, categoryId: categoriesArray[0].id! }));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]); // Always ensure categories is an array
        
        // Handle authentication errors
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          if (axiosError.response?.status === 401) {
            console.warn('Authentication required for categories. User may need to log in.');
            // The axios interceptor will handle the redirect to login
          }
        }
      }
    };

    fetchCategories();
  }, [isEditing, formData.categoryId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.label.trim()) {
      newErrors.label = 'Label is required';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const operationData = {
        label: formData.label,
        amount: Number(formData.amount),
        date: formData.date,
        category: Number(formData.categoryId),
      };
      
      console.log('OperationForm Debug - Sending data:', operationData);
      console.log('OperationForm Debug - Form data:', formData);
      
      if (isEditing && operation && operation.id) {
        await updateOperation(operation.id, operationData);
      } else {
        console.log('OperationForm Debug - Calling createOperation');
        await createOperation(operationData);
      }
      
      navigate('/operations');
    } catch (error) {
      console.error('Failed to save operation:', error);
      setErrors({ submit: 'Failed to save operation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions = Array.isArray(categories) 
    ? categories
        .filter(category => category.id !== undefined)
        .map(category => ({
          value: category.id!,
          label: category.title,
        }))
    : [];

  // Debug logging to see what's happening with categories
  console.log('OperationForm Debug:');
  console.log('- categories:', categories);
  console.log('- categories.length:', categories.length);
  console.log('- categoryOptions:', categoryOptions);
  console.log('- categoryOptions.length:', categoryOptions.length);

  return (
    <Card className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Operation' : 'Add New Operation'}
        </h2>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update your expense details' : 'Track your new expense'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Description"
          type="text"
          value={formData.label}
          onChange={handleInputChange('label')}
          placeholder="e.g., Grocery shopping, Gas, Restaurant..."
          required
          error={errors.label}
        />

        <FormField
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={handleInputChange('amount')}
          placeholder="0.00"
          min="0.01"
          step="0.01"
          required
          error={errors.amount}
        />

        <FormField
          label="Date"
          type="date"
          value={formData.date}
          onChange={handleInputChange('date')}
          required
          error={errors.date}
        />

        <FormField
          label="Category"
          type="select"
          value={formData.categoryId}
          onChange={handleInputChange('categoryId')}
          options={categoryOptions}
          placeholder="Select a category"
          required
          error={errors.categoryId}
        />

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Operation' : 'Add Operation')}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/operations')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OperationForm;
