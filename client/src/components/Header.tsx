import { useState } from 'react';
import { Search, Bell, Plus, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const Header = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Mock notification count

  const currentDate = new Date();
  const greeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Message */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            It is the best time to manage your finances
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Current Date */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {format(currentDate, 'MMM dd, yyyy')}
            </span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Add Transaction Button */}
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;