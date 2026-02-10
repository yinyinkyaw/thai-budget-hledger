# Finance Tracker - Complete Data Architecture Summary

## 🎯 Overview

This document provides a complete summary of the finance tracker data architecture, including how hledger works, what data is available, and how to use it for your React frontend.

## 📁 Project Structure

```
/workspace/
├── data/                          # Finance data directory
│   ├── sample.journal            # hledger journal file (source of truth)
│   ├── finance-data.json         # ⭐ Main data file (use this!)
│   ├── transactions-clean.json   # All transactions
│   ├── accounts-clean.json       # Account balances
│   ├── categories-clean.json     # Category breakdowns
│   ├── stats.json                # Dashboard statistics
│   ├── trends.json               # Spending trends and analysis
│   ├── budgets.json              # Budget tracking data
│   ├── budgets-config.json       # Budget configuration (editable)
│   └── README.md                 # Detailed data documentation
├── scripts/                       # Data generation scripts
│   ├── generate-all.mjs          # ⭐ Master script (run this!)
│   ├── transform-data.mjs        # Transform hledger → clean JSON
│   ├── generate-trends.mjs       # Generate trend analysis
│   ├── generate-budgets.mjs      # Generate budget tracking
│   ├── generate-transactions-json.sh
│   └── generate-summary-json.mjs
├── DATA_PLANNING.md              # Data requirements analysis
└── FINANCE_TRACKER_SUMMARY.md    # This file
```

## 🚀 Quick Start

### 1. Generate All Data

```bash
# From project root
npm run finance:generate

# Or from scripts directory
cd scripts && node generate-all.mjs
```

### 2. Use the Data in Your React App

```typescript
// Import the main data file
import financeData from '../data/finance-data.json';

// Access different parts
const { stats, transactions, accounts, categories } = financeData;

// Use in your components
console.log(`Net Worth: $${stats.netWorth}`);
console.log(`Total Transactions: ${transactions.length}`);
```

## 📊 Available Data Files

### 1. **finance-data.json** ⭐ RECOMMENDED

Complete dataset with everything you need:

```json
{
  "generatedAt": "2026-02-10T01:56:05.522Z",
  "stats": {
    "totalIncome": 9800,
    "totalExpenses": 4754.22,
    "totalAssets": 20369.05,
    "totalLiabilities": 123.27,
    "netWorth": 20245.78,
    "currentMonth": { "income": 0, "expenses": 0, "savings": 0 }
  },
  "transactions": [...],
  "accounts": [...],
  "categories": { "expenses": [...], "income": [...] },
  "monthlySummary": {...}
}
```

**Use Cases:**
- Dashboard overview
- Main data source for entire app
- One-stop data import

### 2. **transactions-clean.json**

All transactions in a clean, easy-to-use format:

```json
[
  {
    "id": "txn-3",
    "date": "2024-01-07",
    "description": "Whole Foods",
    "amount": 156.32,
    "type": "expense",
    "category": "food > groceries",
    "account": "bank > checking",
    "status": "pending",
    "note": ""
  }
]
```

**Use Cases:**
- Transactions list page
- Recent transactions widget
- Transaction filtering/search
- Transaction details view

### 3. **accounts-clean.json**

Account balances:

```json
[
  {
    "id": "assets-cash",
    "name": "cash",
    "fullName": "assets:cash",
    "type": "asset",
    "balance": 155,
    "currency": "$"
  }
]
```

**Use Cases:**
- Accounts overview page
- Account balance widgets
- Net worth calculation
- Account selection dropdowns

### 4. **categories-clean.json**

Income and expense categories with totals:

```json
{
  "expenses": [
    {
      "id": "cat-food",
      "name": "food",
      "amount": 621.75,
      "level": 0,
      "type": "expense"
    }
  ],
  "income": [...]
}
```

**Use Cases:**
- Category breakdown charts
- Spending by category
- Category filter dropdowns
- Budget category selection

### 5. **stats.json**

Dashboard statistics:

```json
{
  "totalIncome": 9800,
  "totalExpenses": 4754.22,
  "totalAssets": 20369.05,
  "totalLiabilities": 123.27,
  "netWorth": 20245.78,
  "currentMonth": { "income": 0, "expenses": 0, "savings": 0 }
}
```

**Use Cases:**
- Dashboard KPIs
- Overview cards
- Summary statistics
- Quick metrics

### 6. **trends.json**

Spending trends and analysis:

```json
{
  "generatedAt": "...",
  "period": { "months": 12, "from": "2024-01", "to": "2024-02" },
  "monthlyTrends": [...],
  "categoryTrends": [...],
  "spendingPatterns": {...},
  "comparisons": {...}
}
```

**Use Cases:**
- Trend charts
- Spending patterns analysis
- Month-over-month comparisons
- Analytics page

### 7. **budgets.json**

Budget tracking:

```json
{
  "generatedAt": "...",
  "budgets": [
    {
      "id": "budget-groceries",
      "category": "expenses:food:groceries",
      "amount": 500,
      "period": "monthly",
      "alerts": { "warningThreshold": 80, "criticalThreshold": 95 }
    }
  ],
  "tracking": {
    "2026-02": [
      {
        "budgetId": "budget-groceries",
        "spent": 0,
        "remaining": 500,
        "percentage": 0,
        "status": "ok"
      }
    ]
  },
  "summary": {...}
}
```

**Use Cases:**
- Budget overview page
- Budget progress bars
- Budget alerts/warnings
- Budget vs actual comparison

### 8. **budgets-config.json** (Editable)

Budget configuration that you can edit:

```json
{
  "budgets": [
    {
      "id": "budget-groceries",
      "category": "expenses:food:groceries",
      "amount": 500,
      "period": "monthly",
      "startDate": "2024-01-01",
      "rollover": false,
      "alerts": { "warningThreshold": 80, "criticalThreshold": 95 }
    }
  ]
}
```

**Edit this file to customize your budgets!**

## 🔧 How It Works

### The hledger Workflow

```
1. Journal File (sample.journal)
   ↓ Plain text, human-readable
   ↓ Double-entry bookkeeping
   ↓
2. hledger CLI Commands
   ↓ Export to JSON
   ↓ Generate reports
   ↓
3. Transformation Scripts
   ↓ Clean and structure data
   ↓ Calculate statistics
   ↓
4. JSON Data Files
   ↓ Ready for React frontend
   ↓
5. Finance Tracker App
```

### hledger Journal Format

```journal
; This is a comment

; Define accounts
account expenses:food:groceries
account assets:bank:checking

; Record a transaction
2024-01-07 * Whole Foods
    expenses:food:groceries    $156.32
    assets:bank:checking

; Each transaction must balance (sum to zero)
; One amount can be omitted and will be inferred
```

**Key Concepts:**
- **Double-entry bookkeeping**: Every transaction has ≥2 postings
- **Account hierarchy**: Colon-separated (e.g., `expenses:food:groceries`)
- **Account types**:
  - `assets` - What you own
  - `liabilities` - What you owe
  - `expenses` - Money spent
  - `income` - Money received
  - `equity` - Opening balances, net worth

### Sample Data

Current sample data includes:
- **23 transactions** (Jan-Feb 2024)
- **4 accounts** (checking, savings, cash, credit card)
- **13 expense categories** (food, housing, transport, etc.)
- **3 income categories** (salary, freelance)
- **Total Income:** $9,800.00
- **Total Expenses:** $4,754.22
- **Net Worth:** $20,245.78

## 📝 npm Scripts

Add to your workflow:

```bash
# Generate all data files
npm run finance:generate

# Individual scripts
npm run finance:transform   # Transform hledger → clean JSON
npm run finance:trends      # Generate trend analysis
npm run finance:budgets     # Generate budget tracking
```

## 💡 Usage Examples for React

### Dashboard Component

```typescript
import financeData from '@/data/finance-data.json';

export function Dashboard() {
  const { stats, transactions } = financeData;
  
  return (
    <div>
      <StatsCard title="Net Worth" value={stats.netWorth} />
      <StatsCard title="Total Income" value={stats.totalIncome} />
      <StatsCard title="Total Expenses" value={stats.totalExpenses} />
      <RecentTransactions transactions={transactions.slice(-10)} />
    </div>
  );
}
```

### Transactions List

```typescript
import transactions from '@/data/transactions-clean.json';

export function TransactionsList() {
  const [filter, setFilter] = useState('all');
  
  const filtered = transactions.filter(t => 
    filter === 'all' || t.type === filter
  );
  
  return (
    <div>
      <FilterButtons onChange={setFilter} />
      <TransactionTable transactions={filtered} />
    </div>
  );
}
```

### Budget Progress

```typescript
import budgetData from '@/data/budgets.json';

export function BudgetOverview() {
  const { summary } = budgetData;
  
  return (
    <div>
      <h2>Budget Overview - {summary.month}</h2>
      <ProgressBar 
        value={summary.totalSpent} 
        max={summary.totalBudget} 
      />
      {summary.budgets.map(budget => (
        <BudgetCard key={budget.budgetId} {...budget} />
      ))}
    </div>
  );
}
```

### Category Breakdown Chart

```typescript
import { categories } from '@/data/finance-data.json';

export function CategoryChart() {
  const chartData = categories.expenses.map(cat => ({
    name: cat.name,
    value: cat.amount
  }));
  
  return <PieChart data={chartData} />;
}
```

## 🎨 Design Requirements Coverage

Based on typical expense tracker designs:

### ✅ Fully Supported Features

- [x] Dashboard with key metrics
- [x] Transaction list with filtering
- [x] Account balances overview
- [x] Category breakdown charts
- [x] Income vs Expense comparison
- [x] Recent transactions
- [x] Monthly summaries
- [x] Budget tracking
- [x] Spending trends

### ⚠️ Partially Supported

- [ ] Multi-month trend charts (data available, needs frontend implementation)
- [ ] Recurring transaction detection (can be added)
- [ ] Transaction tags (hledger supports, needs implementation)

### ❌ Not Yet Supported

- [ ] Transaction attachments/receipts
- [ ] Goals/savings targets
- [ ] Bill reminders
- [ ] Multi-currency support
- [ ] Investment tracking

## 🔄 Data Update Workflow

1. **Edit the journal file**
   ```bash
   vim data/sample.journal
   # Add new transactions
   ```

2. **Regenerate data**
   ```bash
   npm run finance:generate
   ```

3. **Data is automatically updated**
   - All JSON files regenerated
   - Frontend gets new data on next import/reload

## 📚 Resources

- **hledger Documentation**: https://hledger.org/
- **Plain Text Accounting**: https://plaintextaccounting.org/
- **hledger Cookbook**: https://hledger.org/cookbook.html
- **Double-Entry Bookkeeping**: https://en.wikipedia.org/wiki/Double-entry_bookkeeping

## 🎯 Next Steps

1. **Review the design** from v0.app to identify specific UI components needed
2. **Customize budgets** by editing `data/budgets-config.json`
3. **Add more sample data** to `data/sample.journal` if needed
4. **Create React components** that import the JSON data
5. **Set up data refresh** - run `npm run finance:generate` when journal changes

## 📋 Design-Specific Recommendations

Without seeing your v0 design, here are typical components you might need:

### Dashboard Page
- Use: `finance-data.json` → `stats`
- Cards showing: Net Worth, Income, Expenses, Savings
- Recent transactions from `transactions`
- Quick category breakdown from `categories`

### Transactions Page
- Use: `transactions-clean.json`
- Table/list with search and filters
- Columns: Date, Description, Category, Account, Amount
- Filter by: Date range, Category, Account, Type

### Categories Page
- Use: `categories-clean.json`
- Expense categories with totals
- Visual breakdown (pie/bar chart)
- Click to see transactions for that category

### Accounts Page
- Use: `accounts-clean.json`
- List of all accounts with balances
- Total assets vs liabilities
- Click to see account transaction history

### Budgets Page
- Use: `budgets.json`
- Budget cards with progress bars
- Color coding: green (OK), yellow (warning), red (critical)
- Edit budgets via `budgets-config.json`

### Reports/Analytics Page
- Use: `trends.json`
- Income vs Expense over time (line chart)
- Spending by category over time
- Month-over-month comparisons

## 🤝 Support

For questions or issues:
1. Check `data/README.md` for detailed documentation
2. Review `DATA_PLANNING.md` for data requirements
3. Run scripts with `--help` flag (if available)
4. Check hledger documentation at https://hledger.org/

---

**Last Updated**: February 10, 2026
**Data Version**: 1.0
**Sample Transactions**: 23
**Generated Files**: 10
