# Finance Tracker Data - Quick Examples

This document shows actual data examples from the generated JSON files to help you understand the data structure.

## 📊 Sample Transaction

From `transactions-clean.json`:

```json
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
```

## 💰 Sample Account

From `accounts-clean.json`:

```json
{
  "id": "assets-bank-checking",
  "name": "bank > checking",
  "fullName": "assets:bank:checking",
  "type": "asset",
  "balance": 10214.05,
  "currency": "$"
}
```

## 📂 Sample Category

From `categories-clean.json`:

```json
{
  "id": "cat-food",
  "name": "food",
  "amount": 621.75,
  "level": 0,
  "type": "expense"
}
```

## 📈 Dashboard Stats

From `stats.json`:

```json
{
  "totalIncome": 9800,
  "totalExpenses": 4754.22,
  "totalAssets": 20369.05,
  "totalLiabilities": 123.27,
  "netWorth": 20245.78,
  "currentMonth": {
    "income": 0,
    "expenses": 0,
    "savings": 0
  }
}
```

## 💵 Sample Budget Entry

From `budgets.json`:

```json
{
  "budgetId": "budget-groceries",
  "category": "food > groceries",
  "budgetAmount": 500,
  "spent": 387.95,
  "remaining": 112.05,
  "percentage": 77.6,
  "status": "ok"
}
```

## 📊 Complete Data Structure

From `finance-data.json` (simplified):

```json
{
  "generatedAt": "2026-02-10T01:56:05.522Z",
  "stats": {
    "totalIncome": 9800,
    "totalExpenses": 4754.22,
    "netWorth": 20245.78
  },
  "transactions": [
    { /* transaction objects */ }
  ],
  "accounts": [
    { /* account objects */ }
  ],
  "categories": {
    "expenses": [
      { /* category objects */ }
    ],
    "income": [
      { /* category objects */ }
    ]
  }
}
```

## 🎯 Usage in React Components

### Simple Component Example

```tsx
import financeData from './data/finance-data.json';

export function NetWorthCard() {
  return (
    <div className="card">
      <h3>Net Worth</h3>
      <p className="amount">${financeData.stats.netWorth.toLocaleString()}</p>
    </div>
  );
}
```

### List Component Example

```tsx
import transactions from './data/transactions-clean.json';

export function RecentList() {
  return (
    <ul>
      {transactions.slice(-5).reverse().map(t => (
        <li key={t.id}>
          <span>{t.description}</span>
          <span className={t.type === 'expense' ? 'expense' : 'income'}>
            ${t.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}
```

### Chart Component Example

```tsx
import { categories } from './data/finance-data.json';

export function CategoryChart() {
  const data = categories.expenses.map(cat => ({
    name: cat.name,
    value: cat.amount
  }));
  
  return <PieChart data={data} />;
}
```

## 📋 All Available Fields

### Transaction Fields
- `id` - Unique identifier (string)
- `date` - YYYY-MM-DD (string)
- `description` - Transaction description (string)
- `amount` - Amount (number)
- `type` - "income" or "expense" (string)
- `category` - Category path (string)
- `account` - Account name (string)
- `status` - "pending" or "cleared" (string)
- `note` - Optional note (string)

### Account Fields
- `id` - Unique identifier (string)
- `name` - Display name (string)
- `fullName` - Full account path (string)
- `type` - "asset" or "liability" (string)
- `balance` - Current balance (number)
- `currency` - Currency symbol (string)

### Category Fields
- `id` - Unique identifier (string)
- `name` - Category name (string)
- `amount` - Total amount (number)
- `level` - Hierarchy level (number)
- `type` - "income" or "expense" (string)

### Stats Fields
- `totalIncome` - Total income (number)
- `totalExpenses` - Total expenses (number)
- `totalAssets` - Total assets (number)
- `totalLiabilities` - Total liabilities (number)
- `netWorth` - Net worth (number)
- `currentMonth` - Object with income, expenses, savings

### Budget Fields
- `budgetId` - Budget identifier (string)
- `category` - Category name (string)
- `budgetAmount` - Budget limit (number)
- `spent` - Amount spent (number)
- `remaining` - Amount remaining (number)
- `percentage` - Percentage used (number)
- `status` - "ok", "warning", or "critical" (string)

## 🔍 Filtering Examples

### Filter by Type
```typescript
const expenses = transactions.filter(t => t.type === 'expense');
const income = transactions.filter(t => t.type === 'income');
```

### Filter by Date Range
```typescript
const thisMonth = transactions.filter(t => 
  t.date.startsWith('2024-02')
);
```

### Filter by Category
```typescript
const foodExpenses = transactions.filter(t => 
  t.category.includes('food')
);
```

### Filter by Account
```typescript
const cashTransactions = transactions.filter(t => 
  t.account === 'cash'
);
```

## 💡 Sorting Examples

### Sort by Date (newest first)
```typescript
const sorted = [...transactions].sort((a, b) => 
  b.date.localeCompare(a.date)
);
```

### Sort by Amount (highest first)
```typescript
const sorted = [...transactions].sort((a, b) => 
  b.amount - a.amount
);
```

## 📊 Aggregation Examples

### Total by Category
```typescript
const totals = categories.expenses.reduce((acc, cat) => {
  acc[cat.name] = cat.amount;
  return acc;
}, {});
```

### Total for Period
```typescript
const total = transactions
  .filter(t => t.type === 'expense' && t.date.startsWith('2024-01'))
  .reduce((sum, t) => sum + t.amount, 0);
```

### Average Transaction Amount
```typescript
const avg = transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
```

---

For complete documentation, see:
- **QUICK_START.md** - Quick start guide
- **FINANCE_TRACKER_SUMMARY.md** - Complete documentation