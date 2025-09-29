export interface Budget {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  categoryId: string;
  categoryName: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  progress: number;
  monthlyTarget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  monthlyChange: {
    balance: number;
    income: number;
    expenses: number;
    savings: number;
  };
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}