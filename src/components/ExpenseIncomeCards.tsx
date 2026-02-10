import React from 'react';
import { Card, CardContent } from './ui/card';

interface ExpenseIncomeCardsProps {
  expense: number;
  income: number;
}

export const ExpenseIncomeCards: React.FC<ExpenseIncomeCardsProps> = ({ expense, income }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Expense Card */}
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Expense</p>
          <p className="text-3xl font-bold">
            {expense.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} THB
          </p>
        </CardContent>
      </Card>

      {/* Income Card */}
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Income</p>
          <p className="text-3xl font-bold">
            {income.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} THB
          </p>
        </CardContent>
      </Card>
    </div>
  );
};