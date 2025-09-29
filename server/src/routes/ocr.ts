import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/receipts'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @desc    Process receipt/invoice
// @route   POST /api/ocr/process
// @access  Private
router.post('/process', protect, upload.single('receipt'), (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // In a real implementation, you would:
    // 1. Process the image with OCR service (Tesseract, AWS Textract, Google Vision, etc.)
    // 2. Parse the extracted text to identify relevant financial data
    // 3. Return structured data

    // For now, return mock data
    const mockExtractedData = {
      id: Date.now().toString(),
      userId: req.user.id,
      fileName: req.file.filename,
      originalText: 'Mock OCR text - implement real OCR processing here',
      extractedData: {
        merchantName: 'Sample Store',
        date: new Date().toISOString().split('T')[0],
        total: 45.67,
        subtotal: 42.50,
        tax: 3.17,
        currency: 'USD',
        items: [
          { name: 'Office Supplies', totalPrice: 25.50 },
          { name: 'Coffee', totalPrice: 17.00 }
        ],
        category: 'Office Supplies',
        isTaxDeductible: true,
        isBusinessExpense: true
      },
      confidence: 0.95,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: mockExtractedData
    });
  } catch (error) {
    console.error('OCR processing error:', error);
    res.status(500).json({
      success: false,
      error: 'OCR processing failed'
    });
  }
});

export default router;