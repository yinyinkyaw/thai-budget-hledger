# FinTrack - Personal Expense Tracker

A beautiful, modern finance dashboard powered by **hledger** and built with **Astro**, **React**, and **shadcn/ui**.

![FinTrack Dashboard](https://img.shields.io/badge/Status-Active-success)
![hledger](https://img.shields.io/badge/hledger-Integrated-blue)
![Astro](https://img.shields.io/badge/Astro-5.17-orange)
![React](https://img.shields.io/badge/React-19.2-blue)

## ✨ Features

- 📊 **Real-time Dashboard** - View your financial data in a clean, modern interface
- 💰 **Income & Expense Tracking** - Automatic categorization from hledger
- 📅 **Multi-Month Calendar** - Navigate through months easily
- 📋 **Transaction Table** - Searchable, filterable transaction list
- 🔄 **Auto-refresh** - Watch your journal file and update automatically
- 🎨 **Beautiful UI** - Built with shadcn/ui components and Tailwind CSS
- 💱 **Multi-currency Support** - Display amounts in THB or any currency

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Dashboard

```bash
npm run dev
```

Visit **http://localhost:4323**

### 3. Add Transactions

```bash
hledger add
```

### 4. Refresh Data

**Option A - Auto-refresh (Recommended):**
```bash
# Terminal 1
npm run data:watch

# Terminal 2
npm run dev
```

**Option B - Manual refresh:**
```bash
npm run data:refresh
```

## 📁 Project Structure

```
thai-budgets/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Header.tsx       # Top navigation
│   │   ├── ExpenseIncomeCards.tsx
│   │   ├── MultiMonthCalendar.tsx
│   │   ├── TransactionsTable.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── layouts/
│   │   └── Layout.astro     # Main layout
│   ├── pages/
│   │   └── index.astro      # Entry point
│   └── styles/
│       └── global.css       # Global styles
├── scripts/
│   ├── transform-hledger-data.mjs  # Data transformation
│   └── watch-journal.mjs           # Auto-refresh watcher
├── data/                    # Generated data files
├── public/                  # Static assets
└── .hledger.journal        # Your hledger journal
```

## 📊 Current Stats

Based on your `.hledger.journal`:

- **Total Balance**: 12,128.97 THB
- **Total Income**: 31,303.85 THB
- **Total Expenses**: 19,174.88 THB
- **Transactions**: 19
- **Accounts**: 3 (bank, cash, wallet)
- **Categories**: 6 expense, 1 income

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Data Management
npm run data:refresh     # Refresh data from hledger
npm run data:watch       # Watch journal and auto-refresh

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Legacy Scripts
npm run finance:generate  # Generate all finance data
npm run finance:transform # Transform raw data
npm run finance:trends    # Generate trend analysis
npm run finance:budgets   # Generate budget tracking
```

## 📖 Documentation

- **[QUICK_USAGE.md](./QUICK_USAGE.md)** - Quick start guide
- **[DATA_REFRESH.md](./DATA_REFRESH.md)** - Data refresh workflow
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🔧 Configuration

### Environment Variables

Set your journal file location:

```bash
export LEDGER_FILE="/Users/yin/Desktop/notes-folder/thai-budgets/.hledger.journal"
```

Add to your `~/.zshrc` or `~/.bashrc` to make it permanent.

### hledger Setup

Your journal file should be at:
```
/Users/yin/Desktop/notes-folder/thai-budgets/.hledger.journal
```

## 💡 Usage Examples

### Add an Expense

```bash
hledger add
```

```
2026-02-10 Coffee
    expenses:food:drinks     120 THB
    assets:bank             -120 THB
```

### Add Income

```bash
hledger add
```

```
2026-02-10 Salary
    assets:bank           50000 THB
    income:salary        -50000 THB
```

### View Balance

```bash
hledger balance
```

### Check for Errors

```bash
hledger check
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/):
- Card
- Button
- Table
- Badge
- And more...

## 🚀 Tech Stack

- **[Astro](https://astro.build/)** - Web framework
- **[React](https://react.dev/)** - UI library
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[hledger](https://hledger.org/)** - Accounting system
- **[Lucide Icons](https://lucide.dev/)** - Icons

## 📝 License

ISC

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 🙏 Acknowledgments

- hledger community for the amazing accounting tool
- shadcn for the beautiful UI components
- Astro team for the excellent web framework

---

**Made with ❤️ for personal finance tracking**
