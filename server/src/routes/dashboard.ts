import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { protect } from '../middleware/auth';

const router = express.Router();

const getTransactionsFilePath = () => path.join(__dirname, '../../data/transactions.json');
const getBudgetsFilePath = () => path.join(__dirname, '../../data/budgets.json');
const getGoalsFilePath = () => path.join(__dirname, '../../data/goals.json');

const readTransactions = () => {
  try {
    const data = readFileSync(getTransactionsFilePath(), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const readBudgets = () => {
  try {
    const data = readFileSync(getBudgetsFilePath(), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const readGoals = () => {
  try {
    const data = readFileSync(getGoalsFilePath(), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, (req: any, res) => {
  try {
    const transactions = readTransactions().filter((t: any) => t.userId === req.user.id);
    const goals = readGoals().filter((g: any) => g.userId === req.user.id);

    // Calculate stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter((t: any) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const lastMonthTransactions = transactions.filter((t: any) => {
      const transactionDate = new Date(t.date);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return transactionDate.getMonth() === lastMonth && 
             transactionDate.getFullYear() === lastMonthYear;
    });

    const totalIncome = currentMonthTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const lastMonthIncome = lastMonthTransactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;
    const lastMonthBalance = lastMonthIncome - lastMonthExpenses;

    const totalSavings = goals.reduce((sum: number, g: any) => sum + g.currentAmount, 0);

    // Calculate percentage changes
    const incomeChange = lastMonthIncome > 0 ? 
      ((totalIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
    const expenseChange = lastMonthExpenses > 0 ? 
      ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
    const balanceChange = lastMonthBalance !== 0 ? 
      ((totalBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100 : 0;

    const stats = {
      totalBalance,
      totalIncome,
      totalExpenses,
      totalSavings,
      monthlyChange: {
        balance: balanceChange,
        income: incomeChange,
        expenses: expenseChange,
        savings: 12.1 // Mock data for now
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get recent transactions
// @route   GET /api/dashboard/recent-transactions
// @access  Private
router.get('/recent-transactions', protect, (req: any, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const transactions = readTransactions()
      .filter((t: any) => t.userId === req.user.id)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    res.json(transactions);
  } catch (error) {
    console.error('Recent transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;