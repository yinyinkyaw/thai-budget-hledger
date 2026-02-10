# Finance Tracker Scripts

This directory contains all the data generation and transformation scripts for the finance tracker.

## 📁 Scripts Overview

| Script | Purpose | Usage |
|--------|---------|-------|
| **generate-all.mjs** | Master script - runs all generators | `node generate-all.mjs` |
| **transform-data.mjs** | Transform hledger JSON to clean format | `node transform-data.mjs` |
| **generate-trends.mjs** | Generate trend analysis | `node generate-trends.mjs [months]` |
| **generate-budgets.mjs** | Generate budget tracking | `node generate-budgets.mjs` |
| **generate-transactions-json.sh** | Export transactions to JSON | `./generate-transactions-json.sh` |
| **generate-summary-json.mjs** | Generate summary data | `node generate-summary-json.mjs` |

## 🚀 Quick Commands

### Generate All Data (Recommended)

```bash
# From project root
npm run finance:generate

# Or from scripts directory
node generate-all.mjs
```

### Individual Scripts

```bash
# Transform hledger data to clean JSON
npm run finance:transform
# or: node transform-data.mjs

# Generate trend analysis (default: 12 months)
npm run finance:trends
# or: node generate-trends.mjs 6  # for 6 months

# Generate budget tracking
npm run finance:budgets
# or: node generate-budgets.mjs
```

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   sample.journal                            │
│              (Plain text source data)                       │
│                                                             │
│  2024-01-07 * Whole Foods                                   │
│      expenses:food:groceries    $156.32                     │
│      assets:bank:checking                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    hledger CLI                              │
│              (Query and export data)                        │
│                                                             │
│  hledger -f sample.journal print -O json                    │
│  hledger -f sample.journal balance                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Transformation Scripts                         │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ transform-data   │  │ generate-trends  │               │
│  └──────────────────┘  └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ generate-budgets │  │ generate-summary │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  JSON Data Files                            │
│                                                             │
│  ├── finance-data.json (main file)                         │
│  ├── transactions-clean.json                               │
│  ├── accounts-clean.json                                   │
│  ├── categories-clean.json                                 │
│  ├── stats.json                                            │
│  ├── trends.json                                           │
│  └── budgets.json                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend                             │
│                                                             │
│  import data from './data/finance-data.json'               │
│  <Dashboard stats={data.stats} />                          │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Script Details

### generate-all.mjs

**Purpose**: Master script that runs all data generation scripts in sequence.

**What it does**:
1. Runs `transform-data.mjs` to generate clean data
2. Runs `generate-trends.mjs` to analyze trends
3. Runs `generate-budgets.mjs` to track budgets
4. Reports success/failure for each script

**Output**:
- All JSON data files in `data/` directory
- Console summary of what was generated

### transform-data.mjs

**Purpose**: Core transformation script that converts hledger's JSON output to clean, frontend-friendly format.

**What it does**:
1. Reads raw hledger JSON data
2. Transforms transactions with proper typing
3. Extracts account balances
4. Calculates category totals
5. Generates dashboard statistics
6. Combines everything into `finance-data.json`

**Output files**:
- `data/finance-data.json` - Complete dataset
- `data/transactions-clean.json` - Clean transactions
- `data/accounts-clean.json` - Account balances
- `data/categories-clean.json` - Category totals
- `data/stats.json` - Dashboard stats

**Functions**:
- `extractAmount()` - Extract numeric amount from hledger's complex structure
- `transformTransactions()` - Convert raw transactions to clean format
- `transformAccounts()` - Extract account balances
- `transformExpenseCategories()` - Parse expense categories
- `transformIncomeCategories()` - Parse income categories
- `generateDashboardStats()` - Calculate summary statistics

### generate-trends.mjs

**Purpose**: Analyze spending patterns and generate trend data over time.

**What it does**:
1. Analyzes monthly income and expenses
2. Tracks category-specific trends
3. Identifies spending patterns by day/week
4. Generates month-over-month comparisons

**Options**:
```bash
node generate-trends.mjs [months]
# Default: 12 months
# Example: node generate-trends.mjs 6  # analyze last 6 months
```

**Output**:
- `data/trends.json`

**Contains**:
- Monthly income/expense trends
- Category spending trends
- Spending patterns (by day of month, day of week)
- Comparison data (current vs previous month)

### generate-budgets.mjs

**Purpose**: Track budget adherence and generate budget reports.

**What it does**:
1. Loads budget configuration from `budgets-config.json`
2. Calculates actual spending for each budget category
3. Compares actual vs budget amounts
4. Generates status (OK, warning, critical)
5. Creates monthly tracking history

**Configuration**:
Edit `data/budgets-config.json` to customize budgets:
```json
{
  "budgets": [
    {
      "id": "budget-groceries",
      "category": "expenses:food:groceries",
      "amount": 500,
      "period": "monthly",
      "alerts": {
        "warningThreshold": 80,
        "criticalThreshold": 95
      }
    }
  ]
}
```

**Output**:
- `data/budgets.json` - Budget tracking data
- `data/budgets-config.json` - Configuration (if doesn't exist)

**Status Colors**:
- **OK** (green): < 80% of budget used
- **Warning** (yellow): 80-95% of budget used
- **Critical** (red): > 95% of budget used

### generate-transactions-json.sh

**Purpose**: Simple shell script to export transactions from hledger.

**Usage**:
```bash
./generate-transactions-json.sh [journal-file] [output-file]
```

**Default**:
```bash
./generate-transactions-json.sh ../data/sample.journal ../data/transactions.json
```

### generate-summary-json.mjs

**Purpose**: Generate comprehensive summary data from hledger.

**What it does**:
1. Exports account balances
2. Exports monthly summaries
3. Exports category breakdowns
4. Exports recent transactions

**Output**:
- `data/summary.json` - Raw hledger summary data

**Note**: This generates raw hledger JSON. Use `transform-data.mjs` for clean data.

## 🔄 Typical Workflow

### Initial Setup

```bash
# 1. Generate all data for the first time
npm run finance:generate
```

### Daily Development

```bash
# 2. Make changes to journal file
vim data/sample.journal

# 3. Regenerate data
npm run finance:generate

# 4. Frontend automatically uses new data
```

### Customizing Budgets

```bash
# 1. Edit budget configuration
vim data/budgets-config.json

# 2. Regenerate budgets
npm run finance:budgets

# 3. Check results
cat data/budgets.json
```

## ⚙️ Configuration

### Environment Variables

None required. All scripts use relative paths.

### Dependencies

- **Node.js** ≥ 22 (specified in package.json)
- **hledger** - Installed at `/usr/local/bin/hledger`

### File Paths

Scripts assume the following structure:
```
/workspace/
├── scripts/          # Scripts are here
└── data/            # Data files are here
```

## 🐛 Troubleshooting

### "hledger: command not found"

```bash
# Check if hledger is installed
which hledger

# If not installed, reinstall:
cd /tmp
curl -sL https://github.com/simonmichael/hledger/releases/download/1.32.3/hledger-linux-x64.zip -o hledger.zip
unzip hledger.zip
tar -xf hledger-linux-x64.tar
chmod +x hledger
sudo mv hledger /usr/local/bin/
```

### "Cannot find module"

```bash
# Make sure you're running from the scripts directory
cd /workspace/scripts
node generate-all.mjs
```

### "Permission denied"

```bash
# Make scripts executable
chmod +x /workspace/scripts/*.sh
chmod +x /workspace/scripts/*.mjs
```

### Empty or Missing Data

```bash
# Check journal file exists
ls -la /workspace/data/sample.journal

# Regenerate all data
npm run finance:generate

# Check output
ls -la /workspace/data/*.json
```

## 📝 Adding New Scripts

To add a new data generation script:

1. Create the script in `/workspace/scripts/`
2. Make it executable: `chmod +x your-script.mjs`
3. Add it to `generate-all.mjs` if it should run automatically
4. Add an npm script to `/workspace/package.json`
5. Document it in this README

Example template:

```javascript
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DATA_DIR = path.join(process.cwd(), '../data');
const JOURNAL_FILE = path.join(DATA_DIR, 'sample.journal');

function runHledger(args) {
  try {
    return execSync(`hledger -f "${JOURNAL_FILE}" ${args}`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    }).trim();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Generating data...');
  
  // Your logic here
  
  const output = {
    // Your data structure
  };
  
  const outputFile = path.join(DATA_DIR, 'your-data.json');
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  
  console.log(`✓ Data saved to ${outputFile}`);
}

main();
```

## 🔗 Related Documentation

- **FINANCE_TRACKER_SUMMARY.md** - Complete architecture guide
- **DATA_PLANNING.md** - Data requirements and planning
- **data/README.md** - Data file documentation
- **QUICK_START.md** - Quick start guide

---

**Questions?** Check the main documentation files or hledger docs at https://hledger.org/
