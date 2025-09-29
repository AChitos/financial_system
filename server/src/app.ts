import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import transactionRoutes from './routes/transactions';
import budgetRoutes from './routes/budget';
import goalRoutes from './routes/goals';
import ocrRoutes from './routes/ocr';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { DATA_DIR } from './utils/paths';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure data/uploads directories exist (for non-serverless environments)
try {
  const uploadsRoot = path.join(DATA_DIR, 'uploads');
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });
  app.use('/uploads', express.static(uploadsRoot));
  // eslint-disable-next-line no-empty
} catch {}

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ocr', ocrRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
