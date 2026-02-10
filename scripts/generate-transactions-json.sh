#!/bin/bash

# Script to generate transactions JSON from hledger journal file
# Usage: ./generate-transactions-json.sh <journal-file> <output-file>

JOURNAL_FILE=${1:-"../data/sample.journal"}
OUTPUT_FILE=${2:-"../data/transactions.json"}

echo "Generating transactions JSON from $JOURNAL_FILE..."

# Get all transactions in JSON format
hledger -f "$JOURNAL_FILE" print -O json > "$OUTPUT_FILE"

echo "Transactions saved to $OUTPUT_FILE"
