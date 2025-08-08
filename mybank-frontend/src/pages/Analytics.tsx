import React, { useState, useEffect } from 'react';
import { getOperations, getCategories, Operation, Category } from '../services/api';
import MainLayout from '../components/templates/MainLayout';
import StatCard from '../components/molecules/StatCard';
import Card from '../components/molecules/Card';

const Analytics: React.FC = () => {
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
        setOperations(operationsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout title="Analytics" subtitle="Analyze your spending patterns">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
      </MainLayout>
    );
  }

  // Calculate analytics
  const totalExpenses = operations.reduce((sum, op) => sum + op.amount, 0);
  const avgPerOperation = operations.length > 0 ? totalExpenses / operations.length : 0;

  // Monthly breakdown
  const monthlyData = operations.reduce((acc, op) => {
    const date = new Date(op.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + op.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyEntries = Object.entries(monthlyData)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6);

  // Category analytics
  const categoryAnalytics = categories.map(category => {
    const categoryOps = operations.filter(op => op.category?.id === category.id);
    const total = categoryOps.reduce((sum, op) => sum + op.amount, 0);
    return {
      category: category.title,
      total,
      count: categoryOps.length,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
      avgPerOperation: categoryOps.length > 0 ? total / categoryOps.length : 0,
    };
  }).filter(stat => stat.total > 0).sort((a, b) => b.total - a.total);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <MainLayout title="Analytics" subtitle="Analyze your spending patterns">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<span className="text-2xl">💰</span>}
          color="blue"
        />
        <StatCard
          title="Total Operations"
          value={operations.length}
          icon={<span className="text-2xl">📊</span>}
          color="green"
        />
        <StatCard
          title="Average per Operation"
          value={formatCurrency(avgPerOperation)}
          icon={<span className="text-2xl">📈</span>}
          color="purple"
        />
        <StatCard
          title="Active Categories"
          value={categoryAnalytics.length}
          icon={<span className="text-2xl">📁</span>}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Spending */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
          {monthlyEntries.length > 0 ? (
            <div className="space-y-4">
              {monthlyEntries.map(([month, amount]) => {
                const maxAmount = Math.max(...monthlyEntries.map(([, amt]) => amt));
                const percentage = (amount / maxAmount) * 100;
                
                return (
                  <div key={month}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {formatMonth(month)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </Card>

        {/* Category Analytics */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          {categoryAnalytics.length > 0 ? (
            <div className="space-y-4">
              {categoryAnalytics.map((stat) => (
                <div key={stat.category} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{stat.category}</span>
                    <span className="text-sm text-gray-600">{stat.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{stat.count} operations</span>
                    <span>{formatCurrency(stat.total)} total</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Avg: {formatCurrency(stat.avgPerOperation)} per operation
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No category data available</p>
          )}
        </Card>
      </div>

      {/* Spending Insights */}
      <Card className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-medium text-gray-900">Top Category</h4>
            <p className="text-sm text-gray-600">
              {categoryAnalytics[0]?.category || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {categoryAnalytics[0] ? formatCurrency(categoryAnalytics[0].total) : '$0'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">📅</div>
            <h4 className="font-medium text-gray-900">This Month</h4>
            <p className="text-sm text-gray-600">
              {monthlyEntries[0] ? formatMonth(monthlyEntries[0][0]) : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {monthlyEntries[0] ? formatCurrency(monthlyEntries[0][1]) : '$0'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="font-medium text-gray-900">Most Frequent</h4>
            <p className="text-sm text-gray-600">
              {categoryAnalytics.sort((a, b) => b.count - a.count)[0]?.category || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {categoryAnalytics.sort((a, b) => b.count - a.count)[0]?.count || 0} operations
            </p>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

export default Analytics;
