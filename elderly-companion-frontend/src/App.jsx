// frontend/src/App.jsx
import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import AuthPage from './pages/AuthPage';
import ElderlyDashboard from './pages/ElderlyDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import setAuthToken from './utils/setAuthToken'; // ✅ Import setAuthToken

function App() {
  // Theme state
  const [theme, setTheme] = useState('light');

  // Get token and set for axios
  const token = localStorage.getItem('token');
  let userRole = null;

  // ✅ Configure axios with token (if present)
  if (token) {
    setAuthToken(token);
  }

  // ✅ Decode token to get user role
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.user.role;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  }

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    window.location.reload();
  };

  // ✅ Theme toggle
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // ✅ Role-based dashboard rendering
  const renderDashboard = () => {
    if (userRole === 'family') {
      return <FamilyDashboard onLogout={handleLogout} />;
    }
    return <ElderlyDashboard onLogout={handleLogout} />;
  };

  // ✅ UI Rendering
  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <h1>Elderly Companion 👵❤️</h1>

        {/* Theme toggle button */}
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>

      <main className="main-content">
        {token ? renderDashboard() : <AuthPage />}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Team E13. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
