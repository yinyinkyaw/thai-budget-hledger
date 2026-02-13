import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { ExpenseIncomeCards } from './ExpenseIncomeCards';
import { MultiMonthCalendar } from './MultiMonthCalendar';
import { TransactionsTable } from './TransactionsTable';

interface FinanceData {
  stats: {
    totalIncome: number;
    totalExpenses: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  };
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    status: 'pending' | 'cleared';
    currency: string;
  }>;
}

export default function Dashboard() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/finance-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load finance data');
        return res.json();
      })
      .then(data => {
        setFinanceData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading finance data...</p>
        </div>
      </div>
    );
  }

  if (error || !financeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error loading data</p>
          <p className="text-gray-600 mt-2">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const { stats, transactions } = financeData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header totalBalance={stats.netWorth} />
      <div 
        className="px-3 sm:px-4 md:px-6 py-3 md:py-4 space-y-3 md:space-y-4"
        style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }}
      >
        <ExpenseIncomeCards
          expense={stats.totalExpenses}
          income={stats.totalIncome}
        />
        <MultiMonthCalendar transactions={transactions} />
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}
