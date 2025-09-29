import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { dataPath } from '../utils/paths';
import { protect } from '../middleware/auth';

const router = express.Router();

const getGoalsFilePath = () => dataPath('goals.json');

const readGoals = () => {
  try {
    const data = readFileSync(getGoalsFilePath(), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeGoals = (goals: any[]) => {
  writeFileSync(getGoalsFilePath(), JSON.stringify(goals, null, 2));
};

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private
router.get('/', protect, (req: any, res) => {
  try {
    const goals = readGoals().filter((g: any) => g.userId === req.user.id);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create goal
// @route   POST /api/goals
// @access  Private
router.post('/', protect, (req: any, res) => {
  try {
    const goals = readGoals();
    const newGoal = {
      id: uuidv4(),
      userId: req.user.id,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    goals.push(newGoal);
    writeGoals(goals);
    
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
router.put('/:id', protect, (req: any, res) => {
  try {
    const goals = readGoals();
    const goalIndex = goals.findIndex((g: any) => g.id === req.params.id && g.userId === req.user.id);
    
    if (goalIndex === -1) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    goals[goalIndex] = {
      ...goals[goalIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    writeGoals(goals);
    res.json(goals[goalIndex]);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
router.delete('/:id', protect, (req: any, res) => {
  try {
    const goals = readGoals();
    const filteredGoals = goals.filter((g: any) => !(g.id === req.params.id && g.userId === req.user.id));
    
    if (filteredGoals.length === goals.length) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    writeGoals(filteredGoals);
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add contribution to goal
// @route   POST /api/goals/:id/contribute
// @access  Private
router.post('/:id/contribute', protect, (req: any, res) => {
  try {
    const goals = readGoals();
    const goalIndex = goals.findIndex((g: any) => g.id === req.params.id && g.userId === req.user.id);
    
    if (goalIndex === -1) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const goal = goals[goalIndex];
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }
    
    goal.currentAmount += amount;
    goal.progress = (goal.currentAmount / goal.targetAmount) * 100;
    goal.isCompleted = goal.currentAmount >= goal.targetAmount;
    goal.updatedAt = new Date().toISOString();
    
    writeGoals(goals);
    res.json(goal);
  } catch (error) {
    console.error('Error adding contribution:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;