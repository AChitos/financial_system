interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'blue' | 'green' | 'gray';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({
  size = 'md',
  color = 'purple',
  message,
  fullScreen = false
}: LoadingSpinnerProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    purple: 'border-purple-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    gray: 'border-gray-600'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}></div>
        {/* Inner ring for larger sizes */}
        {size === 'lg' && (
          <div className="absolute inset-1 border border-purple-300 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
        )}
        {/* Glow effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-pulse opacity-20`}></div>
      </div>

      {message && (
        <div className="text-center">
          <p className="text-gray-600 font-medium">{message}</p>
          <p className="text-gray-400 text-sm mt-1">Loading{dots}</p>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;