import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import path from 'path';
import { dataPath } from '../utils/paths';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Get user from token
  const usersPath = dataPath('users.json');
      let users = [];
      
      try {
        const usersData = readFileSync(usersPath, 'utf8');
        users = JSON.parse(usersData);
      } catch (error) {
        users = [];
      }

      const user = users.find((u: any) => u.id === decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authorized, user not found' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized, no token' 
    });
  }
};