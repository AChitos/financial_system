import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const user = await authApi.verifyToken();
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          Cookies.remove('auth_token');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const { user, token } = await authApi.login(credentials);
      Cookies.set('auth_token', token, { expires: 7 });
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success('Welcome back!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const { user, token } = await authApi.register(data);
      Cookies.set('auth_token', token, { expires: 7 });
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};