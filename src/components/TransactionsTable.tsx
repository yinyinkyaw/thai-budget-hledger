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
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Transactions</CardTitle>
        <CardDescription className="text-sm mt-0.5">All income and expense transactions.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] uppercase tracking-wider font-medium">Date</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-medium">Description</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-medium">Category</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-medium">Type</TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wider font-medium">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{transaction.description}</span>
                    {transaction.status === 'pending' && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                        Pending
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {transaction.category}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${transaction.type === 'income'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium text-sm">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-foreground'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)} {transaction.currency || 'THB'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            
            {/* Total Row */}
            <TableRow className="bg-muted/30 font-semibold hover:bg-muted/30">
              <TableCell className="text-sm">Total</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right text-green-600 font-bold text-sm">
                {totalBalance.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })} THB
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};