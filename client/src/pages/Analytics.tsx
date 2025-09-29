import { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

const Analytics = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };

  const downloadReport = () => {
    // Create a simple report
    const reportData = {
      title: 'Financial Analytics Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalIncome: 8500,
        totalExpenses: 6222,
        netSavings: 2278,
        topCategories: [
          { name: 'Food & Groceries', amount: 1200 },
          { name: 'Transportation', amount: 800 },
          { name: 'Entertainment', amount: 600 }
        ]
      }
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (reportGenerated) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Report</h1>
            <p className="text-gray-600 mt-1">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <button
            onClick={downloadReport}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 inline-flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">$8,500</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">$6,222</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Savings</p>
                <p className="text-2xl font-bold text-purple-600">$2,278</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Food & Groceries</span>
              <span className="font-medium">$1,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Transportation</span>
              <span className="font-medium">$800</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Entertainment</span>
              <span className="font-medium">$600</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setReportGenerated(false)}
            className="text-purple-600 hover:text-purple-700"
          >
            Generate New Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Deep insights into your financial patterns</p>
      </div>
      
      <div className="bg-white rounded-xl p-8 shadow-card text-center">
        <BarChart3 className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Analytics</h2>
        <p className="text-gray-600 mb-6">
          Get detailed reports and insights about your income, expenses, and spending patterns.
        </p>
        <button 
          onClick={generateReport}
          disabled={isGenerating}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              <span>Generate Reports</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Analytics;