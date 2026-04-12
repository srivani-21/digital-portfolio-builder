// PrivateRoute.jsx
// Wraps pages that require login
// If not logged in → redirects to /login
// If logged in → shows the page

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useAuth();

  // Not logged in at all → go to login
  if (!token) return <Navigate to="/login" />;

  // Page is admin-only but user is not admin → go to dashboard
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" />;

  // All good → show the page
  return children;
};

export default PrivateRoute;