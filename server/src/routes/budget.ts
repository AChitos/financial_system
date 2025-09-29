import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// @desc    Get budgets
// @route   GET /api/budget
// @access  Private
router.get('/', protect, (req: any, res) => {
  res.json({
    success: true,
    message: 'Budget endpoints - Coming soon'
  });
});

export default router;