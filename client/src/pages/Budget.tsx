const Budget = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
        <p className="text-gray-600 mt-1">Plan and track your spending across categories</p>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-card text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Management</h2>
        <p className="text-gray-600 mb-6">
          Set up budgets for different categories and track your spending against your goals.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Create Your First Budget
        </button>
      </div>
    </div>
  );
};

export default Budget;