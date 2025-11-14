import React from 'react';
import './Dashboard.css'; // New CSS file for the operator dashboard look

function OperatorDashboard({ onLogout, role }) {
  return (
    <div className="op-dashboard-wrapper">
      <header className="op-header">
        <h1>⚙️ Operator Work Panel</h1>
        {/* The logout button */}
        <button onClick={onLogout} className="op-logout-btn">
          Logout
        </button>
      </header>
    
      {/* The Operator Big Empty Container */}
      <div className="op-dashboard-container">
        <h2>Welcome, Operator!</h2>
        <p>This big container is specifically for your daily tasks.</p>
        <p>Your current role is: **{role.toUpperCase()}**</p>
      </div>
    </div>
  );
}

export default OperatorDashboard;