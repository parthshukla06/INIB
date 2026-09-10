import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import { getCurrentUser } from './services/taskApi';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  const handleAuthSuccess = (token, authenticatedUser) => {
    localStorage.setItem('inib_token', token);
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('inib_token');
    setUser(null);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('inib_token');

      if (!token) {
        setIsBooting(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem('inib_token');
        setUser(null);
      } finally {
        setIsBooting(false);
      }
    };

    restoreSession();
  }, []);

  if (isBooting) {
    return (
      <div className="auth-shell">
        <div className="auth-card loading-card">
          <div className="spinner" />
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" replace /> : <AuthPage mode="login" onAuthSuccess={handleAuthSuccess} />
          }
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/" replace /> : <AuthPage mode="register" onAuthSuccess={handleAuthSuccess} />
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <Dashboard
                theme={theme}
                onToggleTheme={toggleTheme}
                user={user}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
