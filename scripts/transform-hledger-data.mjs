import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

// Read raw hledger data
const transactionsRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'transactions-raw.json'), 'utf8'));
const balanceRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'balance-raw.json'), 'utf8'));

// Transform transactions
const transactions = [];
let txnId = 1;

transactionsRaw.forEach(txn => {
  // Get expense postings (positive amounts in expense accounts)
  const expensePostings = txn.tpostings.filter(p => 
    p.paccount.startsWith('expenses:') && p.pamount.length > 0
  );
  
  // Get income postings (positive amounts in income accounts or assets accounts with positive amounts)
  // For income, we look at assets accounts that receive money (positive amounts)
  // Exclude transfers between asset accounts
  const hasMultipleAssets = txn.tpostings.filter(p => p.paccount.startsWith('assets:')).length > 1;
  const assetIncomePostings = txn.tpostings.filter(p => 
    p.paccount.startsWith('assets:') && 
    p.pamount.length > 0 && 
    p.pamount[0].aquantity.floatingPoint > 0 &&
    !txn.tpostings.some(p2 => p2.paccount.startsWith('expenses:')) &&
    !hasMultipleAssets  // Exclude transfers between assets
  );
  
  const incomePostings = txn.tpostings.filter(p => 
    p.paccount.startsWith('income:') && p.pamount.length > 0
  );
  
  // Process expense postings
  expensePostings.forEach(posting => {
    if (posting.pamount[0]) {
      const amount = Math.abs(posting.pamount[0].aquantity.floatingPoint);
      if (amount > 0) {
        transactions.push({
          id: `txn-${txnId++}`,
          date: txn.tdate,
          description: txn.tdescription,
          amount: amount,
          type: 'expense',
          category: posting.paccount.replace('expenses:', '').split(':').join(' > '),
          account: 'assets:bank',
          status: posting.pstatus === 'Cleared' ? 'cleared' : 'pending',
          currency: posting.pamount[0].acommodity
        });
      }
    }
  });
  
  // Process income postings from income accounts
  incomePostings.forEach(posting => {
    if (posting.pamount[0]) {
      const amount = Math.abs(posting.pamount[0].aquantity.floatingPoint);
      if (amount > 0) {
        transactions.push({
          id: `txn-${txnId++}`,
          date: txn.tdate,
          description: txn.tdescription,
          amount: amount,
          type: 'income',
          category: posting.paccount.replace('income:', '').split(':').join(' > '),
          account: 'assets:bank',
          status: posting.pstatus === 'Cleared' ? 'cleared' : 'pending',
          currency: posting.pamount[0].acommodity
        });
      }
    }
  });
  
  // Process income from asset increases (like salary deposits)
  assetIncomePostings.forEach(posting => {
    if (posting.pamount[0]) {
      const amount = Math.abs(posting.pamount[0].aquantity.floatingPoint);
      if (amount > 0) {
        // Find the source account (usually equity or income)
        const sourcePosting = txn.tpostings.find(p => 
          p !== posting && 
          (p.paccount.startsWith('equity:') || p.paccount.startsWith('income:'))
        );
        
        const category = sourcePosting 
          ? sourcePosting.paccount.replace(/^(equity|income):/, '').split(':').join(' > ')
          : 'Other Income';
        
        transactions.push({
          id: `txn-${txnId++}`,
          date: txn.tdate,
          description: txn.tdescription,
          amount: amount,
          type: 'income',
          category: category,
          account: posting.paccount,
          status: posting.pstatus === 'Cleared' ? 'cleared' : 'pending',
          currency: posting.pamount[0].acommodity
        });
      }
    }
  });
});

// Sort by date
transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

// Transform accounts from balance data
const accounts = [];
const accountMap = new Map();

// Balance data structure is [[account, displayName, depth, [amounts]]]
balanceRaw.forEach(outerItem => {
  if (Array.isArray(outerItem)) {
    outerItem.forEach(item => {
      if (Array.isArray(item) && item.length >= 4) {
        const account = item[0];
        const amounts = item[3];
        
        if (typeof account === 'string' && (account.startsWith('assets:') || account.startsWith('liabilities:'))) {
          const type = account.startsWith('assets:') ? 'asset' : 'liability';
          const name = account.split(':').pop();
          const amount = amounts?.[0]?.aquantity?.floatingPoint || 0;
          
          accounts.push({
            id: account.replace(/:/g, '-'),
            name: name,
            fullName: account,
            type: type,
            balance: Math.abs(amount),
            currency: 'THB'
          });
        }
      }
    });
  }
});

// Calculate statistics
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
  .reduce((sum, a) => sum + a.balance, 0);

const netWorth = totalAssets - totalLiabilities;

// Extract categories
const categoryMap = new Map();

transactions.forEach(t => {
  const mainCategory = t.category.split(' > ')[0];
  if (!categoryMap.has(mainCategory)) {
    categoryMap.set(mainCategory, { amount: 0, type: t.type });
  }
  categoryMap.get(mainCategory).amount += t.amount;
});

const expenseCategories = [];
const incomeCategories = [];

categoryMap.forEach((data, name) => {
  const category = {
    id: `cat-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name: name,
    amount: data.amount,
    level: 0,
    type: data.type
  };
  
  if (data.type === 'expense') {
    expenseCategories.push(category);
  } else {
    incomeCategories.push(category);
  }
});

// Sort by amount
expenseCategories.sort((a, b) => b.amount - a.amount);
incomeCategories.sort((a, b) => b.amount - a.amount);

// Create final data structure
const financeData = {
  generatedAt: new Date().toISOString(),
  stats: {
    totalIncome,
    totalExpenses,
    totalAssets,
    totalLiabilities,
    netWorth,
    currentMonth: {
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalIncome - totalExpenses
    }
  },
  transactions,
  accounts,
  categories: {
    expenses: expenseCategories,
    income: incomeCategories
  }
};

// Write the data
fs.writeFileSync(
  path.join(dataDir, 'finance-data.json'),
  JSON.stringify(financeData, null, 2)
);

console.log('✓ Finance data generated successfully!');
console.log(`  - ${transactions.length} transactions`);
console.log(`  - ${accounts.length} accounts`);
console.log(`  - ${expenseCategories.length} expense categories`);
console.log(`  - ${incomeCategories.length} income categories`);
console.log(`  - Total Income: ${totalIncome.toLocaleString()} THB`);
console.log(`  - Total Expenses: ${totalExpenses.toLocaleString()} THB`);
console.log(`  - Net Worth: ${netWorth.toLocaleString()} THB`);