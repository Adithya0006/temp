import React, { useState } from "react";
import "./ProcessManager.css";

export default function ProcessManager({ project }) {
  const [operations, setOperations] = useState([]);
  const [formData, setFormData] = useState({
    operationName: "",
    referenceNumber: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.operationName || !formData.referenceNumber) {
      alert("Please fill all fields!");
      return;
    }
    const sno = operations.length + 1;
    setOperations([
      ...operations,
      { sno, ...formData },
    ]);
    setFormData({ operationName: "", referenceNumber: "" });
  };

  return (
    <div className="process-container">
      {/* Project Summary */}
      <div className="card mb-4 shadow-sm border-0 project-summary-card">
        <div className="card-body">
          <h5 className="fw-semibold mb-3 text-success">Project Summary</h5> {/* Changed text-primary to text-success */}
          <div className="row g-3">
            <div className="col-md-4"><strong>Prod. Order:</strong> {project.productionOrderNumber}</div>
            <div className="col-md-4"><strong>Serial No:</strong> {project.serialNumber}</div>
            <div className="col-md-4"><strong>Group No:</strong> {project.groupNumber}</div>
            <div className="col-md-4"><strong>Group Counter:</strong> {project.groupCounter}</div>
            <div className="col-md-4"><strong>Material No:</strong> {project.materialNumber}</div>
            <div className="col-md-4"><strong>Description:</strong> {project.materialDescription}</div>
          </div>
        </div>
      </div>

      {/* Operation Form */}
      <div className="card shadow-sm border-0 process-form-card">
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Operation Name</label>
                <input
                  type="text"
                  name="operationName"
                  value={formData.operationName}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter operation name"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Reference Number</label>
                <input
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter reference number"
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-success px-4">
                Create Operation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Operations Table */}
      {operations.length > 0 && (
        <div className="card mt-4 border-0 shadow-sm">
          <div className="card-header process-table-header text-white fw-semibold">
            Operations List
          </div>
          <div className="card-body p-0">
            <table className="table table-hover text-center mb-0">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Operation Name</th>
                  <th>Reference Number</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op, i) => (
                  <tr key={i}>
                    <td>{op.sno}</td>
                    <td>{op.operationName}</td>
                    <td>{op.referenceNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}