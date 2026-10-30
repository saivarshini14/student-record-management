import React from 'react';

export default function Navbar({ totalStudents, onOpenAddModal }) {
  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Student Record Management</h1>
            <p className="brand-subtitle">Trainer & College Staff Academic Portal</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="total-students-badge" title="Total registered students">
            <span className="badge-dot"></span>
            <span className="badge-label">Total Registered:</span>
            <span className="badge-count">{totalStudents}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-add-student"
            onClick={onOpenAddModal}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
