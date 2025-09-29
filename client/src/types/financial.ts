export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check' | 'other';
  account: string;
  tags?: string[];
  receiptUrl?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  isTaxDeductible: boolean;
  isBusinessExpense: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  endAfterOccurrences?: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault: boolean;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  isDefault: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}