import React, { useState } from 'react';
import './Login.css'; // New CSS file for the supervisor look

function SupervisorLoginPage({ onLogin }) {
  const [staffNumber, setStaffNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(staffNumber, password);
  };

  return (
    <div className="supervisor-login-page">
      <div className="supervisor-login-container">
        <h2>🧑‍💼 Supervisor Login</h2>
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
          <button type="submit" className="supervisor-btn">Log In</button>
          <p className="hint">
            *Hint: Staff No: **98765**, Pass: **supervisorpassword**
          </p>
        </form>
      </div>
    </div>
  );
}

export default SupervisorLoginPage;