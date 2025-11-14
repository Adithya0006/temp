import React, { useState } from 'react';
import './Login.css'; // New CSS file for the operator look

function OperatorLoginPage({ onLogin }) {
  const [staffNumber, setStaffNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the state values up to the parent component (App.js)
    // Note: The parent (App.js) still uses the same DUMMY_STAFF data for validation.
    onLogin(staffNumber, password);
  };

  return (
    <div className="operator-login-page">
      <div className="operator-login-container">
        <h2>🛠️ Operator Login</h2>
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
          <button type="submit" className="operator-btn">Log In</button>
          <p className="hint">
            *Hint: Staff No: **54321**, Pass: **operatorpassword**
          </p>
        </form>
      </div>
    </div>
  );
}

export default OperatorLoginPage;