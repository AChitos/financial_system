import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { dataPath } from '../utils/paths';
import { protect } from '../middleware/auth';

const router = express.Router();

const getBudgetsFilePath = () => dataPath('budgets.json');

const readBudgets = () => {
  try {
    const data = readFileSync(getBudgetsFilePath(), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeBudgets = (budgets: any[]) => {
  writeFileSync(getBudgetsFilePath(), JSON.stringify(budgets, null, 2));
};

// @desc    Get all budgets
// @route   GET /api/budget
// @access  Private
router.get('/', protect, (req: any, res) => {
  try {
    const budgets = readBudgets().filter((b: any) => b.userId === req.user.id);
    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get active budget
// @route   GET /api/budget/active
// @access  Private
router.get('/active', protect, (req: any, res) => {
  try {
    const budgets = readBudgets().filter((b: any) => b.userId === req.user.id && b.isActive);
    const activeBudget = budgets.length > 0 ? budgets[0] : null;
    res.json(activeBudget);
  } catch (error) {
    console.error('Error fetching active budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create budget
// @route   POST /api/budget
// @access  Private
router.post('/', protect, (req: any, res) => {
  try {
    const budgets = readBudgets();
    const newBudget = {
      id: uuidv4(),
      userId: req.user.id,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    budgets.push(newBudget);
    writeBudgets(budgets);
    
    res.status(201).json(newBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update budget
// @route   PUT /api/budget/:id
// @access  Private
router.put('/:id', protect, (req: any, res) => {
  try {
    const budgets = readBudgets();
    const budgetIndex = budgets.findIndex((b: any) => b.id === req.params.id && b.userId === req.user.id);
    
    if (budgetIndex === -1) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    budgets[budgetIndex] = {
      ...budgets[budgetIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    writeBudgets(budgets);
    res.json(budgets[budgetIndex]);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete budget
// @route   DELETE /api/budget/:id
// @access  Private
router.delete('/:id', protect, (req: any, res) => {
  try {
    const budgets = readBudgets();
    const filteredBudgets = budgets.filter((b: any) => !(b.id === req.params.id && b.userId === req.user.id));
    
    if (filteredBudgets.length === budgets.length) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    writeBudgets(filteredBudgets);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;