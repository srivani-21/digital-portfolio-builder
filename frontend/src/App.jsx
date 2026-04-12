// App.jsx
// Sets up all the page routes
// PrivateRoute protects pages that need login

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PublicPortfolios from './pages/PublicPortfolios';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>           {/* Wraps everything so all pages can access auth */}
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes — anyone can visit */}
          <Route path="/" element={<Navigate to="/portfolios" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portfolios" element={<PublicPortfolios />} />

          {/* Protected — must be logged in */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <PrivateRoute adminOnly={true}>
              <AdminPanel />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;