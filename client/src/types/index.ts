export interface ReceiptData {
  id: string;
  userId: string;
  fileName: string;
  originalText: string;
  extractedData: ExtractedReceiptData;
  confidence: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ExtractedReceiptData {
  merchantName?: string;
  date?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  currency?: string;
  paymentMethod?: string;
  items: ReceiptItem[];
  category?: string;
  isTaxDeductible?: boolean;
  isBusinessExpense?: boolean;
}

export interface ReceiptItem {
  name: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice: number;
  category?: string;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: OCRWord[];
}

export interface OCRWord {
  text: string;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  confidence: number;
}

export * from './auth';
export * from './financial';
export * from './dashboard';