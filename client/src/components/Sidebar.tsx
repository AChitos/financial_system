import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  PiggyBank, 
  BarChart3, 
  Target, 
  Settings, 
  Receipt,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ArrowUpDown, label: 'Transactions', path: '/transactions' },
    { icon: PiggyBank, label: 'Budget', path: '/budget' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: Receipt, label: 'Receipt Processor', path: '/receipt-processor' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">F</span>
        </div>
        <span className="ml-3 text-xl font-bold text-gray-800">FinSet</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.businessName || 'Personal'}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;