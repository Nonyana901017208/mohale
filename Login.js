import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Default credentials check
    if ((username === 'mohale' && password === '1234') || (username === 'nonyana' && password === '1234')) {
      // If default credentials, login without calling API
      onLogin();
      navigate('/dashboard');
      return;
    }

    try {
      if (isRegistering) {
        // Register API call
        const response = await axios.post('http://localhost:5001/register', {
          username,
          password,
        });

        setMessage(response.data.message);
        setIsRegistering(false); // Switch to login after successful registration
      } else {
        // Login API call
        const response = await axios.post('http://localhost:5001/login', {
          username,
          password,
        });

        if (response.data.success) {
          setMessage(response.data.message);
          onLogin(); // Update user's state in App.js
          navigate('/dashboard'); // Navigate to the dashboard after successful login
        } else {
          setError(response.data.message || 'Invalid username or password');
        }
      }
    } catch (error) {
      // Error handling
      setError(error.response?.data?.message || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading
            ? isRegistering
              ? 'Registering...'
              : 'Logging in...'
            : isRegistering
            ? 'Register'
            : 'Login'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {message && (
        <p className={message.includes('successful') ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}

      <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-button">
        {isRegistering
          ? 'Already have an account? Login'
          : 'Do not have an account? Register here'}
      </button>
    </div>
  );
};

export default Login;
