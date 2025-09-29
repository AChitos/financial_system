import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Scan, Check, X, Loader } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { ExtractedReceiptData, ReceiptItem } from '@/types';

const ReceiptProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setExtractedData(null);
      setOcrText('');
      processReceipt(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    multiple: false
  });

  const processReceipt = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // OCR Processing
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      setOcrText(result.data.text);
      
      // Parse the OCR text to extract structured data
      const parsedData = parseReceiptText(result.data.text);
      setExtractedData(parsedData);
      
    } catch (error) {
      console.error('OCR processing failed:', error);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const parseReceiptText = (text: string): ExtractedReceiptData => {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Simple parsing logic - in a real app this would be more sophisticated
    const extractedData: ExtractedReceiptData = {
      items: [],
    };

    // Try to extract merchant name (usually first non-empty line)
    if (lines.length > 0) {
      extractedData.merchantName = lines[0].trim();
    }

    // Try to extract total amount
    const totalRegex = /total[:\s]*\$?(\d+\.?\d*)/i;
    const totalMatch = text.match(totalRegex);
    if (totalMatch) {
      extractedData.total = parseFloat(totalMatch[1]);
    }

    // Try to extract date
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4})/;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      extractedData.date = dateMatch[1];
    }

    // Try to extract tax
    const taxRegex = /tax[:\s]*\$?(\d+\.?\d*)/i;
    const taxMatch = text.match(taxRegex);
    if (taxMatch) {
      extractedData.tax = parseFloat(taxMatch[1]);
      extractedData.subtotal = extractedData.total ? extractedData.total - extractedData.tax : undefined;
    }

    // Simple item extraction (this would be more complex in reality)
    const priceRegex = /\$(\d+\.?\d*)/g;
    const prices = [];
    let match;
    while ((match = priceRegex.exec(text)) !== null) {
      prices.push(parseFloat(match[1]));
    }

    // Create dummy items for demonstration
    if (prices.length > 0) {
      extractedData.items = prices.slice(0, -1).map((price, index) => ({
        name: `Item ${index + 1}`,
        totalPrice: price,
        quantity: 1,
      }));
    }

    // Smart categorization
    extractedData.category = categorizeExpense(extractedData.merchantName || '', text);
    extractedData.isTaxDeductible = isBusinessExpense(extractedData.merchantName || '', extractedData.category);

    return extractedData;
  };

  const categorizeExpense = (merchantName: string, text: string): string => {
    const merchant = merchantName.toLowerCase();
    const content = text.toLowerCase();

    if (merchant.includes('walmart') || merchant.includes('target') || merchant.includes('grocery')) {
      return 'Food & Groceries';
    }
    if (merchant.includes('gas') || merchant.includes('shell') || merchant.includes('exxon')) {
      return 'Transportation';
    }
    if (merchant.includes('office') || content.includes('supplies') || content.includes('paper')) {
      return 'Office Supplies';
    }
    if (merchant.includes('restaurant') || merchant.includes('cafe') || content.includes('food')) {
      return 'Cafe & Restaurants';
    }
    if (merchant.includes('hotel') || content.includes('travel') || content.includes('flight')) {
      return 'Travel';
    }
    
    return 'Other';
  };

  const isBusinessExpense = (merchantName: string, category: string): boolean => {
    const businessCategories = ['Office Supplies', 'Travel', 'Professional Services'];
    return businessCategories.includes(category);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const saveTransaction = () => {
    // This would integrate with the transactions API
    console.log('Saving transaction:', extractedData);
    // Reset the form
    setUploadedFile(null);
    setExtractedData(null);
    setOcrText('');
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Receipt Processor</h1>
        <p className="text-gray-600 mt-1">Upload receipts and invoices to automatically extract financial data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Receipt</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              {isDragActive ? (
                <p className="text-purple-600 font-medium">Drop the receipt here...</p>
              ) : (
                <div>
                  <p className="text-gray-900 font-medium mb-2">
                    Drag & drop a receipt here, or click to select
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supports PNG, JPG, JPEG, GIF, BMP
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <Loader className="w-5 h-5 text-purple-600 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900">Processing Receipt</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Scanning document...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Uploaded File Preview */}
          {uploadedFile && (
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded File</h3>
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {uploadedFile.type.startsWith('image/') && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Receipt preview"
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Extracted Data Section */}
        <div className="space-y-6">
          {extractedData && (
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex items-center space-x-3 mb-4">
                <Scan className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Extracted Data</h3>
                <div className="flex items-center space-x-1 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Processing Complete</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Merchant Name
                    </label>
                    <input
                      type="text"
                      value={extractedData.merchantName || ''}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        merchantName: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={extractedData.date || ''}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        date: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={extractedData.total || ''}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        total: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={extractedData.tax || ''}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        tax: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtotal
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={extractedData.subtotal || ''}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        subtotal: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={extractedData.category || ''}
                    onChange={(e) => setExtractedData({
                      ...extractedData,
                      category: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Food & Groceries">Food & Groceries</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Cafe & Restaurants">Cafe & Restaurants</option>
                    <option value="Travel">Travel</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={extractedData.isTaxDeductible || false}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        isTaxDeductible: e.target.checked
                      })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tax Deductible</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={extractedData.isBusinessExpense || false}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        isBusinessExpense: e.target.checked
                      })}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Business Expense</span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={saveTransaction}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save as Transaction
                  </button>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setExtractedData(null);
                      setOcrText('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Raw OCR Text */}
          {ocrText && (
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw OCR Text</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{ocrText}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptProcessor;