# Finance Tracker - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Generate Data

```bash
npm run finance:generate
```

This creates all the JSON files you need in the `data/` directory.

### Step 2: Import in Your React App

```typescript
// Import the main data file
import financeData from './data/finance-data.json';

// Destructure what you need
const { stats, transactions, accounts, categories } = financeData;
```

### Step 3: Build Your UI

Use the data in your components (see examples below).

---

## 📊 Available Data

| File | Size | Purpose | Common Use Cases |
|------|------|---------|------------------|
| **finance-data.json** | 44KB | Complete dataset | Dashboard, main app data |
| **transactions-clean.json** | 5KB | All transactions | Transaction list, filters |
| **accounts-clean.json** | 687B | Account balances | Accounts page, balance cards |
| **categories-clean.json** | 2KB | Category totals | Charts, category breakdown |
| **stats.json** | 222B | Key statistics | KPI cards, metrics |
| **trends.json** | 4KB | Trend analysis | Charts, analytics |
| **budgets.json** | 8KB | Budget tracking | Budget page, progress bars |

## 📝 Quick Examples

### Display Net Worth

```typescript
import { stats } from './data/finance-data.json';

export function NetWorthCard() {
  return (
    <Card>
      <h3>Net Worth</h3>
      <p className="text-3xl">${stats.netWorth.toLocaleString()}</p>
    </Card>
  );
}
```

### List Recent Transactions

```typescript
import transactions from './data/transactions-clean.json';

export function RecentTransactions() {
  const recent = transactions.slice(-10).reverse();
  
  return (
    <ul>
      {recent.map(t => (
        <li key={t.id}>
          <span>{t.description}</span>
          <span className={t.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
            {t.type === 'expense' ? '-' : '+'}${t.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### Category Pie Chart

```typescript
import { categories } from './data/finance-data.json';

export function CategoryChart() {
  const data = categories.expenses.map(cat => ({
    name: cat.name,
    value: cat.amount,
    percentage: (cat.amount / categories.expenses.reduce((sum, c) => sum + c.amount, 0) * 100).toFixed(1)
  }));
  
  return <PieChart data={data} />;
}
```

### Budget Progress

```typescript
import budgetData from './data/budgets.json';

export function BudgetProgress() {
  const { summary } = budgetData;
  
  return (
    <div>
      {summary.budgets.map(budget => (
        <div key={budget.budgetId}>
          <h4>{budget.category}</h4>
          <ProgressBar 
            value={budget.percentage} 
            max={100}
            color={
              budget.status === 'critical' ? 'red' :
              budget.status === 'warning' ? 'yellow' : 'green'
            }
          />
          <p>${budget.spent} of ${budget.budgetAmount}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎨 Common UI Patterns

### Dashboard Layout

```typescript
import financeData from './data/finance-data.json';

export function Dashboard() {
  const { stats, transactions, categories } = financeData;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Top Row: KPIs */}
      <StatCard title="Net Worth" value={stats.netWorth} />
      <StatCard title="Total Income" value={stats.totalIncome} />
      <StatCard title="Total Expenses" value={stats.totalExpenses} />
      
      {/* Second Row: Charts */}
      <div className="col-span-2">
        <CategoryBreakdownChart data={categories.expenses} />
      </div>
      <div>
        <AccountBalances accounts={financeData.accounts} />
      </div>
      
      {/* Third Row: Recent Activity */}
      <div className="col-span-3">
        <RecentTransactions transactions={transactions.slice(-10)} />
      </div>
    </div>
  );
}
```

### Filterable Transaction List

```typescript
import { useState } from 'react';
import transactions from './data/transactions-clean.json';
import { categories } from './data/finance-data.json';

export function TransactionsList() {
  const [filter, setFilter] = useState({ 
    type: 'all', 
    category: 'all',
    search: '' 
  });
  
  const filtered = transactions.filter(t => {
    if (filter.type !== 'all' && t.type !== filter.type) return false;
    if (filter.category !== 'all' && !t.category.includes(filter.category)) return false;
    if (filter.search && !t.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });
  
  return (
    <div>
      <div className="filters">
        <select onChange={(e) => setFilter({...filter, type: e.target.value})}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select onChange={(e) => setFilter({...filter, category: e.target.value})}>
          <option value="all">All Categories</option>
          {categories.expenses.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        
        <input 
          type="search" 
          placeholder="Search..." 
          onChange={(e) => setFilter({...filter, search: e.target.value})}
        />
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Account</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>{t.account}</td>
              <td className={t.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                {t.type === 'expense' ? '-' : '+'}${t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 🔄 Update Data Workflow

When you add new transactions to the journal:

```bash
# 1. Edit the journal file
vim data/sample.journal

# 2. Add your transaction (example):
2024-03-15 * Coffee Shop
    expenses:food:dining    $5.50
    assets:bank:checking

# 3. Regenerate all data
npm run finance:generate

# 4. Your React app will use the updated data
```

## 🎯 Design-to-Data Mapping

Based on your v0 design, here's what data to use:

| UI Component | Data Source | Example |
|--------------|-------------|---------|
| Dashboard Cards | `stats.json` | Net worth, income, expenses |
| Transaction List | `transactions-clean.json` | Full transaction history |
| Category Chart | `categories-clean.json` | Pie/bar charts |
| Budget Progress | `budgets.json` | Progress bars |
| Account Balances | `accounts-clean.json` | Account cards |
| Trend Charts | `trends.json` | Line charts |
| Monthly Summary | `finance-data.json` → `monthlySummary` | Income vs expense |

## 📚 Full Documentation

For complete details, see:
- **FINANCE_TRACKER_SUMMARY.md** - Complete architecture guide
- **DATA_PLANNING.md** - Data requirements analysis
- **data/README.md** - Data layer documentation

## 🆘 Troubleshooting

**Q: Data files are empty or missing**
```bash
# Regenerate all data
npm run finance:generate
```

**Q: I need more sample data**
```bash
# Edit the journal file
vim data/sample.journal
# Add more transactions, then regenerate
npm run finance:generate
```

**Q: I want to customize budgets**
```bash
# Edit the budget configuration
vim data/budgets-config.json
# Regenerate budgets
npm run finance:budgets
```

**Q: How do I add new categories?**
```bash
# Categories are auto-detected from transactions
# Just add transactions with new category names in the journal file
# Example:
2024-03-15 * New Category Transaction
    expenses:new-category:subcategory    $100.00
    assets:bank:checking
```

## ✅ Checklist

- [ ] Run `npm run finance:generate` to create data files
- [ ] Review `data/finance-data.json` structure
- [ ] Customize `data/budgets-config.json` (optional)
- [ ] Import data in your React components
- [ ] Build UI components based on your design
- [ ] Test with sample data
- [ ] Add real transactions to `data/sample.journal`
- [ ] Set up automatic data regeneration (optional)

---

**Ready to build!** 🎉

Your data layer is complete and ready for frontend development.
