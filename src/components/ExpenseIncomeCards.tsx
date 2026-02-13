import React from "react";
import { Card, CardContent } from "./ui/card";

interface ExpenseIncomeCardsProps {
  expense: number;
  income: number;
}

export const ExpenseIncomeCards: React.FC<ExpenseIncomeCardsProps> = ({
  expense,
  income,
}) => {
  return (
    <Card className="border-dashed bg-transparent rounded-none pb-0 border-0 shadow-none border-b">
      <CardContent className="p-0">
        <div className="grid grid-cols-2">
          {/* Expense Section */}
          <div className="p-4 sm:p-6 md:p-8 text-center border-r border-dashed">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
              Expense
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">
              $
              {expense.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Income Section */}
          <div className="p-4 sm:p-6 md:p-8 text-center">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
              Income
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">
              $
              {income.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
