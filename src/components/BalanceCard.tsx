import React from 'react';
import { Wallet } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  fullName: string;
  type: 'asset' | 'liability';
  balance: number;
  currency: string;
}

interface Stats {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

interface BalanceCardProps {
  accounts: Account[];
  stats: Stats;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ accounts, stats }) => {
  const assetAccounts = accounts.filter(acc => acc.type === 'asset');
  const liabilityAccounts = accounts.filter(acc => acc.type === 'liability');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Account Balances</h2>
        <Wallet className="w-5 h-5 text-gray-400" />
      </div>

      {/* Asset Accounts */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Assets</h3>
        {assetAccounts.map(account => (
          <div key={account.id} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">{account.name}</p>
              <p className="text-xs text-gray-500">{account.fullName}</p>
            </div>
            <p className="text-sm font-semibold text-green-600">
              ${account.balance.toLocaleString()}
            </p>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 mt-2 pt-2 border-t border-gray-200">
          <p className="font-semibold text-gray-900">Total Assets</p>
          <p className="font-bold text-green-600">${stats.totalAssets.toLocaleString()}</p>
        </div>
      </div>

      {/* Liability Accounts */}
      {liabilityAccounts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Liabilities</h3>
          {liabilityAccounts.map(account => (
            <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900 capitalize">{account.name}</p>
                <p className="text-sm text-gray-500">{account.fullName}</p>
              </div>
              <p className="font-semibold text-red-600">
                ${account.balance.toLocaleString()}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center py-2 mt-2 pt-2 border-t border-gray-200">
            <p className="font-semibold text-gray-900">Total Liabilities</p>
            <p className="font-bold text-red-600">${stats.totalLiabilities.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Net Worth */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-900">Net Worth</p>
          <p className={`text-2xl font-bold ${
            stats.netWorth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${stats.netWorth.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};