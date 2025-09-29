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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Manage widgets</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            <span>Add new widget</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats?.totalBalance || 15700)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  {formatPercentage(stats?.monthlyChange.balance || 12.1)}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Income</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats?.totalIncome || 8500)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  {formatPercentage(stats?.monthlyChange.income || 6.3)}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expense</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats?.totalExpenses || 6222)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">
                  {formatPercentage(stats?.monthlyChange.expenses || 2.4)}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total savings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats?.totalSavings || 32913)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  {formatPercentage(stats?.monthlyChange.savings || 12.1)}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Money Flow Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Money flow</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Expense</span>
              </div>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>All accounts</option>
                <option>Checking</option>
                <option>Savings</option>
              </select>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option>This year</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
            <button>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">$5,950</span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
          </div>

          <div className="space-y-3">
            {categoryExpenses.slice(0, 4).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{category.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(category.amount)}
                  </span>
                  <div className="text-xs text-gray-500">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent transactions</h3>
            <Link 
              to="/transactions"
              className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
            >
              <span>See all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-medium text-sm">
                      {transaction.description.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saving Goals */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Saving goals</h3>
            <button>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">MacBook Pro</h4>
                <span className="text-sm text-purple-600">22%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '22%' }}></div>
              </div>
              <p className="text-sm text-gray-600">$1,650 of $7,500</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">New car</h4>
                <span className="text-sm text-blue-600">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-sm text-gray-600">$40,800 of $60,000</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">New house</h4>
                <span className="text-sm text-green-600">3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '3%' }}></div>
              </div>
              <p className="text-sm text-gray-600">$4,500 of $150,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;