import React from "react";
import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const savingsRate =
    stats.totalIncome > 0
      ? (
          ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) *
          100
        ).toFixed(1)
      : "0.0";

  const cards = [
    {
      title: "Total Balance",
      value: stats.netWorth,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      prefix: "$",
      suffix: "",
    },
    {
      title: "Monthly Income",
      value: stats.totalIncome,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      prefix: "$",
      suffix: "",
    },
    {
      title: "Monthly Expenses",
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      prefix: "$",
      suffix: "",
    },
    {
      title: "Savings Rate",
      value: savingsRate,
      icon: Wallet,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      prefix: "",
      suffix: "%",
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <div
          key={index}
          className="text-card-foreground flex flex-col gap-6 border-b py-6 pb-0 border-dashed"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {card.prefix}
                {typeof card.value === "number"
                  ? card.value.toLocaleString()
                  : card.value}
                {card.suffix}
              </p>
            </div>
            <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
