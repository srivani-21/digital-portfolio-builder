import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePortfolio from './pages/CreatePortfolio';
import MyPortfolios from './pages/MyPortfolios';
import PublicPortfolios from './pages/PublicPortfolios';
import PortfolioView from './pages/PortfolioView';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';

const Layout = ({ children }) => {
  const { token } = useAuth();
  return (
    <div style={{ display: 'flex' }}>
      {token && <Sidebar />}
      <main style={{
        marginLeft: token ? '240px' : '0',
        flex: 1, minHeight: '100vh',
        background: '#0a0a0f',
        transition: 'margin .3s',
      }}>
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { token, user } = useAuth();
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/portfolios" element={<PublicPortfolios />} />
        <Route path="/portfolio/:username" element={<PortfolioView />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/create-portfolio" element={<PrivateRoute><CreatePortfolio /></PrivateRoute>} />
        <Route path="/my-portfolios" element={<PrivateRoute><MyPortfolios /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;