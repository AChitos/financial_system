import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { dataPath } from '../utils/paths';
import { protect } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const getUsersFilePath = () => dataPath('users.json');

const readUsers = () => {
  try {
    const data = readFileSync(getUsersFilePath(), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsers = (users: any[]) => {
  writeFileSync(getUsersFilePath(), JSON.stringify(users, null, 2));
};

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, businessName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email and password'
      });
    }

    const users = readUsers();

    // Check if user exists
    const userExists = users.find((user: any) => user.email === email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      businessName: businessName || '',
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(user);
    writeUsers(users);

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const users = [{ email: 'demo@finset.com', password: '$2a$10$RRPWD20JrJFY/cDjYNDFB.vciM124vvqcuY9b1zjfuwoJLOGgkb0C', id: 'demo-user', name: 'Demo User' }];
    // const users = readUsers();

    // Check if user exists
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
router.get('/verify', protect, (req: any, res) => {
  const { password: _, ...userResponse } = req.user;
  
  res.json({
    success: true,
    user: userResponse
  });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req: any, res) => {
  try {
    const { name, businessName } = req.body;
    const users = readUsers();
    
    const userIndex = users.findIndex((u: any) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      businessName: businessName !== undefined ? businessName : users[userIndex].businessName,
      updatedAt: new Date().toISOString()
    };

    writeUsers(users);

    const { password: _, ...userResponse } = users[userIndex];

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;