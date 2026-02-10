#!/usr/bin/env node

/**
 * Generate trend analysis data from hledger journal
 * Includes:
 * - Monthly income/expense trends
 * - Category spending trends
 * - Month-over-month comparisons
 * - Spending patterns
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DATA_DIR = path.join(process.cwd(), '../data');
const JOURNAL_FILE = path.join(DATA_DIR, 'sample.journal');
const MONTHS_TO_ANALYZE = parseInt(process.argv[2]) || 12;

function runHledger(args) {
  try {
    const result = execSync(`hledger -f "${JOURNAL_FILE}" ${args}`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
    return result.trim();
  } catch (error) {
    console.error(`Error running hledger: ${error.message}`);
    return null;
  }
}

// Get monthly income and expense data
function getMonthlyTrends() {
  console.log('Analyzing monthly trends...');
  
  const incomeOutput = runHledger('balance income --monthly --tree -N');
  const expensesOutput = runHledger('balance expenses --monthly --tree -N');
  
  const monthlyData = {};
  
  // Parse income data
  if (incomeOutput) {
    const lines = incomeOutput.split('\n');
    for (const line of lines) {
      // Look for month headers like "Jan" "Feb" etc or amounts
      const monthMatch = line.match(/\s+(\d{4})[-\/](\d{2})/);
      if (monthMatch) {
        const [, year, month] = monthMatch;
        const key = `${year}-${month}`;
        if (!monthlyData[key]) {
          monthlyData[key] = { income: 0, expenses: 0 };
        }
      }
    }
  }
  
  // Better approach: use register command with monthly grouping
  const incomeRegister = runHledger('register income --monthly -O csv');
  const expensesRegister = runHledger('register expenses --monthly -O csv');
  
  return parseMonthlyCSV(incomeRegister, expensesRegister);
}

function parseMonthlyCSV(incomeCSV, expensesCSV) {
  const monthlyData = [];
  
  // Parse income
  const incomeMap = new Map();
  if (incomeCSV) {
    const lines = incomeCSV.split('\n').slice(1); // Skip header
    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length >= 5) {
        const month = parts[0].replace(/"/g, '').substring(0, 7); // YYYY-MM
        const amount = parseFloat(parts[4].replace(/[^0-9.-]/g, ''));
        if (!isNaN(amount)) {
          incomeMap.set(month, Math.abs(amount));
        }
      }
    }
  }
  
  // Parse expenses
  const expensesMap = new Map();
  if (expensesCSV) {
    const lines = expensesCSV.split('\n').slice(1); // Skip header
    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length >= 5) {
        const month = parts[0].replace(/"/g, '').substring(0, 7);
        const amount = parseFloat(parts[4].replace(/[^0-9.-]/g, ''));
        if (!isNaN(amount)) {
          expensesMap.set(month, Math.abs(amount));
        }
      }
    }
  }
  
  // Combine data
  const allMonths = new Set([...incomeMap.keys(), ...expensesMap.keys()]);
  for (const month of Array.from(allMonths).sort()) {
    const income = incomeMap.get(month) || 0;
    const expenses = expensesMap.get(month) || 0;
    monthlyData.push({
      month,
      income,
      expenses,
      savings: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(2) : 0
    });
  }
  
  return monthlyData;
}

// Get category-specific trends
function getCategoryTrends() {
  console.log('Analyzing category trends...');
  
  const categories = [];
  
  // Get expense categories
  const expenseCats = runHledger('accounts expenses --tree');
  if (expenseCats) {
    const catLines = expenseCats.split('\n').filter(l => l.trim());
    for (const cat of catLines) {
      const cleanCat = cat.trim();
      if (cleanCat && !cleanCat.startsWith('expenses:')) continue;
      
      const categoryTrend = analyzeCategoryTrend(cleanCat);
      if (categoryTrend) {
        categories.push(categoryTrend);
      }
    }
  }
  
  return categories;
}

function analyzeCategoryTrend(category) {
  const output = runHledger(`register "${category}" --monthly -O csv`);
  if (!output) return null;
  
  const months = [];
  const lines = output.split('\n').slice(1); // Skip header
  
  for (const line of lines) {
    const parts = line.split(',');
    if (parts.length >= 5) {
      const month = parts[0].replace(/"/g, '').substring(0, 7);
      const amount = parseFloat(parts[4].replace(/[^0-9.-]/g, ''));
      if (!isNaN(amount) && amount !== 0) {
        months.push({ month, amount: Math.abs(amount) });
      }
    }
  }
  
  if (months.length === 0) return null;
  
  // Calculate average and trend
  const amounts = months.map(m => m.amount);
  const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const trend = calculateTrend(amounts);
  
  return {
    category: category.replace('expenses:', '').replace(/:/g, ' > '),
    months,
    average: parseFloat(average.toFixed(2)),
    trend,
    min: Math.min(...amounts),
    max: Math.max(...amounts)
  };
}

function calculateTrend(amounts) {
  if (amounts.length < 2) return 'stable';
  
  // Simple trend: compare first half average to second half average
  const midpoint = Math.floor(amounts.length / 2);
  const firstHalf = amounts.slice(0, midpoint);
  const secondHalf = amounts.slice(midpoint);
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (change > 10) return 'increasing';
  if (change < -10) return 'decreasing';
  return 'stable';
}

// Get spending patterns (day of week, time of month, etc.)
function getSpendingPatterns() {
  console.log('Analyzing spending patterns...');
  
  // Read transaction data
  const transactionsFile = path.join(DATA_DIR, 'transactions-clean.json');
  if (!fs.existsSync(transactionsFile)) {
    console.log('No transactions file found. Run transform-data.mjs first.');
    return null;
  }
  
  const transactions = JSON.parse(fs.readFileSync(transactionsFile, 'utf8'));
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Analyze by day of month
  const dayOfMonth = new Array(31).fill(0);
  const dayOfMonthCount = new Array(31).fill(0);
  
  // Analyze by day of week
  const dayOfWeek = new Array(7).fill(0);
  const dayOfWeekCount = new Array(7).fill(0);
  
  for (const txn of expenses) {
    const date = new Date(txn.date);
    const day = date.getDate() - 1; // 0-indexed
    const weekday = date.getDay(); // 0 = Sunday
    
    dayOfMonth[day] += txn.amount;
    dayOfMonthCount[day]++;
    
    dayOfWeek[weekday] += txn.amount;
    dayOfWeekCount[weekday]++;
  }
  
  return {
    byDayOfMonth: dayOfMonth.map((total, idx) => ({
      day: idx + 1,
      averageSpending: dayOfMonthCount[idx] > 0 ? parseFloat((total / dayOfMonthCount[idx]).toFixed(2)) : 0,
      totalTransactions: dayOfMonthCount[idx]
    })),
    byDayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((name, idx) => ({
      day: name,
      averageSpending: dayOfWeekCount[idx] > 0 ? parseFloat((dayOfWeek[idx] / dayOfWeekCount[idx]).toFixed(2)) : 0,
      totalSpending: parseFloat(dayOfWeek[idx].toFixed(2)),
      totalTransactions: dayOfWeekCount[idx]
    }))
  };
}

// Generate comparison data
function generateComparisons(monthlyTrends) {
  console.log('Generating comparisons...');
  
  if (monthlyTrends.length < 2) return null;
  
  const latest = monthlyTrends[monthlyTrends.length - 1];
  const previous = monthlyTrends[monthlyTrends.length - 2];
  
  return {
    currentMonth: latest.month,
    previousMonth: previous.month,
    income: {
      current: latest.income,
      previous: previous.income,
      change: latest.income - previous.income,
      changePercent: previous.income > 0 
        ? parseFloat(((latest.income - previous.income) / previous.income * 100).toFixed(2))
        : 0
    },
    expenses: {
      current: latest.expenses,
      previous: previous.expenses,
      change: latest.expenses - previous.expenses,
      changePercent: previous.expenses > 0
        ? parseFloat(((latest.expenses - previous.expenses) / previous.expenses * 100).toFixed(2))
        : 0
    },
    savings: {
      current: latest.savings,
      previous: previous.savings,
      change: latest.savings - previous.savings
    }
  };
}

// Main function
async function main() {
  console.log(`Generating trend analysis for last ${MONTHS_TO_ANALYZE} months...\n`);
  
  try {
    const monthlyTrends = getMonthlyTrends();
    const categoryTrends = getCategoryTrends();
    const spendingPatterns = getSpendingPatterns();
    const comparisons = generateComparisons(monthlyTrends);
    
    const output = {
      generatedAt: new Date().toISOString(),
      period: {
        months: MONTHS_TO_ANALYZE,
        from: monthlyTrends[0]?.month,
        to: monthlyTrends[monthlyTrends.length - 1]?.month
      },
      monthlyTrends,
      categoryTrends,
      spendingPatterns,
      comparisons
    };
    
    const outputFile = path.join(DATA_DIR, 'trends.json');
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    
    console.log(`\n✓ Trend analysis saved to ${outputFile}`);
    console.log(`\nSummary:`);
    console.log(`  - ${monthlyTrends.length} months analyzed`);
    console.log(`  - ${categoryTrends.length} category trends`);
    if (comparisons) {
      console.log(`  - Latest month: ${comparisons.currentMonth}`);
      console.log(`  - Income change: ${comparisons.income.changePercent}%`);
      console.log(`  - Expense change: ${comparisons.expenses.changePercent}%`);
    }
    
  } catch (error) {
    console.error('Error generating trends:', error);
    process.exit(1);
  }
}

main();
