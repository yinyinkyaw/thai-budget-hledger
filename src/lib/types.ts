export type TransactionType = "income" | "expense";
export type TransactionStatus = "completed" | "pending" | "cancelled";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  status: TransactionStatus;
  wallet: string;
}

export interface Wallet {
  id: string;
  name: string;
}
