import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Analytics from './pages/Analytics'
import Goals from './pages/Goals'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import ReceiptProcessor from './pages/ReceiptProcessor'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budget" element={<Budget />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="goals" element={<Goals />} />
            <Route path="receipt-processor" element={<ReceiptProcessor />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App