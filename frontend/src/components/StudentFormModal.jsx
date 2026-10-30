import React, { useState, useEffect } from 'react';

const COMMON_BRANCHES = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Other / Custom',
];

export default function StudentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  serverErrors,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: 'Computer Science',
    customBranch: '',
    marks: '',
  });

  const [clientErrors, setClientErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      const isKnownBranch = COMMON_BRANCHES.includes(initialData.branch);
      setFormData({
        name: initialData.name || '',
        rollNumber: initialData.rollNumber || '',
        branch: isKnownBranch ? initialData.branch : 'Other / Custom',
        customBranch: isKnownBranch ? '' : initialData.branch || '',
        marks: initialData.marks !== undefined && initialData.marks !== null ? String(initialData.marks) : '',
      });
    } else {
      setFormData({
        name: '',
        rollNumber: '',
        branch: 'Computer Science',
        customBranch: '',
        marks: '',
      });
    }
    setClientErrors({});
    setTouched({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Validation function
  const validateField = (name, value, allValues = formData) => {
    let error = '';

    if (name === 'name') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Student name is required.';
      } else if (trimmed.length < 2) {
        error = 'Name must be at least 2 characters long.';
      } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
        error = 'Name must only contain letters, spaces, dots, or hyphens.';
      }
    }

    if (name === 'rollNumber') {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        error = 'Roll number is required.';
      } else if (trimmed.length < 2) {
        error = 'Roll number must be at least 2 characters long.';
      } else if (trimmed.length > 30) {
        error = 'Roll number cannot exceed 30 characters.';
      }
    }

    if (name === 'branch') {
      if (!value) {
        error = 'Branch selection is required.';
      } else if (value === 'Other / Custom' && (!allValues.customBranch || !allValues.customBranch.trim())) {
        error = 'Please enter the custom branch name.';
      }
    }

    if (name === 'customBranch') {
      if (allValues.branch === 'Other / Custom' && (!value || !value.trim())) {
        error = 'Please specify the branch name.';
      }
    }

    if (name === 'marks') {
      const trimmed = String(value || '').trim();
      if (trimmed === '') {
        error = 'Marks are required.';
      } else {
        const num = Number(trimmed);
        if (isNaN(num)) {
          error = 'Marks must be a valid number.';
        } else if (num < 0 || num > 100) {
          error = 'Marks must be between 0 and 100.';
        }
      }
    }

    return error;
  };

  const validateAll = () => {
    const errors = {};
    errors.name = validateField('name', formData.name);
    errors.rollNumber = validateField('rollNumber', formData.rollNumber);
    errors.branch = validateField('branch', formData.branch);
    if (formData.branch === 'Other / Custom') {
      errors.customBranch = validateField('customBranch', formData.customBranch);
    }
    errors.marks = validateField('marks', formData.marks);

    // Filter empty
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (touched[name]) {
      const fieldError = validateField(name, value, updatedForm);
      setClientErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value, formData);
    setClientErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      rollNumber: true,
      branch: true,
      customBranch: true,
      marks: true,
    });

    const validationErrors = validateAll();
    setClientErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const finalBranch = formData.branch === 'Other / Custom'
      ? formData.customBranch.trim()
      : formData.branch.trim();

    onSubmit({
      name: formData.name.trim(),
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      branch: finalBranch,
      marks: parseFloat(formData.marks),
    });
  };

  // Combine errors
  const getErrorMessage = (field) => {
    return clientErrors[field] || (serverErrors && serverErrors[field]);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <div className="modal-icon">
              {isEditing ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              )}
            </div>
            <div>
              <h2 id="modal-headline" className="modal-title">
                {isEditing ? 'Edit Student Details' : 'Register New Student'}
              </h2>
              <p className="modal-subtitle">
                {isEditing
                  ? 'Update basic information and marks for this student record.'
                  : 'Enter basic student details and marks to save in the system.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Server Error Alert Banner */}
        {serverErrors && serverErrors._general && (
          <div className="modal-alert modal-alert-danger" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{serverErrors._general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <div className="form-grid">
            {/* Student Name */}
            <div className="form-group form-group-full">
              <label htmlFor="student-name" className="form-label required-label">
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  id="student-name"
                  type="text"
                  name="name"
                  className={`form-input ${getErrorMessage('name') ? 'input-error' : ''}`}
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {getErrorMessage('name') && (
                <div className="form-error-msg" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{getErrorMessage('name')}</span>
                </div>
              )}
            </div>

            {/* Roll Number */}
            <div className="form-group">
              <label htmlFor="student-roll" className="form-label required-label">
                Roll Number (Unique ID)
              </label>
              <div className="input-wrapper">
                <input
                  id="student-roll"
                  type="text"
                  name="rollNumber"
                  className={`form-input font-mono ${getErrorMessage('rollNumber') ? 'input-error' : ''}`}
                  placeholder="e.g. CS2024-001"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <span className="form-hint">Roll numbers cannot be duplicated.</span>
              {getErrorMessage('rollNumber') && (
                <div className="form-error-msg" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{getErrorMessage('rollNumber')}</span>
                </div>
              )}
            </div>

            {/* Marks */}
            <div className="form-group">
              <label htmlFor="student-marks" className="form-label required-label">
                Marks (0 to 100)
              </label>
              <div className="input-wrapper">
                <input
                  id="student-marks"
                  type="number"
                  step="0.5"
                  min="0"
                  max="100"
                  name="marks"
                  className={`form-input ${getErrorMessage('marks') ? 'input-error' : ''}`}
                  placeholder="e.g. 85.5"
                  value={formData.marks}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <span className="form-hint">Must be a value between 0 and 100.</span>
              {getErrorMessage('marks') && (
                <div className="form-error-msg" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{getErrorMessage('marks')}</span>
                </div>
              )}
            </div>

            {/* Branch Selection */}
            <div className="form-group form-group-full">
              <label htmlFor="student-branch" className="form-label required-label">
                Academic Branch
              </label>
              <select
                id="student-branch"
                name="branch"
                className={`form-select ${getErrorMessage('branch') ? 'input-error' : ''}`}
                value={formData.branch}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {COMMON_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {getErrorMessage('branch') && (
                <div className="form-error-msg" role="alert">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{getErrorMessage('branch')}</span>
                </div>
              )}
            </div>

            {/* Custom Branch Input (shown if "Other / Custom" selected) */}
            {formData.branch === 'Other / Custom' && (
              <div className="form-group form-group-full">
                <label htmlFor="custom-branch" className="form-label required-label">
                  Specify Branch Name
                </label>
                <input
                  id="custom-branch"
                  type="text"
                  name="customBranch"
                  className={`form-input ${getErrorMessage('customBranch') ? 'input-error' : ''}`}
                  placeholder="e.g. Artificial Intelligence & Data Science"
                  value={formData.customBranch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {getErrorMessage('customBranch') && (
                  <div className="form-error-msg" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{getErrorMessage('customBranch')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Register Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
