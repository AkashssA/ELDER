// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Accept the toggleForm prop
const Login = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      alert('Login Successful!');
      window.location.reload(); 
    } catch (err) {
      alert('Error: ' + (err.response.data.msg || 'Login Failed'));
    }
  };

  return (
    // Wrap in a container for styling
    <div className="auth-form-container"> 
      <form onSubmit={onSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <input type="submit" value="Login" className="auth-button" />
      </form>
      {/* Add the toggle button */}
      <button onClick={toggleForm} className="toggle-auth-button">
        Need an account? Register Here
      </button>
    </div>
  );
};

export default Login;