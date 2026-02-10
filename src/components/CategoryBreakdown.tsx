import React from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryData {
  expenses: Array<{
    id: string;
    name: string;
    amount: number;
    level: number;
    type: 'expense';
  }>;
  income: Array<{
    id: string;
    name: string;
    amount: number;
    level: number;
    type: 'income';
  }>;
}

interface CategoryBreakdownProps {
  categories: CategoryData;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
  const totalExpenses = categories.expenses.reduce((sum, cat) => sum + cat.amount, 0);

  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      'food': 'bg-orange-500',
      'housing': 'bg-blue-500',
      'transport': 'bg-purple-500',
      'shopping': 'bg-pink-500',
      'utilities': 'bg-yellow-500',
      'healthcare': 'bg-red-500',
      'entertainment': 'bg-green-500',
      'education': 'bg-indigo-500',
      'personal': 'bg-gray-500'
    };
    return colors[categoryName.toLowerCase()] || 'bg-gray-500';
  };

  const formatPercentage = (amount: number, total: number) => {
    return ((amount / total) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
        <PieChartIcon className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {categories.expenses.slice(0, 6).map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.name)}`}></div>
                <span className="font-medium text-gray-900 capitalize">{category.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">${category.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  {formatPercentage(category.amount, totalExpenses)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getCategoryColor(category.name)}`}
                style={{ width: `${formatPercentage(category.amount, totalExpenses)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
        <p className="font-semibold text-gray-900">Total Expenses</p>
        <p className="font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="font-semibold text-gray-900">{categories.expenses.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Avg. Daily</p>
            <p className="font-semibold text-gray-900">
              ${(totalExpenses / 30).toFixed(0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Top Category</p>
            <p className="font-semibold text-gray-900 capitalize truncate">
              {categories.expenses[0]?.name || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};