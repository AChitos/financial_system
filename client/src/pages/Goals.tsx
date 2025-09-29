const Goals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
        <p className="text-gray-600 mt-1">Set and track your financial objectives</p>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-card text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Savings Goals</h2>
        <p className="text-gray-600 mb-6">
          Create savings goals for major purchases, emergency funds, and long-term objectives.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Create New Goal
        </button>
      </div>
    </div>
  );
};

export default Goals;