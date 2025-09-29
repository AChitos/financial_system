import api from './axios';
import { User, LoginCredentials, RegisterData, Transaction, Budget, SavingsGoal, DashboardStats } from '@/types';

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  verifyToken: async (): Promise<User> => {
    const response = await api.get('/auth/verify');
    return response.data.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    return response.data.user;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentTransactions: async (limit = 5): Promise<Transaction[]> => {
    const response = await api.get(`/dashboard/recent-transactions?limit=${limit}`);
    return response.data;
  },
};

// Transactions API
export const transactionsApi = {
  getAll: async (filters?: any): Promise<Transaction[]> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },

  update: async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  importFromCSV: async (file: File): Promise<{ imported: number; errors: string[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/transactions/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Budget API
export const budgetApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get('/budget');
    return response.data;
  },

  getActive: async (): Promise<Budget | null> => {
    const response = await api.get('/budget/active');
    return response.data;
  },

  create: async (budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
    const response = await api.post('/budget', budget);
    return response.data;
  },

  update: async (id: string, budget: Partial<Budget>): Promise<Budget> => {
    const response = await api.put(`/budget/${id}`, budget);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budget/${id}`);
  },
};

// Goals API
export const goalsApi = {
  getAll: async (): Promise<SavingsGoal[]> => {
    const response = await api.get('/goals');
    return response.data;
  },

  create: async (goal: Omit<SavingsGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SavingsGoal> => {
    const response = await api.post('/goals', goal);
    return response.data;
  },

  update: async (id: string, goal: Partial<SavingsGoal>): Promise<SavingsGoal> => {
    const response = await api.put(`/goals/${id}`, goal);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  addContribution: async (id: string, amount: number): Promise<SavingsGoal> => {
    const response = await api.post(`/goals/${id}/contribute`, { amount });
    return response.data;
  },
};

// OCR API
export const ocrApi = {
  processReceipt: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('receipt', file);
    const response = await api.post('/ocr/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getReceiptHistory: async (): Promise<any[]> => {
    const response = await api.get('/ocr/history');
    return response.data;
  },
};