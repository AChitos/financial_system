# FinSet Financial Management System

A comprehensive financial management web application designed for business operations with advanced analytics, automated receipt processing, and modern dashboard interface.

## Features

### Core Financial Management
- **Dashboard**: Real-time financial overview with key metrics
- **Transaction Management**: Track income, expenses, and transfers
- **Budget Planning**: Set and monitor budgets across categories
- **Savings Goals**: Track progress toward financial objectives
- **Analytics**: Detailed reports and visualizations

### Advanced Features
- **Receipt/Invoice OCR**: Automatically extract data from uploaded images
- **Smart Categorization**: AI-powered expense categorization
- **Tax Management**: Automatic detection of tax-exempt purchases
- **Multi-Account Support**: Manage multiple business accounts
- **Export/Import**: CSV and Excel data handling

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data synchronization
- **Secure Authentication**: JWT-based user authentication
- **Data Backup**: Automatic data backup and recovery
- **GitHub Pages Hosting**: Fully hosted on GitHub Pages

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: File-based JSON storage (GitHub Pages compatible)
- **Authentication**: JWT tokens
- **OCR**: Tesseract.js
- **Charts**: Chart.js/Recharts
- **Deployment**: GitHub Pages + GitHub Actions

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AChitos/financial_system.git
cd financial_system
```

2. Install dependencies:
```bash
npm install
```

3. Start development servers:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

### Deployment

```bash
npm run deploy
```

## Project Structure

```
financial_system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Server utilities
│   └── package.json
├── shared/                # Shared types and utilities
└── docs/                  # Documentation
```

## API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budget
- `GET /api/budget` - Get budget data
- `POST /api/budget` - Create/update budget
- `GET /api/budget/analytics` - Get budget analytics

### OCR
- `POST /api/ocr/process` - Process receipt/invoice image

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@finset.com or create an issue in this repository.