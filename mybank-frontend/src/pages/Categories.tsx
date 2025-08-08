import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory, Category } from '../services/api';
import MainLayout from '../components/templates/MainLayout';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;

    setSubmitting(true);
    try {
      await createCategory({ title: newCategoryTitle.trim() });
      setNewCategoryTitle('');
      setShowAddForm(false);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. It might have associated operations.');
    }
  };

  if (loading) {
    return (
      <MainLayout title="Categories" subtitle="Organize your expenses">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading categories...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Categories" subtitle="Organize your expenses">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} available
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + Add Category
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <div className="flex-1">
              <FormField
                label=""
                type="text"
                value={newCategoryTitle}
                onChange={(value) => setNewCategoryTitle(value)}
                placeholder="Category name (e.g., Food, Transportation, Entertainment)"
                required
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategoryTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Category ID: {category.id}
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => category.id && handleDeleteCategory(category.id, category.title)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-6">Create your first category to organize your expenses.</p>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            Add Your First Category
          </Button>
        </Card>
      )}
    </MainLayout>
  );
};

export default Categories;
