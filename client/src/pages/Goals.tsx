import { useState, useEffect } from 'react';
import { Plus, Target, Calendar } from 'lucide-react';
import { SavingsGoal } from '@/types';
import { goalsApi } from '@/services/api';

const Goals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const data = await goalsApi.getAll();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    try {
      const goalData = {
        name: newGoal.name,
        description: newGoal.description,
        targetAmount: parseFloat(newGoal.targetAmount),
        targetDate: new Date(newGoal.targetDate).toISOString(),
        priority: newGoal.priority,
        currentAmount: 0,
        category: newGoal.category,
        isCompleted: false,
        progress: 0
      };
      await goalsApi.create(goalData);
      setShowCreateModal(false);
      setNewGoal({
        name: '',
        description: '',
        targetAmount: '',
        targetDate: '',
        priority: 'medium',
        category: ''
      });
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold text-gradient">Savings Goals</h1>
          <p className="text-gray-600 mt-2">Set and track your financial objectives</p>
        </div>

        <div className="card-hover text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Target className="w-20 h-20 text-purple-600 mx-auto mb-6 animate-pulse-soft" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create Your First Savings Goal</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Set savings goals for major purchases, emergency funds, and long-term objectives.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3"
          >
            <Plus className="w-6 h-6" />
            <span>Create New Goal</span>
          </button>
        </div>

        {/* Create Goal Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Savings Goal</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select category</option>
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Car">Car</option>
                    <option value="Home">Home</option>
                    <option value="Education">Education</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Investment">Investment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
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
                  onClick={handleCreateGoal}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  Create Goal
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
          <h1 className="text-3xl font-bold text-gradient">Savings Goals</h1>
          <p className="text-gray-600 mt-2">Set and track your financial objectives</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const remaining = goal.targetAmount - goal.currentAmount;
          const isCompleted = progress >= 100;

          return (
            <div key={goal.id} className="card-hover animate-slide-up" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-100 to-green-200'
                    : 'bg-gradient-to-br from-purple-100 to-purple-200'
                }`}>
                  <Target className={`w-6 h-6 ${isCompleted ? 'text-green-600' : 'text-purple-600'}`} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.priority === 'high' ? 'bg-red-100 text-red-600' :
                    goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {goal.priority}
                  </span>
                  {isCompleted && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                      ✓ Complete
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.name}</h3>
              {goal.description && (
                <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Saved</span>
                  <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target</span>
                  <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining</span>
                  <span className={`font-medium ${remaining <= 0 ? 'text-green-600' : 'text-purple-600'}`}>
                    {formatCurrency(Math.max(0, remaining))}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${
                      isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      progress >= 75 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{Math.round(progress)}% complete</span>
                  <span className={isCompleted ? 'text-green-600 font-medium' : ''}>
                    {isCompleted ? '🎉 Achieved!' : `${Math.round(100 - progress)}% to go`}
                  </span>
                </div>
              </div>

              {goal.targetDate && (
                <div className="flex items-center mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                  <Calendar className="w-3 h-3 mr-2" />
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;