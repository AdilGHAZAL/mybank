import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOperations, getCategories, Operation, Category } from '../services/api';
import MainLayout from '../components/templates/MainLayout';
import StatCard from '../components/molecules/StatCard';
import Card from '../components/molecules/Card';
import Button from '../components/atoms/Button';

const Dashboard: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operationsData, categoriesData] = await Promise.all([
          getOperations(),
          getCategories(),
        ]);
        
      
        const safeOperations = Array.isArray(operationsData) ? operationsData : [];
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];
        
        setOperations(safeOperations);
        setCategories(safeCategories);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Set empty arrays on error to prevent crashes
        setOperations([]);
        setCategories([]);
        
        // Handle authentication errors
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          if (axiosError.response?.status === 401) {
            console.warn('Authentication required for dashboard data. User may need to log in.!');
            // The axios interceptor will handle the redirect to login
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalExpenses = operations.reduce((sum, op) => sum + op.amount, 0);
  const thisMonthOperations = operations.filter(op => {
    const opDate = new Date(op.date);
    const now = new Date();
    return opDate.getMonth() === now.getMonth() && opDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthOperations.reduce((sum, op) => sum + op.amount, 0);
  const avgPerOperation = operations.length > 0 ? totalExpenses / operations.length : 0;

  // Recent operations (last 5)
  const recentOperations = operations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Category breakdown
  const categoryStats = categories.map(category => {
    const categoryOperations = operations.filter(op => op.category?.id === category.id);
    const total = categoryOperations.reduce((sum, op) => sum + op.amount, 0);
    return {
      category: category.title,
      total,
      count: categoryOperations.length,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    };
  }).filter(stat => stat.total > 0).sort((a, b) => b.total - a.total);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <MainLayout title="Dashboard" subtitle="Overview of your expenses">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Dashboard" subtitle="Overview of your expenses">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<span className="text-2xl">💰</span>}
          color="blue"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(thisMonthTotal)}
          icon={<span className="text-2xl">📅</span>}
          color="green"
        />
        <StatCard
          title="Total Operations"
          value={operations.length}
          icon={<span className="text-2xl">📊</span>}
          color="purple"
        />
        <StatCard
          title="Average per Operation"
          value={formatCurrency(avgPerOperation)}
          icon={<span className="text-2xl">📈</span>}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Operations */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Operations</h3>
            <Link to="/operations">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>
          
          {recentOperations.length > 0 ? (
            <div className="space-y-3">
              {recentOperations.map((operation) => (
                <div key={operation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{operation.label}</p>
                    <p className="text-sm text-gray-600">
                      {operation.category?.title} • {new Date(operation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(operation.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No operations yet</p>
              <Link to="/create-operation">
                <Button variant="primary" size="sm">Add Your First Operation</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Category Breakdown */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
            <Link to="/categories">
              <Button variant="secondary" size="sm">Manage</Button>
            </Link>
          </div>
          
          {categoryStats.length > 0 ? (
            <div className="space-y-3">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{stat.category}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(stat.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{stat.count} operations</span>
                      <span className="text-xs text-gray-500">{stat.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No category data available</p>
              <Link to="/create-operation">
                <Button variant="primary" size="sm">Add Operations</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/create-operation" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">➕</div>
              <h4 className="font-medium text-gray-900">Add Operation</h4>
              <p className="text-sm text-gray-600">Record a new expense</p>
            </div>
          </Link>
          
          <Link to="/operations" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-medium text-gray-900">View All Operations</h4>
              <p className="text-sm text-gray-600">Browse your expense history</p>
            </div>
          </Link>
          
          <Link to="/categories" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">📁</div>
              <h4 className="font-medium text-gray-900">Manage Categories</h4>
              <p className="text-sm text-gray-600">Organize your expenses</p>
            </div>
          </Link>
          
          <Link to="/analytics" className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-600">Analyze spending patterns</p>
            </div>
          </Link>
        </div>
      </Card>
    </MainLayout>
  );
};

export default Dashboard;
