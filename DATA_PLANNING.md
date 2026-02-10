# Finance Tracker - Data Requirements & Planning

## Overview

This document outlines the data requirements for the finance tracker application based on typical expense tracker designs and the hledger data model.

## Design Requirements Analysis

Based on common expense tracker application patterns (like the v0 design), here are the typical features and their data requirements:

### 1. Dashboard / Overview Page

**Features:**
- Total balance across all accounts
- Monthly income vs expenses comparison
- Spending by category (pie/bar charts)
- Recent transactions list
- Budget progress indicators

**Data Needed:**
- ✅ Account balances - `accounts-clean.json`
- ✅ Monthly income/expense totals - `stats.json`
- ✅ Category breakdowns - `categories-clean.json`
- ✅ Recent transactions - `transactions-clean.json`
- ⚠️  Budget data - **NEEDS TO BE ADDED**
- ⚠️  Trend data (multi-month comparison) - **NEEDS TO BE ADDED**

### 2. Transactions Page

**Features:**
- List all transactions with filtering
- Search by description
- Filter by date range, category, account, type
- Add/edit/delete transactions
- Transaction details view

**Data Needed:**
- ✅ All transactions with full details - `transactions-clean.json`
- ✅ Category list for filtering - `categories-clean.json`
- ✅ Account list for filtering - `accounts-clean.json`
- ⚠️  Transaction attachments/receipts - **NOT SUPPORTED YET**

### 3. Categories Page

**Features:**
- View expense categories with totals
- View income categories
- Hierarchical category display
- Add/edit/delete categories
- Category spending trends

**Data Needed:**
- ✅ Category hierarchy with totals - `categories-clean.json`
- ✅ Category breakdown by time period - Available via hledger
- ⚠️  Category budgets - **NEEDS TO BE ADDED**
- ⚠️  Category trends (month-over-month) - **NEEDS TO BE ADDED**

### 4. Accounts Page

**Features:**
- List all accounts with balances
- Account transaction history
- Add/edit/delete accounts
- Account types (checking, savings, credit card, etc.)

**Data Needed:**
- ✅ Account list with balances - `accounts-clean.json`
- ✅ Account transactions - Filter `transactions-clean.json` by account
- ⚠️  Account metadata (bank name, account number, etc.) - **NEEDS TO BE ADDED**

### 5. Reports / Analytics

**Features:**
- Income statement (profit & loss)
- Balance sheet (net worth)
- Spending trends over time
- Category comparison
- Monthly/yearly summaries

**Data Needed:**
- ✅ Monthly summary data - `monthlySummary` in finance-data.json
- ✅ Income statement data - Available via hledger
- ✅ Balance sheet data - Available via hledger
- ⚠️  Trend analysis data (6-month, 1-year) - **NEEDS TO BE ADDED**
- ⚠️  Comparison data (this month vs last month) - **NEEDS TO BE ADDED**

### 6. Budgets Page

**Features:**
- Set budget limits for categories
- Track budget progress
- Budget vs actual spending comparison
- Budget alerts/warnings

**Data Needed:**
- ⚠️  Budget definitions - **NEEDS TO BE ADDED**
- ⚠️  Budget tracking data - **NEEDS TO BE ADDED**

## Current Data Coverage

### ✅ What We Have

1. **Transactions Data** (`transactions-clean.json`)
   - Complete transaction history
   - Date, description, amount, type
   - Category and account assignment
   - Status (cleared/pending)

2. **Account Balances** (`accounts-clean.json`)
   - All asset and liability accounts
   - Current balances
   - Account hierarchy

3. **Category Data** (`categories-clean.json`)
   - Expense and income categories
   - Category totals
   - Hierarchical structure

4. **Dashboard Statistics** (`stats.json`)
   - Total income/expenses
   - Total assets/liabilities
   - Net worth
   - Current month summary

### ⚠️ What Needs to Be Added

1. **Budget Data**
   - Budget definitions per category
   - Budget amounts and periods
   - Budget tracking and alerts

2. **Trend Analysis Data**
   - Multi-month comparison data
   - Spending trends by category
   - Income trends
   - Month-over-month changes

3. **Enhanced Transaction Data**
   - Transaction tags for better filtering
   - Transaction attachments/receipts
   - Recurring transaction patterns

4. **Account Metadata**
   - Bank information
   - Account types/subtypes
   - Account goals

5. **Time-Series Data**
   - Daily/weekly/monthly aggregations
   - Historical balance data
   - Spending patterns

## Proposed Additional Data Files

### 1. `budgets.json`

```json
{
  "budgets": [
    {
      "id": "budget-1",
      "categoryId": "cat-food-groceries",
      "amount": 500,
      "period": "monthly",
      "startDate": "2024-01-01",
      "rollover": false,
      "alerts": {
        "warningThreshold": 80,
        "criticalThreshold": 95
      }
    }
  ],
  "tracking": {
    "2024-02": [
      {
        "budgetId": "budget-1",
        "spent": 387.95,
        "remaining": 112.05,
        "percentage": 77.6
      }
    ]
  }
}
```

### 2. `trends.json`

```json
{
  "generatedAt": "ISO timestamp",
  "monthly": [
    {
      "month": "2024-01",
      "income": 4500,
      "expenses": 2460.55,
      "savings": 2039.45,
      "categories": {
        "food": 322.07,
        "housing": 1920,
        "transport": 45
      }
    }
  ],
  "categoryTrends": [
    {
      "categoryId": "cat-food-groceries",
      "months": [
        { "month": "2024-01", "amount": 245.77 },
        { "month": "2024-02", "amount": 142.18 }
      ],
      "average": 193.98,
      "trend": "decreasing"
    }
  ]
}
```

### 3. `recurring-patterns.json`

```json
{
  "patterns": [
    {
      "id": "pattern-1",
      "description": "Monthly Rent",
      "category": "housing > rent",
      "amount": 1800,
      "frequency": "monthly",
      "dayOfMonth": 10,
      "account": "bank > checking",
      "nextDue": "2024-03-10"
    }
  ]
}
```

### 4. `account-metadata.json`

```json
{
  "accounts": [
    {
      "accountId": "assets-bank-checking",
      "metadata": {
        "institution": "Chase Bank",
        "accountNumber": "****1234",
        "accountType": "checking",
        "openDate": "2020-01-01",
        "interestRate": 0.01,
        "minimumBalance": 0,
        "notes": "Primary checking account"
      }
    }
  ]
}
```

## Implementation Plan

### Phase 1: Enhanced Existing Data ✅ COMPLETE
- ✅ Transaction transformation
- ✅ Account balance extraction
- ✅ Category aggregation
- ✅ Basic statistics

### Phase 2: Trend Analysis (RECOMMENDED)
- Generate monthly trend data
- Calculate category spending patterns
- Add month-over-month comparison
- Create spending forecasts

### Phase 3: Budget Support (RECOMMENDED)
- Implement budget data structure
- Create budget tracking system
- Add budget vs actual reporting
- Implement budget alerts

### Phase 4: Advanced Features (OPTIONAL)
- Recurring transaction detection
- Account metadata management
- Receipt attachment system
- Tag-based filtering

## Scripts to Create

### 1. `generate-trends.mjs` - Generate trend analysis data
```bash
node scripts/generate-trends.mjs [--months 6]
```

### 2. `generate-budgets.mjs` - Process budget data
```bash
node scripts/generate-budgets.mjs
```

### 3. `detect-recurring.mjs` - Detect recurring transactions
```bash
node scripts/detect-recurring.mjs
```

## hledger Budget Support

hledger has built-in budget support using periodic transactions:

```journal
~ monthly  Budget for groceries
    expenses:food:groceries    $500.00
    assets:bank:checking

~ monthly  Budget for rent
    expenses:housing:rent    $1800.00
    assets:bank:checking
```

View budget report:
```bash
hledger -f sample.journal balance --budget expenses
```

This can be leveraged to generate budget data automatically.

## Recommendations

Based on typical finance tracker requirements:

### MUST HAVE (for MVP):
1. ✅ Transaction data - DONE
2. ✅ Account balances - DONE
3. ✅ Category totals - DONE
4. ✅ Basic statistics - DONE

### SHOULD HAVE (for full-featured app):
5. ⚠️  Budget tracking - ADD THIS
6. ⚠️  Monthly trends (6-12 months) - ADD THIS
7. ⚠️  Spending patterns - ADD THIS

### NICE TO HAVE (for advanced features):
8. Recurring transaction detection
9. Receipt attachments
10. Account metadata
11. Forecasting/predictions

## Next Steps

1. **Review the v0 design** to identify specific features
2. **Decide which Phase 2+ features** are needed for your design
3. **Create additional scripts** for required data generation
4. **Extend the journal file** with budget data if needed
5. **Add sample data** for all required features

## Data Regeneration

To regenerate all data files:

```bash
cd /workspace/scripts
node transform-data.mjs
```

For continuous updates, set up a watch script or cron job.
