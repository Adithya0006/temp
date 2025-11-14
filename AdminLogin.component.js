import React, { useState } from 'react';
import './Login.component.css'; 

function LoginPage({ onLogin }) {
  const [staffNumber, setStaffNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the state values up to the parent component (App.js)
    onLogin(staffNumber, password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>🔑 Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="staff_number">Staff Number:</label>
            <input
              type="text"
              id="staff_number"
              value={staffNumber}
              onChange={(e) => setStaffNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Log In</button>
          <p className="hint">
            *Hint: Staff No: **12345**, Pass: **adminpassword**
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;