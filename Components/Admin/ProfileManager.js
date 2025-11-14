import React, { useState } from "react";
import "./ProfileManager.css";

export default function ProfileManager({ profiles, onAddProfile }) {
  const [formData, setFormData] = useState({
    staffNumber: "",
    password: "",
    roleType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const { staffNumber, password, roleType } = formData;
    if (!staffNumber || !password || !roleType) {
      alert("Please fill all fields!");
      return;
    }

    onAddProfile(formData);
    setFormData({ staffNumber: "", password: "", roleType: "" });
  };

  return (
    <div className="profile-container">
      <div className="card shadow-sm border-0 p-4 profile-form-card">
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Staff Number</label>
                <input
                  type="text"
                  name="staffNumber"
                  value={formData.staffNumber}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter staff number"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter password"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Role Type</label>
                <select
                  name="roleType"
                  className="form-select"
                  value={formData.roleType}
                  onChange={handleChange}
                >
                  <option value="">Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Supervisor - Internal">Supervisor - Internal</option>
                  <option value="Supervisor - External">Supervisor - External</option>
                </select>
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-primary px-4">
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>

      {profiles.length > 0 && (
        <div className="card mt-4 border-0 shadow-sm">
          <div className="card-header profile-table-header text-white fw-semibold">
            Created Profiles
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Staff Number</th>
                    <th>Password</th>
                    <th>Role Type</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p, i) => (
                    <tr key={i}>
                      <td>{p.staffNumber}</td>
                      <td>{p.password}</td>
                      <td>{p.roleType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
