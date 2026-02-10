#!/usr/bin/env node

/**
 * Transform hledger JSON data into frontend-friendly format
 * This script reads the raw hledger JSON and creates clean, structured data for the React app
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DATA_DIR = path.join(process.cwd(), '../data');
const JOURNAL_FILE = path.join(DATA_DIR, 'sample.journal');

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

// Extract amount value from hledger's complex amount structure
function extractAmount(amounts) {
  if (!Array.isArray(amounts) || amounts.length === 0) return 0;
  const amount = amounts[0];
  return amount.aquantity?.floatingPoint || 0;
}

// Extract commodity (currency symbol)
function extractCommodity(amounts) {
  if (!Array.isArray(amounts) || amounts.length === 0) return '$';
  return amounts[0].acommodity || '$';
}

// Parse and transform transactions
function transformTransactions() {
  console.log('Transforming transactions...');
  
  const rawJson = fs.readFileSync(path.join(DATA_DIR, 'transactions.json'), 'utf8');
  const transactions = JSON.parse(rawJson);
  
  const transformed = transactions.map((txn, index) => {
    // Determine transaction type and main account
    let type = 'expense';
    let category = '';
    let account = '';
    let amount = 0;
    
    // Analyze postings to determine transaction type
    for (const posting of txn.tpostings) {
      const accountName = posting.paccount;
      const postingAmount = extractAmount(posting.pamount);
      
      if (accountName.startsWith('expenses:')) {
        type = 'expense';
        category = accountName.replace('expenses:', '').replace(/:/g, ' > ');
        amount = Math.abs(postingAmount);
      } else if (accountName.startsWith('income:')) {
        type = 'income';
        category = accountName.replace('income:', '').replace(/:/g, ' > ');
        amount = Math.abs(postingAmount);
      } else if (accountName.startsWith('assets:') || accountName.startsWith('liabilities:')) {
        account = accountName.replace(/^(assets:|liabilities:)/, '').replace(/:/g, ' > ');
      }
    }
    
    return {
      id: `txn-${txn.tindex}`,
      date: txn.tdate,
      description: txn.tdescription,
      amount: amount,
      type: type,
      category: category,
      account: account,
      status: txn.tpostings[0]?.pstatus === 'Cleared' ? 'cleared' : 'pending',
      note: txn.tcomment || ''
    };
  });
  
  return transformed;
}

// Transform accounts with balances
function transformAccounts() {
  console.log('Transforming accounts...');
  
  const result = runHledger('balance assets liabilities --flat -N -O json');
  if (!result) return [];
  
  const rawData = JSON.parse(result);
  
  // hledger balance -O json returns: [ [account1_data], [account2_data], ... ]
  // where account_data is [fullName, displayName, depth, amounts]
  const accountsList = rawData[0];  // Get the first (and only) element which is the array of accounts
  
  return accountsList.map((accountData, idx) => {
    // Each account is: [fullName, displayName, depth, amounts]
    const [fullName, displayName, depth, amounts] = accountData;
    
    const balance = extractAmount(amounts);
    const currency = extractCommodity(amounts);
    const type = (fullName && fullName.startsWith('assets:')) ? 'asset' : 'liability';
    const name = fullName ? fullName.replace(/^(assets:|liabilities:)/, '').replace(/:/g, ' > ') : '';
    
    return {
      id: fullName ? fullName.replace(/:/g, '-') : `account-${idx}`,
      name: name,
      fullName: fullName,
      type: type,
      balance: balance,
      currency: currency
    };
  });
}

// Transform expense categories with totals
function transformExpenseCategories() {
  console.log('Transforming expense categories...');
  
  const result = runHledger('balance expenses --tree -N');
  if (!result) return [];
  
  const lines = result.split('\n').filter(line => line.trim() && !line.startsWith('-'));
  const categories = [];
  
  for (const line of lines) {
    const match = line.match(/\$?([\d,]+\.\d{2})\s+(.+)/);
    if (match) {
      const [, amountStr, name] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const level = (line.search(/\S/) / 2); // Indentation level
      
      categories.push({
        id: `cat-${name.trim().replace(/\s+/g, '-')}`,
        name: name.trim(),
        amount: amount,
        level: level,
        type: 'expense'
      });
    }
  }
  
  return categories;
}

// Transform income categories
function transformIncomeCategories() {
  console.log('Transforming income categories...');
  
  const result = runHledger('balance income --tree -N');
  if (!result) return [];
  
  const lines = result.split('\n').filter(line => line.trim() && !line.startsWith('-'));
  const categories = [];
  
  for (const line of lines) {
    const match = line.match(/\$?([\d,]+\.\d{2})\s+(.+)/);
    if (match) {
      const [, amountStr, name] = match;
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const level = (line.search(/\S/) / 2);
      
      categories.push({
        id: `cat-${name.trim().replace(/\s+/g, '-')}`,
        name: name.trim(),
        amount: amount,
        level: level,
        type: 'income'
      });
    }
  }
  
  return categories;
}

// Generate monthly summary
function generateMonthlySummary() {
  console.log('Generating monthly summary...');
  
  const result = runHledger('balance income expenses --monthly --tree -N');
  if (!result) return [];
  
  // Parse the monthly report
  const lines = result.split('\n');
  const monthlyData = [];
  
  // This is a simplified parser - in production, you'd want more robust parsing
  // For now, we'll extract income and expenses manually
  const incomeResult = runHledger('balance income --monthly -O json');
  const expensesResult = runHledger('balance expenses --monthly -O json');
  
  // For simplified output, let's just create a basic summary
  const summary = {
    income: incomeResult ? JSON.parse(incomeResult) : [],
    expenses: expensesResult ? JSON.parse(expensesResult) : []
  };
  
  return summary;
}

// Generate dashboard statistics
function generateDashboardStats(transactions, accounts) {
  console.log('Generating dashboard statistics...');
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalAssets = accounts
    .filter(a => a.type === 'asset')
    .reduce((sum, a) => sum + a.balance, 0);
  
  const totalLiabilities = accounts
    .filter(a => a.type === 'liability')
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);
  
  const netWorth = totalAssets - totalLiabilities;
  
  // Get current month's data
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome,
    totalExpenses,
    totalAssets,
    totalLiabilities,
    netWorth,
    currentMonth: {
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savings: monthlyIncome - monthlyExpenses
    }
  };
}

// Main transformation function
async function main() {
  console.log('Starting data transformation...\n');
  
  try {
    // Transform all data
    const transactions = transformTransactions();
    const accounts = transformAccounts();
    const expenseCategories = transformExpenseCategories();
    const incomeCategories = transformIncomeCategories();
    const monthlySummary = generateMonthlySummary();
    const stats = generateDashboardStats(transactions, accounts);
    
    // Create output structure
    const output = {
      generatedAt: new Date().toISOString(),
      stats: stats,
      transactions: transactions,
      accounts: accounts,
      categories: {
        expenses: expenseCategories,
        income: incomeCategories
      },
      monthlySummary: monthlySummary
    };
    
    // Write transformed data
    const outputFile = path.join(DATA_DIR, 'finance-data.json');
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`\n✓ Transformed data saved to ${outputFile}`);
    
    // Also save individual files for easier access
    fs.writeFileSync(
      path.join(DATA_DIR, 'transactions-clean.json'),
      JSON.stringify(transactions, null, 2)
    );
    fs.writeFileSync(
      path.join(DATA_DIR, 'accounts-clean.json'),
      JSON.stringify(accounts, null, 2)
    );
    fs.writeFileSync(
      path.join(DATA_DIR, 'categories-clean.json'),
      JSON.stringify({ expenses: expenseCategories, income: incomeCategories }, null, 2)
    );
    fs.writeFileSync(
      path.join(DATA_DIR, 'stats.json'),
      JSON.stringify(stats, null, 2)
    );
    
    console.log(`✓ Individual data files created`);
    console.log(`\nSummary:`);
    console.log(`  - ${transactions.length} transactions`);
    console.log(`  - ${accounts.length} accounts`);
    console.log(`  - ${expenseCategories.length} expense categories`);
    console.log(`  - ${incomeCategories.length} income categories`);
    console.log(`  - Total Income: $${stats.totalIncome.toFixed(2)}`);
    console.log(`  - Total Expenses: $${stats.totalExpenses.toFixed(2)}`);
    console.log(`  - Net Worth: $${stats.netWorth.toFixed(2)}`);
    
  } catch (error) {
    console.error('Error during transformation:', error);
    process.exit(1);
  }
}

main();
