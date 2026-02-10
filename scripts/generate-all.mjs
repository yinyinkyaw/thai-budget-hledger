#!/usr/bin/env node

/**
 * Master script to generate all finance tracker data files
 * Runs all transformation and analysis scripts in sequence
 */

import { execSync } from 'child_process';
import path from 'path';

const scripts = [
  {
    name: 'Transform Data',
    script: 'transform-data.mjs',
    description: 'Generate clean transaction, account, and category data'
  },
  {
    name: 'Generate Trends',
    script: 'generate-trends.mjs',
    description: 'Generate trend analysis and spending patterns'
  },
  {
    name: 'Generate Budgets',
    script: 'generate-budgets.mjs',
    description: 'Generate budget tracking data'
  }
];

console.log('╔════════════════════════════════════════════════════╗');
console.log('║   Finance Tracker - Data Generation Suite         ║');
console.log('╚════════════════════════════════════════════════════╝\n');

let successCount = 0;
let failCount = 0;

for (const script of scripts) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${script.name}`);
  console.log(`${script.description}`);
  console.log('='.repeat(60));
  
  try {
    execSync(`node ${script.script}`, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`✓ ${script.name} completed successfully`);
    successCount++;
  } catch (error) {
    console.error(`✗ ${script.name} failed`);
    failCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('Generation Complete!');
console.log('='.repeat(60));
console.log(`✓ Success: ${successCount}`);
if (failCount > 0) {
  console.log(`✗ Failed: ${failCount}`);
}

console.log('\nGenerated files:');
console.log('  - data/finance-data.json (complete dataset)');
console.log('  - data/transactions-clean.json');
console.log('  - data/accounts-clean.json');
console.log('  - data/categories-clean.json');
console.log('  - data/stats.json');
console.log('  - data/trends.json');
console.log('  - data/budgets.json');
console.log('  - data/budgets-config.json (configuration)');

console.log('\nNext steps:');
console.log('  1. Review the generated JSON files in the data/ directory');
console.log('  2. Customize budgets-config.json for your budget needs');
console.log('  3. Import these JSON files into your React frontend');
console.log('  4. Run this script again after updating the journal file');

process.exit(failCount > 0 ? 1 : 0);
