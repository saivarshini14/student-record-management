import React, { useState } from 'react';

export default function StudentTable({
  students,
  isLoading,
  onEditStudent,
  onDeleteStudent,
  onOpenAddModal,
  onResetSearch,
  isSearching,
}) {
  const [sortField, setSortField] = useState('id');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const getGradeBadgeClass = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'grade-badge grade-a';
      case 'B':
        return 'grade-badge grade-b';
      case 'C':
        return 'grade-badge grade-c';
      case 'D':
      case 'E':
        return 'grade-badge grade-d';
      default:
        return 'grade-badge grade-f';
    }
  };

  const getMarksBarColor = (marks) => {
    if (marks >= 80) return '#10b981'; // emerald
    if (marks >= 60) return '#3b82f6'; // blue
    if (marks >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // rose/red
  };

  if (isLoading) {
    return (
      <div className="table-card table-loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading student records from database...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="table-card table-empty">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="empty-state-title">
          {isSearching ? 'No Students Found' : 'No Student Records Available'}
        </h3>
        <p className="empty-state-desc">
          {isSearching
            ? 'No student matches your roll number search criteria. Try a different roll number or clear your search.'
            : 'Get started by registering a student into the system with their name, roll number, branch, and marks.'}
        </p>
        <div className="empty-state-actions">
          {isSearching ? (
            <button type="button" className="btn btn-secondary" onClick={onResetSearch}>
              Clear Search & Show All
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
              + Add First Student
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-header-info">
        <div className="table-info-left">
          <h2 className="table-title">Registered Students Directory</h2>
          <span className="table-subtitle">Showing {students.length} student records</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('rollNumber')} className="sortable-th">
                <div className="th-content">
                  <span>Roll Number</span>
                  <span className="sort-icon">{sortField === 'rollNumber' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                </div>
              </th>
              <th onClick={() => handleSort('name')} className="sortable-th">
                <div className="th-content">
                  <span>Student Name</span>
                  <span className="sort-icon">{sortField === 'name' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                </div>
              </th>
              <th onClick={() => handleSort('branch')} className="sortable-th">
                <div className="th-content">
                  <span>Branch</span>
                  <span className="sort-icon">{sortField === 'branch' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                </div>
              </th>
              <th onClick={() => handleSort('marks')} className="sortable-th">
                <div className="th-content">
                  <span>Marks (0 - 100)</span>
                  <span className="sort-icon">{sortField === 'marks' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                </div>
              </th>
              <th>Grade</th>
              <th>Status</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student.id} className="student-row">
                {/* Roll Number */}
                <td className="cell-roll-no">
                  <span className="roll-badge">{student.rollNumber}</span>
                </td>

                {/* Name */}
                <td className="cell-name">
                  <div className="name-wrapper">
                    <div className="avatar-circle">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="student-fullname">{student.name}</span>
                  </div>
                </td>

                {/* Branch */}
                <td className="cell-branch">
                  <span className="branch-tag">{student.branch}</span>
                </td>

                {/* Marks with visual progress bar */}
                <td className="cell-marks">
                  <div className="marks-display">
                    <div className="marks-numeric">
                      <span className="marks-value">{Number(student.marks).toFixed(1)}</span>
                      <span className="marks-max">/ 100</span>
                    </div>
                    <div className="marks-progress-track">
                      <div
                        className="marks-progress-fill"
                        style={{
                          width: `${Math.min(Math.max(student.marks, 0), 100)}%`,
                          backgroundColor: getMarksBarColor(student.marks),
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Grade */}
                <td className="cell-grade">
                  <span className={getGradeBadgeClass(student.grade)}>
                    {student.grade}
                  </span>
                </td>

                {/* Status: PASS / FAIL */}
                <td className="cell-status">
                  <span className={`status-pill ${student.status === 'PASS' ? 'status-pass' : 'status-fail'}`}>
                    <span className="status-dot"></span>
                    {student.status}
                  </span>
                </td>

                {/* Actions: Edit & Delete */}
                <td className="cell-actions">
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="btn-action btn-edit"
                      onClick={() => onEditStudent(student)}
                      title={`Edit details for ${student.name}`}
                      aria-label={`Edit ${student.name}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className="btn-action btn-delete"
                      onClick={() => onDeleteStudent(student)}
                      title={`Delete record for ${student.name}`}
                      aria-label={`Delete ${student.name}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
