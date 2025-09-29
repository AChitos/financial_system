import { useState, useEffect } from 'react';
import { Plus, Target } from 'lucide-react';
import { Budget as BudgetType } from '@/types';
import { budgetApi } from '@/services/api';

const Budget = () => {
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: ''
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const data = await budgetApi.getAll();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    try {
      const budgetData = {
        name: newBudget.name,
        totalAmount: parseFloat(newBudget.amount),
        period: newBudget.period,
        startDate: new Date(newBudget.startDate).toISOString(),
        endDate: newBudget.endDate ? new Date(newBudget.endDate).toISOString() : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        categories: [{
          categoryId: newBudget.category,
          categoryName: newBudget.category,
          allocatedAmount: parseFloat(newBudget.amount),
          spentAmount: 0,
          remainingAmount: parseFloat(newBudget.amount),
          percentage: 100
        }],
        isActive: true
      };
      await budgetApi.create(budgetData);
      setShowCreateModal(false);
      setNewBudget({
        name: '',
        category: '',
        amount: '',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: ''
      });
      fetchBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-gradient">Budget</h1>
          <p className="text-gray-600 mt-2">Plan and track your spending across categories</p>
        </div>
        
        <div className="card-hover text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Target className="w-20 h-20 text-purple-600 mx-auto mb-6 animate-pulse-soft" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create Your First Budget</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Set up budgets for different categories and track your spending against your goals.
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3"
          >
            <Plus className="w-6 h-6" />
            <span>Create Your First Budget</span>
          </button>
        </div>

        {/* Create Budget Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Budget</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Name</label>
                  <input
                    type="text"
                    value={newBudget.name}
                    onChange={(e) => setNewBudget({...newBudget, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Monthly Food Budget"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select category</option>
                    <option>Food & Groceries</option>
                    <option>Entertainment</option>
                    <option>Transportation</option>
                    <option>Healthcare</option>
                    <option>Shopping</option>
                    <option>Utilities</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                  <select
                    value={newBudget.period}
                    onChange={(e) => setNewBudget({...newBudget, period: e.target.value as 'monthly' | 'weekly' | 'yearly'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newBudget.startDate}
                    onChange={(e) => setNewBudget({...newBudget, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={newBudget.endDate}
                    onChange={(e) => setNewBudget({...newBudget, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newBudget.description}
                    onChange={(e) => setNewBudget({...newBudget, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBudget}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  Create Budget
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Budget</h1>
          <p className="text-gray-600 mt-2">Plan and track your spending across categories</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Budget</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget, index) => {
          const category = budget.categories[0] || { spentAmount: 0, allocatedAmount: budget.totalAmount, remainingAmount: budget.totalAmount };
          const spentPercentage = Math.min((category.spentAmount / category.allocatedAmount) * 100, 100);
          const isOverBudget = category.spentAmount > category.allocatedAmount;
          
          return (
            <div key={budget.id} className="card-hover animate-slide-up" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-sm">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full">{budget.period}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{budget.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.categoryName || 'General'}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium">${budget.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-orange-600'}`}>
                    ${category.spentAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className={`font-medium ${category.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${Math.max(category.remainingAmount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : ''}`}
                    style={{ width: `${spentPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{Math.round(spentPercentage)}% used</span>
                  <span className={isOverBudget ? 'text-red-500 font-medium' : ''}>
                    {isOverBudget ? 'Over budget!' : 'On track'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budget;