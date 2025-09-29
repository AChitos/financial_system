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

## Quick Start (Demo)

### Demo Account
- **Email**: demo@finset.com
- **Password**: password

### Development Setup

1. **Clone and Install**:
```bash
git clone https://github.com/AChitos/financial_system.git
cd financial_system
npm install
```

2. **Start Development Servers**:
```bash
# Start both frontend and backend
npm run dev

# Or run separately:
# Backend: cd server && npm run dev
# Frontend: cd client && npm run dev
```

3. **Access the Application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

### Demo Features Available
- ✅ User Authentication (Login/Register)
- ✅ Dashboard with financial overview
- ✅ Transaction management with demo data
- ✅ Receipt/Invoice OCR processing
- ✅ Responsive design matching provided mockup
- ✅ Real-time charts and analytics
- ✅ Automatic expense categorization
- ✅ Tax deduction detection
- ✅ File upload for receipts

### Production Deployment
GitHub Pages builds a static site from this repo. We prevent Jekyll from processing the repo with a `.nojekyll` file and publish the built SPA from `client/dist` using the provided workflow.

To deploy manually:

```bash
# Build client
cd client
npm run build

# Commit and push (the workflow will publish `client/dist`)
cd ..
git add -A
git commit -m "build: client for pages"
git push origin main
```

Ensure the repository Pages settings are set to "GitHub Actions" as the source.

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

## Vercel Deployment

This repository is configured for deployment on Vercel with a serverless API and static frontend.

- Serverless API entry: `server/api/[...route].ts` wraps the Express app
- Routing and builds configured in `vercel.json`

Steps to deploy:

1. In Vercel, add Environment Variables:
   - `JWT_SECRET`: any secure random string
   - `FRONTEND_URL`: your production URL (e.g., https://your-project.vercel.app)
   - `VITE_API_URL`: https://your-project.vercel.app/api
2. Connect the GitHub repo to Vercel and deploy.
3. Vercel runs `npm run vercel-build` at the repo root to build server and client.
4. Verify:
   - `GET https://<your-domain>/api/health` → 200 OK
   - The SPA loads at `https://<your-domain>/`

Notes:
- Uploads are handled in-memory for serverless compatibility; for persistence use Vercel Blob.
- The current data layer uses JSON files for demo purposes. For production, use Vercel Postgres or KV.