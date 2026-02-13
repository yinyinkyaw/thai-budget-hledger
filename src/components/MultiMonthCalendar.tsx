import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  status: "pending" | "cleared";
  currency?: string;
}

interface MultiMonthCalendarProps {
  transactions?: Transaction[];
}

export const MultiMonthCalendar: React.FC<MultiMonthCalendarProps> = ({
  transactions = [],
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getMonthData = (monthOffset: number) => {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() + monthOffset);
    return {
      name: monthNames[date.getMonth()],
      year: date.getFullYear(),
      days: getDaysInMonth(date),
      date: date,
    };
  };

  // Check if a date has transactions
  const hasTransactionOnDate = (year: number, month: number, day: number) => {
    if (!transactions.length) return false;
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return transactions.some((t) => t.date === dateStr);
  };

  const months = [getMonthData(0), getMonthData(1), getMonthData(2)];
  const today = new Date();

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {months.map((month, monthIndex) => (
            <div
              key={monthIndex}
              className={`${monthIndex >= 1 ? "hidden md:block" : ""} ${monthIndex >= 2 ? "lg:block" : ""}`}
            >
              {/* Month Header */}
              <div className="flex items-center justify-between mb-3">
                {/* Prev Button - First month always shows it */}
                {monthIndex === 0 ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth("prev")}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="w-8"></div>
                )}

                <h3 className="text-sm font-semibold">
                  {month.name} {month.year}
                </h3>

                {/* Next Button - Mobile: first month shows it, Desktop: third month shows it */}
                {monthIndex === 0 ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth("next")}
                    className="h-8 w-8 md:hidden"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : monthIndex === 2 ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth("next")}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="w-8"></div>
                )}
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] md:text-[11px] text-muted-foreground font-medium py-1 md:py-1.5"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                {month.days.map((day, index) => {
                  const isToday =
                    day === today.getDate() &&
                    month.date.getMonth() === today.getMonth() &&
                    month.date.getFullYear() === today.getFullYear();

                  const hasTransaction =
                    day &&
                    hasTransactionOnDate(
                      month.date.getFullYear(),
                      month.date.getMonth(),
                      day,
                    );

                  return (
                    <div key={index} className="aspect-square">
                      {day && (
                        <button
                          className={`h-full w-full flex flex-col items-center justify-center rounded-md transition-colors min-h-[2rem] md:min-h-[2.5rem] ${
                            isToday
                              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                              : "text-foreground hover:bg-accent"
                          }`}
                        >
                          <span className="text-xs md:text-sm">{day}</span>
                          {hasTransaction && (
                            <span
                              className={`w-1 h-1 rounded-full mt-0.5 ${
                                isToday
                                  ? "bg-primary-foreground"
                                  : "bg-green-500"
                              }`}
                            />
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
