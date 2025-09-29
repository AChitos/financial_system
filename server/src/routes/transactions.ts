import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { protect } from '../middleware/auth';

const router = express.Router();

const getTransactionsFilePath = () => path.join(__dirname, '../../data/transactions.json');

const readTransactions = () => {
  try {
    const data = readFileSync(getTransactionsFilePath(), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeTransactions = (transactions: any[]) => {
  writeFileSync(getTransactionsFilePath(), JSON.stringify(transactions, null, 2));
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, (req: any, res) => {
  try {
    const transactions = readTransactions().filter((t: any) => t.userId === req.user.id);
    
    // Apply filters if provided
    let filteredTransactions = [...transactions];
    
    if (req.query.category && req.query.category !== 'All') {
      filteredTransactions = filteredTransactions.filter(t => t.category === req.query.category);
    }
    
    if (req.query.type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === req.query.type);
    }
    
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(filteredTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
router.get('/:id', protect, (req: any, res) => {
  try {
    const transactions = readTransactions();
    const transaction = transactions.find((t: any) => 
      t.id === req.params.id && t.userId === req.user.id
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, (req: any, res) => {
  try {
    const {
      type,
      amount,
      description,
      category,
      subcategory,
      date,
      paymentMethod,
      account,
      tags,
      isRecurring,
      recurringPattern,
      isTaxDeductible,
      isBusinessExpense,
      notes
    } = req.body;

    if (!type || !amount || !description || !category || !date || !paymentMethod || !account) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    const transaction = {
      id: uuidv4(),
      userId: req.user.id,
      type,
      amount: parseFloat(amount),
      description,
      category,
      subcategory: subcategory || '',
      date,
      paymentMethod,
      account,
      tags: tags || [],
      receiptUrl: '',
      isRecurring: isRecurring || false,
      recurringPattern: recurringPattern || null,
      isTaxDeductible: isTaxDeductible || false,
      isBusinessExpense: isBusinessExpense || false,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const transactions = readTransactions();
    transactions.push(transaction);
    writeTransactions(transactions);

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
router.put('/:id', protect, (req: any, res) => {
  try {
    const transactions = readTransactions();
    const transactionIndex = transactions.findIndex((t: any) => 
      t.id === req.params.id && t.userId === req.user.id
    );

    if (transactionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Update transaction
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    writeTransactions(transactions);

    res.json({
      success: true,
      data: transactions[transactionIndex]
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, (req: any, res) => {
  try {
    const transactions = readTransactions();
    const transactionIndex = transactions.findIndex((t: any) => 
      t.id === req.params.id && t.userId === req.user.id
    );

    if (transactionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    transactions.splice(transactionIndex, 1);
    writeTransactions(transactions);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router;