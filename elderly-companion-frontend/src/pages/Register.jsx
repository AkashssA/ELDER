// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

// We accept 'toggleForm' as a prop so we can switch back to the login view
const Register = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'elderly',        // Default role
    primaryUserEmail: '',   // Field for family member
  });

  const { name, email, password, role, primaryUserEmail } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post to the register endpoint
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);

      // On success, save the token and reload (just like login)
      localStorage.setItem('token', res.data.token);
      alert('Registration Successful! Logging you in...');
      window.location.reload(); // Reload to show the dashboard
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Registration Failed'));
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={onSubmit}>
        <h2>Register Your Account</h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Your Name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={onChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
          minLength="6"
        />

        {/* --- ROLE SELECTOR --- */}
        <div className="role-selector">
          <label>
            <input
              type="radio"
              name="role"
              value="elderly"
              checked={role === 'elderly'}
              onChange={onChange}
            />
            I am the primary user (Elderly)
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="family"
              checked={role === 'family'}
              onChange={onChange}
            />
            I am a family member
          </label>
        </div>

        {/* --- CONDITIONAL FIELD --- */}
        {role === 'family' && (
          <input
            type="email"
            placeholder="Primary User's Email Address"
            name="primaryUserEmail"
            value={primaryUserEmail}
            onChange={onChange}
            required
          />
        )}

        <input type="submit" value="Register" className="auth-button" />
      </form>

      <button onClick={toggleForm} className="toggle-auth-button">
        Already have an account? Login
      </button>
    </div>
  );
};

export default Register;
