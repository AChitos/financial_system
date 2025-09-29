import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// @desc    Get goals
// @route   GET /api/goals
// @access  Private
router.get('/', protect, (req: any, res) => {
  res.json({
    success: true,
    message: 'Goals endpoints - Coming soon'
  });
});

export default router;