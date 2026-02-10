# Quick Usage Guide

## 🚀 Getting Started

Your FinTrack dashboard is now connected to your hledger data!

### Start the Dashboard

```bash
npm run dev
```

Visit: **http://localhost:4323**

## 📊 View Your Real Data

The dashboard now shows:

- ✅ **Total Balance**: 12,128.97 THB (your net worth)
- ✅ **Total Income**: 31,303.85 THB
- ✅ **Total Expenses**: 19,174.88 THB
- ✅ **19 Transactions** from your `.hledger.journal`

## 📝 Add New Transactions

### Method 1: Using hledger CLI

```bash
hledger add
```

Then refresh the data:

```bash
npm run data:refresh
```

### Method 2: Auto-refresh (Recommended)

**Terminal 1** - Start the watcher:
```bash
npm run data:watch
```

**Terminal 2** - Start the dev server:
```bash
npm run dev
```

Now when you run `hledger add`, the dashboard updates automatically! 🎉

## 💡 Tips

### Quick Commands

```bash
# View current balance
hledger balance

# View all transactions
hledger print

# Check journal for errors
hledger check

# Refresh dashboard data
npm run data:refresh
```

### Transaction Format

Your transactions should look like this:

**Expense:**
```
2026-02-10 Lunch
    expenses:food:meal       150 THB
    assets:bank             -150 THB
```

**Income:**
```
2026-02-10 Salary
    assets:bank           50000 THB
    income:salary        -50000 THB
```

**Transfer (not counted as income/expense):**
```
2026-02-10 Transfer to wallet
    assets:wallet        1000 THB
    assets:bank         -1000 THB
```

## 🎯 Current Status

Your journal has:
- **3 accounts**: bank, cash, wallet
- **6 expense categories**: food, shopping, bills, bodycare, healthcare, rents&utilities
- **1 income category**: start (from equity:start)

## 🔧 Troubleshooting

**Dashboard shows "Loading..." forever?**
- Check browser console for errors
- Verify `public/data/finance-data.json` exists
- Run `npm run data:refresh`

**Data not updating?**
- Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check if `data:watch` is running
- Manually run `npm run data:refresh`

**Income not showing?**
- Use `income:*` accounts for income
- Or use `equity:start` for initial balances
- Avoid transfers between asset accounts

## 📚 More Info

- **Full guide**: See `DATA_REFRESH.md`
- **Implementation details**: See `IMPLEMENTATION_SUMMARY.md`
- **hledger docs**: https://hledger.org/

## 🎉 You're All Set!

Your personal finance tracker is ready to use. Add transactions with `hledger add` and watch them appear in your beautiful dashboard!
