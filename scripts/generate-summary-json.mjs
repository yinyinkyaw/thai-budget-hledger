#!/usr/bin/env node

/**
 * Script to generate summary JSON data from hledger journal file
 * This includes:
 * - Account balances
 * - Monthly income/expense summary
 * - Category breakdowns
 * - Recent transactions
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const JOURNAL_FILE = process.argv[2] || path.join(process.cwd(), '../data/sample.journal');
const OUTPUT_FILE = process.argv[3] || path.join(process.cwd(), '../data/summary.json');

console.log(`Generating summary JSON from ${JOURNAL_FILE}...`);

function runHledger(args) {
  try {
    const result = execSync(`hledger -f "${JOURNAL_FILE}" ${args}`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    return result.trim();
  } catch (error) {
    console.error(`Error running hledger: ${error.message}`);
    return null;
  }
}

// Get account balances
function getAccountBalances() {
  const result = runHledger('balance -N --flat -O json');
  if (!result) return [];
  
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing account balances:', error);
    return [];
  }
}

// Get monthly summary
function getMonthlySummary() {
  const incomeResult = runHledger('balance income --monthly -O json');
  const expensesResult = runHledger('balance expenses --monthly -O json');
  
  const summary = {
    income: incomeResult ? JSON.parse(incomeResult) : [],
    expenses: expensesResult ? JSON.parse(expensesResult) : []
  };
  
  return summary;
}

// Get expense categories breakdown
function getExpenseCategories() {
  const result = runHledger('balance expenses --tree --flat -O json');
  if (!result) return [];
  
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing expense categories:', error);
    return [];
  }
}

// Get income categories breakdown
function getIncomeCategories() {
  const result = runHledger('balance income --tree --flat -O json');
  if (!result) return [];
  
  try {
    return JSON.parse(result);
  } catch (error) {
    console.error('Error parsing income categories:', error);
    return [];
  }
}

// Get recent transactions
function getRecentTransactions() {
  const result = runHledger('print -O json');
  if (!result) return [];
  
  try {
    const transactions = JSON.parse(result);
    // Return last 30 transactions
    return transactions.slice(-30);
  } catch (error) {
    console.error('Error parsing recent transactions:', error);
    return [];
  }
}

// Generate summary object
const summary = {
  generatedAt: new Date().toISOString(),
  accounts: getAccountBalances(),
  monthlySummary: getMonthlySummary(),
  expenseCategories: getExpenseCategories(),
  incomeCategories: getIncomeCategories(),
  recentTransactions: getRecentTransactions()
};

// Write to file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2));
console.log(`Summary saved to ${OUTPUT_FILE}`);
