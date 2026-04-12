// AuthContext.jsx
// Think of this as a "global store" for login state
// Any page can check: "is the user logged in? who are they?"

import { createContext, useContext, useState } from 'react';

// Step 1: Create the context (like creating a shared box)
const AuthContext = createContext();

// Step 2: Provider wraps the whole app and shares the data
export const AuthProvider = ({ children }) => {
  // Read token and user from localStorage (so login persists on refresh)
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // Called after successful login
  const login = (userData, tokenData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Called on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 3: Custom hook — any page uses this to access login state
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);