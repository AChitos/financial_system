import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank,
  ArrowRight,
  Calendar,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { dashboardApi } from '@/services/api';
import { DashboardStats, Transaction, MonthlyData, CategoryExpense } from '@/types';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsData, transactionsData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentTransactions(5)
      ]);
      
      setStats(statsData);
      setRecentTransactions(transactionsData);
      
      // Mock data for charts - in real app this would come from API
      setMonthlyData([
        { month: 'Jan', income: 8500, expenses: 6200, balance: 15700 },
        { month: 'Feb', income: 8200, expenses: 5800, balance: 16100 },
        { month: 'Mar', income: 8800, expenses: 6500, balance: 16400 },
        { month: 'Apr', income: 9200, expenses: 6800, balance: 16800 },
        { month: 'May', income: 8700, expenses: 6400, balance: 17100 },
        { month: 'Jun', income: 8500, expenses: 6222, balance: 15700 },
      ]);

      setCategoryExpenses([
        { category: 'Cafe & Restaurants', amount: 1200, percentage: 19.3, color: '#8B5CF6' },
        { category: 'Entertainment', amount: 800, percentage: 12.9, color: '#06B6D4' },
        { category: 'Investments', amount: 1500, percentage: 24.1, color: '#10B981' },
        { category: 'Food & Groceries', amount: 950, percentage: 15.3, color: '#F59E0B' },
        { category: 'Health & Beauty', amount: 600, percentage: 9.6, color: '#EF4444' },
        { category: 'Traveling', amount: 1172, percentage: 18.8, color: '#EC4899' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const lineChartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(data => data.income),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(data => data.expenses),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const doughnutChartData = {
    labels: categoryExpenses.map(cat => cat.category),
    datasets: [
      {
        data: categoryExpenses.map(cat => cat.amount),
        backgroundColor: categoryExpenses.map(cat => cat.color),
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '70%',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1>Dashboard Loaded Successfully!</h1>
      <p>Welcome to your financial dashboard.</p>
      <p>Stats loaded: {stats ? 'Yes' : 'No'}</p>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default Dashboard;