import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank,
  ArrowRight,
  Calendar,
  Filter,
  Receipt,
  ArrowUpDown,
  Target,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { dashboardApi } from '@/services/api';
import { DashboardStats, Transaction } from '@/types';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This month');
  const [isLoading, setIsLoading] = useState(true);
  const [showWidgetManager, setShowWidgetManager] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    financialOverview: true,
    recentTransactions: true,
    quickActions: true,
    spendingChart: false,
    budgetTracker: false,
    goalProgress: false,
    cashFlow: false
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-soft">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field max-w-xs"
            >
              <option>This month</option>
              <option>Last month</option>
              <option>This year</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowWidgetManager(true)}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Manage widgets
          </button>
          <button 
            onClick={() => setShowAddWidget(true)}
            className="btn-primary"
          >
            Add new widget
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {visibleWidgets.financialOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          <div className="stat-card animate-slide-up" style={{animationDelay: '0.1s'}}>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{animationDelay: '0.2s'}}>
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center shadow-sm">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expense</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats?.totalExpenses || 6222)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">
                    {formatPercentage(stats?.monthlyChange.expenses || -4.2)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center shadow-sm">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Savings</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats?.totalSavings || 2278)}
                </p>
                <div className="flex items-center mt-2">
                  <PiggyBank className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-500">
                    {formatPercentage(stats?.monthlyChange.savings || 8.7)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-sm">
                <PiggyBank className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        {visibleWidgets.recentTransactions && (
          <div className="card-hover animate-slide-up" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent transactions</h3>
              <Link 
                to="/transactions"
                className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                <span>See all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 animate-slide-up" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-purple-600 font-medium text-sm">
                        {transaction.description.charAt(0).toUpperCase()}
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
        )}

        {/* Quick Actions */}
        {visibleWidgets.quickActions && (
          <div className="card-hover animate-slide-up" style={{animationDelay: '0.7s'}}>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/receipt-processor"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
              >
                <Receipt className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">Scan receipt</span>
              </Link>
              <Link
                to="/transactions"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
              >
                <ArrowUpDown className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">Add transaction</span>
              </Link>
              <Link
                to="/budget"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gradient-to-br hover:from-green-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
              >
                <PiggyBank className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">Set budget</span>
              </Link>
              <Link
                to="/goals"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gradient-to-br hover:from-orange-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
              >
                <Target className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">Set goal</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Widget Manager Modal */}
      {showWidgetManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Manage Dashboard Widgets</h3>
              <button
                onClick={() => setShowWidgetManager(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Available Widgets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">Financial Overview</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">Recent Transactions</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">Quick Actions</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-sm font-medium">Spending Chart</span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Widget Layout</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                    <select className="input-field">
                      <option>Auto</option>
                      <option>1 Column</option>
                      <option>2 Columns</option>
                      <option>3 Columns</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Widget Size</label>
                    <select className="input-field">
                      <option>Medium</option>
                      <option>Small</option>
                      <option>Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowWidgetManager(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowWidgetManager(false)}
                className="flex-1 btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Widget</h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Widget Type</label>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200">
                    <input type="radio" name="widgetType" value="spending-chart" className="w-4 h-4 text-purple-600 mr-3" />
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Spending Chart</div>
                      <div className="text-sm text-gray-500">Visualize your spending patterns</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200">
                    <input type="radio" name="widgetType" value="budget-tracker" className="w-4 h-4 text-purple-600 mr-3" />
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Budget Tracker</div>
                      <div className="text-sm text-gray-500">Monitor budget progress</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200">
                    <input type="radio" name="widgetType" value="goal-progress" className="w-4 h-4 text-purple-600 mr-3" />
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <PiggyBank className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Goal Progress</div>
                      <div className="text-sm text-gray-500">Track savings goals</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200">
                    <input type="radio" name="widgetType" value="cash-flow" className="w-4 h-4 text-purple-600 mr-3" />
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Cash Flow</div>
                      <div className="text-sm text-gray-500">Income vs expenses over time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddWidget(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddWidget(false)}
                className="flex-1 btn-primary"
              >
                Add Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;