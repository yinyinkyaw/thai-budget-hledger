import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, History } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  status: 'pending' | 'cleared';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const recentTransactions = transactions.slice(-10).reverse();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'food': 'bg-orange-100 text-orange-800',
      'housing': 'bg-blue-100 text-blue-800',
      'transport': 'bg-purple-100 text-purple-800',
      'shopping': 'bg-pink-100 text-pink-800',
      'utilities': 'bg-yellow-100 text-yellow-800',
      'healthcare': 'bg-red-100 text-red-800',
      'entertainment': 'bg-green-100 text-green-800',
      'education': 'bg-indigo-100 text-indigo-800',
      'personal': 'bg-gray-100 text-gray-800',
      'salary': 'bg-emerald-100 text-emerald-800',
      'freelance': 'bg-teal-100 text-teal-800',
      'investments': 'bg-cyan-100 text-cyan-800'
    };
    
    const mainCategory = category.split(' > ')[0].toLowerCase();
    return categoryColors[mainCategory] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
        <History className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent transactions</p>
          </div>
        ) : (
          recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="w-5 h-5" />
                  ) : (
                    <ArrowDownCircle className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
                      {transaction.category.split(' > ')[0]}
                    </span>
                    {transaction.status === 'pending' && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-yellow-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className={`font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${formatAmount(transaction.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {recentTransactions.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All Transactions
          </button>
        </div>
      )}
    </div>
  );
};