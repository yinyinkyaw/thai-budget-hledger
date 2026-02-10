# Data Refresh Guide

This document explains how to refresh your finance data from hledger.

## Quick Start

To refresh your finance data from hledger and update the dashboard:

```bash
npm run data:refresh
```

This command will:
1. Export transactions from hledger to `data/transactions-raw.json`
2. Export balance information to `data/balance-raw.json`
3. Transform the raw data into a clean format at `data/finance-data.json`
4. Copy the data to `public/data/finance-data.json` for the web app

## What Gets Generated

The `data:refresh` script creates:

- **`data/finance-data.json`** - Main data file containing:
  - `stats` - Overall statistics (income, expenses, net worth)
  - `transactions` - All transactions with clean formatting
  - `accounts` - Asset and liability accounts
  - `categories` - Expense and income categories

## Data Structure

### Stats
```json
{
  "totalIncome": 0,
  "totalExpenses": 19174.88,
  "totalAssets": 12128.97,
  "totalLiabilities": 0,
  "netWorth": 12128.97
}
```

### Transactions
```json
{
  "id": "txn-1",
  "date": "2026-02-03",
  "description": "Dinner",
  "amount": 30,
  "type": "expense",
  "category": "food > meal",
  "account": "assets:bank",
  "status": "pending",
  "currency": "THB"
}
```

## Workflow

### Option 1: Auto-refresh (Recommended)

Run the data watcher in a separate terminal:

```bash
npm run data:watch
```

This will:
- Watch your `.hledger.journal` file for changes
- Automatically refresh data when you add/edit transactions
- Keep running until you stop it (Ctrl+C)

Then in another terminal, run the dev server:

```bash
npm run dev
```

Now whenever you add transactions with `hledger add`, the dashboard will automatically update!

### Option 2: Manual refresh

1. **Add transactions to hledger**:
   ```bash
   hledger add
   ```

2. **Refresh the data**:
   ```bash
   npm run data:refresh
   ```

3. **View in dashboard**:
   - The dev server will automatically reload
   - Visit http://localhost:4323 to see updated data

## Manual Steps (if needed)

If you prefer to run steps individually:

```bash
# 1. Export from hledger
hledger print -O json > data/transactions-raw.json
hledger balance -O json > data/balance-raw.json

# 2. Transform the data
node scripts/transform-hledger-data.mjs

# 3. Copy to public folder
mkdir -p public/data
cp data/finance-data.json public/data/finance-data.json
```

## Troubleshooting

### Data not updating in browser
- Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check the browser console for errors
- Verify `public/data/finance-data.json` exists and has recent timestamp

### Script errors
- Make sure `LEDGER_FILE` environment variable is set
- Check that `.hledger.journal` has valid transactions
- Run `hledger check` to validate your journal file

### No income showing
- Verify your journal has transactions with `income:` accounts
- Income amounts should be positive in the income account
- Check the category mapping in `transform-hledger-data.mjs`
