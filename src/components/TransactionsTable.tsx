import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  status: 'pending' | 'cleared';
  currency?: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
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

  const totalBalance = transactions.reduce((sum, t) => {
    return sum + (t.type === 'income' ? t.amount : -t.amount);
  }, 0);

  return (
    <Card>
      <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
        <CardTitle className="text-sm md:text-base font-semibold">Transactions</CardTitle>
        <CardDescription className="text-xs md:text-sm mt-0.5">All income and expense transactions.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] md:text-[11px] uppercase tracking-wider font-medium px-2 md:px-4">Date</TableHead>
              <TableHead className="text-[10px] md:text-[11px] uppercase tracking-wider font-medium px-2 md:px-4">Description</TableHead>
              <TableHead className="text-[10px] md:text-[11px] uppercase tracking-wider font-medium px-2 md:px-4 hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-[10px] md:text-[11px] uppercase tracking-wider font-medium px-2 md:px-4">Type</TableHead>
              <TableHead className="text-right text-[10px] md:text-[11px] uppercase tracking-wider font-medium px-2 md:px-4">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-muted-foreground text-xs md:text-sm px-2 md:px-4">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="text-xs md:text-sm px-2 md:px-4">
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="font-medium truncate max-w-[100px] sm:max-w-none">{transaction.description}</span>
                    {transaction.status === 'pending' && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-[10px] md:text-xs whitespace-nowrap">
                        Pending
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell px-2 md:px-4">
                  <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-gray-100 text-gray-700">
                    {transaction.category}
                  </span>
                </TableCell>
                <TableCell className="px-2 md:px-4">
                  <Badge 
                    variant="outline"
                    className={`text-[10px] md:text-xs ${transaction.type === 'income'
                      ? 'text-green-700 border-green-200 bg-green-50'
                      : 'text-red-700 border-red-200 bg-red-50'
                    }`}
                  >
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-xs md:text-sm px-2 md:px-4">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-foreground'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Total Row */}
            <TableRow className="bg-muted/30 font-semibold hover:bg-muted/30">
              <TableCell className="text-xs md:text-sm px-2 md:px-4">Total</TableCell>
              <TableCell className="px-2 md:px-4"></TableCell>
              <TableCell className="hidden sm:table-cell px-2 md:px-4"></TableCell>
              <TableCell className="px-2 md:px-4"></TableCell>
              <TableCell className="text-right text-green-600 font-bold text-xs md:text-sm px-2 md:px-4">
                ${totalBalance.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};