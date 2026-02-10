#!/usr/bin/env node

/**
 * Generate budget data and tracking from hledger
 * 
 * This script can work with:
 * 1. Periodic transactions in hledger (budget definitions)
 * 2. A separate budgets.json file for configuration
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DATA_DIR = path.join(process.cwd(), '../data');
const JOURNAL_FILE = path.join(DATA_DIR, 'sample.journal');
const BUDGETS_CONFIG = path.join(DATA_DIR, 'budgets-config.json');

function runHledger(args) {
  try {
    const result = execSync(`hledger -f "${JOURNAL_FILE}" ${args}`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    });
    return result.trim();
  } catch (error) {
    // Budget command may fail if no budgets defined
    return null;
  }
}

// Load budget configuration
function loadBudgetConfig() {
  if (fs.existsSync(BUDGETS_CONFIG)) {
    return JSON.parse(fs.readFileSync(BUDGETS_CONFIG, 'utf8'));
  }
  
  // Return default budgets if no config exists
  return {
    budgets: [
      {
        id: 'budget-groceries',
        category: 'expenses:food:groceries',
        amount: 500,
        period: 'monthly',
        startDate: '2024-01-01',
        rollover: false,
        alerts: {
          warningThreshold: 80,
          criticalThreshold: 95
        }
      },
      {
        id: 'budget-dining',
        category: 'expenses:food:dining',
        amount: 250,
        period: 'monthly',
        startDate: '2024-01-01',
        rollover: false,
        alerts: {
          warningThreshold: 80,
          criticalThreshold: 95
        }
      },
      {
        id: 'budget-entertainment',
        category: 'expenses:entertainment',
        amount: 100,
        period: 'monthly',
        startDate: '2024-01-01',
        rollover: false,
        alerts: {
          warningThreshold: 80,
          criticalThreshold: 95
        }
      },
      {
        id: 'budget-transport',
        category: 'expenses:transport',
        amount: 200,
        period: 'monthly',
        startDate: '2024-01-01',
        rollover: false,
        alerts: {
          warningThreshold: 80,
          criticalThreshold: 95
        }
      }
    ]
  };
}

// Get actual spending for a category in a given month
function getCategorySpending(category, yearMonth) {
  const [year, month] = yearMonth.split('-');
  const startDate = `${yearMonth}-01`;
  const nextMonth = month === '12' ? `${parseInt(year) + 1}-01-01` : `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`;
  
  const result = runHledger(`balance "${category}" --begin ${startDate} --end ${nextMonth} --tree -N`);
  
  if (!result) return 0;
  
  const match = result.match(/\$?([\d,]+\.\d{2})/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  
  return 0;
}

// Get list of months to track
function getMonthsToTrack() {
  const months = [];
  const currentDate = new Date();
  
  // Get last 6 months and current month
  for (let i = 6; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = date.toISOString().substring(0, 7);
    months.push(month);
  }
  
  return months;
}

// Calculate budget tracking
function calculateBudgetTracking(budgetConfig) {
  console.log('Calculating budget tracking...');
  
  const months = getMonthsToTrack();
  const tracking = {};
  
  for (const month of months) {
    console.log(`  Processing ${month}...`);
    tracking[month] = [];
    
    for (const budget of budgetConfig.budgets) {
      const spent = getCategorySpending(budget.category, month);
      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;
      
      let status = 'ok';
      if (percentage >= budget.alerts.criticalThreshold) {
        status = 'critical';
      } else if (percentage >= budget.alerts.warningThreshold) {
        status = 'warning';
      }
      
      tracking[month].push({
        budgetId: budget.id,
        category: budget.category.replace('expenses:', '').replace(/:/g, ' > '),
        budgetAmount: budget.amount,
        spent: parseFloat(spent.toFixed(2)),
        remaining: parseFloat(remaining.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(2)),
        status
      });
    }
  }
  
  return tracking;
}

// Calculate budget summary
function calculateBudgetSummary(tracking) {
  const latestMonth = Object.keys(tracking).sort().pop();
  const latestData = tracking[latestMonth];
  
  const totalBudget = latestData.reduce((sum, item) => sum + item.budgetAmount, 0);
  const totalSpent = latestData.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = latestData.reduce((sum, item) => sum + item.remaining, 0);
  
  const criticalCount = latestData.filter(item => item.status === 'critical').length;
  const warningCount = latestData.filter(item => item.status === 'warning').length;
  const okCount = latestData.filter(item => item.status === 'ok').length;
  
  return {
    month: latestMonth,
    totalBudget: parseFloat(totalBudget.toFixed(2)),
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    totalRemaining: parseFloat(totalRemaining.toFixed(2)),
    overallPercentage: parseFloat(((totalSpent / totalBudget) * 100).toFixed(2)),
    statusCounts: {
      critical: criticalCount,
      warning: warningCount,
      ok: okCount
    },
    budgets: latestData
  };
}

// Main function
async function main() {
  console.log('Generating budget data...\n');
  
  try {
    const budgetConfig = loadBudgetConfig();
    
    // Save config if it was created from defaults
    if (!fs.existsSync(BUDGETS_CONFIG)) {
      fs.writeFileSync(BUDGETS_CONFIG, JSON.stringify(budgetConfig, null, 2));
      console.log(`✓ Created default budget configuration at ${BUDGETS_CONFIG}`);
    }
    
    const tracking = calculateBudgetTracking(budgetConfig);
    const summary = calculateBudgetSummary(tracking);
    
    const output = {
      generatedAt: new Date().toISOString(),
      budgets: budgetConfig.budgets,
      tracking,
      summary
    };
    
    const outputFile = path.join(DATA_DIR, 'budgets.json');
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    
    console.log(`\n✓ Budget data saved to ${outputFile}`);
    console.log(`\nCurrent Month Summary (${summary.month}):`);
    console.log(`  - Total Budget: $${summary.totalBudget}`);
    console.log(`  - Total Spent: $${summary.totalSpent}`);
    console.log(`  - Total Remaining: $${summary.totalRemaining}`);
    console.log(`  - Overall Usage: ${summary.overallPercentage}%`);
    console.log(`\nBudget Status:`);
    console.log(`  - OK: ${summary.statusCounts.ok}`);
    console.log(`  - Warning: ${summary.statusCounts.warning}`);
    console.log(`  - Critical: ${summary.statusCounts.critical}`);
    
  } catch (error) {
    console.error('Error generating budgets:', error);
    process.exit(1);
  }
}

main();
