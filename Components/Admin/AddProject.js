import React, { useState } from "react";
// Removed import of "./AddProject.css" as it is no longer needed/relevant
// or assume its styles are merged/overridden by App.css and inline changes.

export default function AddProject({ onAddProject }) {
  const [formData, setFormData] = useState({
    productionOrderNumber: "",
    serialNumber: "",
    groupNumber: "",
    groupCounter: "",
    materialNumber: "",
    materialDescription: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = (e) => {
    e.preventDefault();
    const values = Object.values(formData);
    if (values.some((v) => v.trim() === "")) {
      alert("Please fill all fields before creating!");
      return;
    }
    onAddProject(formData);
    setFormData({
      productionOrderNumber: "",
      serialNumber: "",
      groupNumber: "",
      groupCounter: "",
      materialNumber: "",
      materialDescription: "",
    });
  };

  return (
    // Replaced 'form-card' with a cleaner, bootstrap-like style. Using a primary border for the clean look.
    <div className="card border-0 shadow-sm border-start border-5 border-primary"> 
      <div className="card-body">
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            {[
              ["productionOrderNumber", "Production Order Number"],
              ["serialNumber", "Serial Number"],
              ["groupNumber", "Group Number"],
              ["groupCounter", "Group Counter"],
              ["materialNumber", "Material Number"],
              ["materialDescription", "Material Description"],
            ].map(([name, label]) => (
              <div className="col-md-6" key={name}>
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="text-end mt-4">
            {/* The styling for btn-primary is now handled consistently in ProfileManager.css (or a global CSS file) */}
            <button type="submit" className="btn btn-primary px-4">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}