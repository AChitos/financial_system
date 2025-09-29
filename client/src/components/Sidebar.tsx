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
    <div className="bg-white/80 backdrop-blur-md h-screen w-64 shadow-xl flex flex-col border-r border-white/20">
      {/* Logo */}
      <div className="flex items-center px-6 py-5 border-b border-gray-200/50">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-soft">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <span className="ml-3 text-xl font-bold text-gradient">FinSet</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path} className="animate-slide-up" style={{animationDelay: `${0.1 + index * 0.05}s`}}>
                <NavLink
                  to={item.path}
                  className={`
                    sidebar-item group
                    ${isActive ? 'sidebar-item-active' : ''}
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-purple-600' : 'text-gray-500 group-hover:text-purple-600'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="px-4 py-5 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="flex items-center mb-4 p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-white/40">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.businessName || 'Personal Account'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 hover:translate-x-1 group"
        >
          <LogOut className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;