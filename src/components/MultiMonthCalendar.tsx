import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export const MultiMonthCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
      date: date
    };
  };

  const months = [getMonthData(0), getMonthData(1), getMonthData(2)];
  const today = new Date();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-8">
          {months.map((month, monthIndex) => (
            <div key={monthIndex}>
              {/* Month Header */}
              <div className="flex items-center justify-between mb-3">
                {monthIndex === 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                {monthIndex !== 0 && <div className="w-8"></div>}
                
                <h3 className="text-sm font-semibold">
                  {month.name} {month.year}
                </h3>
                
                {monthIndex === 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                {monthIndex !== 2 && <div className="w-8"></div>}
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-[11px] text-muted-foreground font-medium py-1.5">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day, index) => {
                  const isToday = day === today.getDate() && 
                    month.date.getMonth() === today.getMonth() && 
                    month.date.getFullYear() === today.getFullYear();
                  
                  return (
                    <div key={index} className="aspect-square">
                      {day && (
                        <button className={`h-full w-full flex items-center justify-center text-sm rounded-md transition-colors ${
                          isToday
                            ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                            : 'text-foreground hover:bg-accent'
                        }`}>
                          {day}
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