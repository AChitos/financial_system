const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Deep insights into your financial patterns</p>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-card text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Analytics</h2>
        <p className="text-gray-600 mb-6">
          Get detailed reports and insights about your income, expenses, and spending patterns.
        </p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Generate Reports
        </button>
      </div>
    </div>
  );
};

export default Analytics;