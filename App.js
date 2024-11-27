// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import UserManagement from './UserManagement';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const handleRegister = ({ username, password }) => {
    console.log('User registered:', username, password);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/user-management">User Management</Link>
                </li>
                <li>
                  <Link to="/products">Products</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : null}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} onRegister={handleRegister} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/products" element={isLoggedIn ? <ProductList /> : <Navigate to="/login" />} />
          <Route path="/add-product" element={isLoggedIn ? <ProductForm fetchProducts={() => {}} /> : <Navigate to="/login" />} />
          <Route path="/user-management" element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
