import React from 'react';

export default function DeleteConfirmModal({
  isOpen,
  student,
  onClose,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container modal-sm"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="delete-modal-body">
          <div className="delete-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>

          <h3 id="delete-dialog-title" className="delete-title">
            Delete Student Record?
          </h3>
          <p className="delete-description">
            Are you sure you want to permanently delete the student record for:
          </p>

          <div className="delete-student-card">
            <div className="delete-card-name">{student.name}</div>
            <div className="delete-card-meta">
              <span>Roll No: <strong>{student.rollNumber}</strong></span>
              <span>&bull;</span>
              <span>Branch: <strong>{student.branch}</strong></span>
              <span>&bull;</span>
              <span>Marks: <strong>{student.marks}</strong></span>
            </div>
          </div>

          <p className="delete-warning">
            This action cannot be undone. All marks and details for this student will be permanently removed.
          </p>

          <div className="delete-modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Deleting...</span>
                </>
              ) : (
                'Yes, Delete Record'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
