import React from "react";

export default function MainContainer({ children, projects, onAddProcessClick }) {
  return (
    <div className="main-bg py-4">
      <div className="main-container"> {/* Removed shadow-lg, shadow is in App.css */}
        <div className="navbar-top d-flex align-items-center justify-content-between px-4">
          <h3 className="fw-bold text-light m-0">Production Tracker</h3>
          <button className="btn btn-outline-light btn-sm">Logout</button>
        </div>

        <div className="workspace px-4 py-4">{children}</div>

        {projects && projects.length > 0 && (
          <div className="px-4 pb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white fw-semibold"> {/* Changed bg-gradient to bg-primary (or custom class if needed, but primary maps to the new blue) */}
                Created Projects
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0 text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>Production Order</th>
                        <th>Serial No</th>
                        <th>Group No</th>
                        <th>Group Counter</th>
                        <th>Material No</th>
                        <th>Material Desc</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p, i) => (
                        <tr key={i}>
                          <td>{p.productionOrderNumber}</td>
                          <td>{p.serialNumber}</td>
                          <td>{p.groupNumber}</td>
                          <td>{p.groupCounter}</td>
                          <td>{p.materialNumber}</td>
                          <td>{p.materialDescription}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onAddProcessClick(p)}
                            >
                              Add Process
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}