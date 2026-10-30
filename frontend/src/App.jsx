import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import SearchBar from './components/SearchBar';
import StudentTable from './components/StudentTable';
import StudentFormModal from './components/StudentFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import NotificationToast from './components/NotificationToast';
import { studentApi } from './api/studentApi';
import './App.css';

export default function App() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageMarks: 0,
    highestMarks: 0,
    lowestMarks: 0,
    passCount: 0,
    failCount: 0,
    passPercentage: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(true);

  // Search and Filter states
  const [searchRollNo, setSearchRollNo] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Toast state
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Load students & stats
  const loadData = useCallback(async (rollNoFilter = '', branchFilter = '') => {
    setIsLoading(true);
    try {
      const [studentsData, statsData] = await Promise.all([
        studentApi.getAllStudents(rollNoFilter),
        studentApi.getStats(),
      ]);

      // Apply branch filter if present
      let filtered = studentsData;
      if (branchFilter && branchFilter.trim()) {
        filtered = filtered.filter(
          (s) => s.branch?.toLowerCase() === branchFilter.trim().toLowerCase()
        );
      }

      setStudents(filtered);
      setStats(statsData);
      setBackendConnected(true);
    } catch (err) {
      console.error('Error fetching student data:', err);
      setBackendConnected(false);
      showNotification(
        'Unable to connect to Spring Boot backend at http://localhost:8080. Please ensure the backend is running.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeSearchTerm, selectedBranch);
  }, [loadData, activeSearchTerm, selectedBranch]);

  // Handle Search Submission
  const handleSearchSubmit = (rollNo) => {
    setActiveSearchTerm(rollNo);
    loadData(rollNo, selectedBranch);
  };

  const handleSearchChange = (val) => {
    setSearchRollNo(val);
    if (!val) {
      setActiveSearchTerm('');
      loadData('', selectedBranch);
    }
  };

  const handleResetSearch = () => {
    setSearchRollNo('');
    setActiveSearchTerm('');
    setSelectedBranch('');
    loadData('', '');
  };

  const handleBranchFilterChange = (branch) => {
    setSelectedBranch(branch);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormServerErrors(null);
    setIsFormModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormServerErrors(null);
    setIsFormModalOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setFormServerErrors(null);

    try {
      if (editingStudent) {
        // Update existing student
        const updated = await studentApi.updateStudent(editingStudent.id, formData);
        showNotification(`Student "${updated.name}" (${updated.rollNumber}) updated successfully!`, 'success');
      } else {
        // Create new student
        const created = await studentApi.createStudent(formData);
        showNotification(`Student "${created.name}" registered with Roll No: ${created.rollNumber}!`, 'success');
      }

      setIsFormModalOpen(false);
      setEditingStudent(null);
      await loadData(activeSearchTerm, selectedBranch);
    } catch (err) {
      console.error('Save student error:', err);
      if (err.errors) {
        setFormServerErrors({
          ...err.errors,
          _general: err.message || 'Validation failed. Please review the highlighted fields below.',
        });
      } else {
        setFormServerErrors({
          _general: err.message || 'An error occurred while saving the record.',
        });
      }
      showNotification(err.message || 'Failed to save student record.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);

    try {
      await studentApi.deleteStudent(studentToDelete.id);
      showNotification(
        `Student "${studentToDelete.name}" (${studentToDelete.rollNumber}) removed from registry.`,
        'success'
      );
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      await loadData(activeSearchTerm, selectedBranch);
    } catch (err) {
      console.error('Delete student error:', err);
      showNotification(err.message || 'Failed to delete student record.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Extract unique branches from database for dropdown
  const uniqueBranches = Array.from(
    new Set(students.map((s) => s.branch).filter(Boolean))
  ).sort();

  return (
    <div className="app-layout">
      {/* Navbar with brand and total registered student badge */}
      <Navbar
        totalStudents={stats.totalStudents}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Content Area */}
      <main className="main-container">
        {/* Backend offline warning banner */}
        {!backendConnected && (
          <div className="backend-alert-banner">
            <div className="alert-content">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <strong>Backend Connection Notice:</strong> Could not connect to the Spring Boot REST API at <code>http://localhost:8080</code>.
                Make sure the backend server is running via <code>mvn spring-boot:run</code>.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => loadData(activeSearchTerm, selectedBranch)}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Top Statistics Overview */}
        <StatsOverview stats={stats} />

        {/* Search & Filter Controls */}
        <SearchBar
          searchRollNo={searchRollNo}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onResetSearch={handleResetSearch}
          totalResults={students.length}
          isSearching={Boolean(activeSearchTerm)}
          selectedBranch={selectedBranch}
          onBranchFilterChange={handleBranchFilterChange}
          branches={uniqueBranches}
        />

        {/* Main Students Table */}
        <StudentTable
          students={students}
          isLoading={isLoading}
          onEditStudent={handleOpenEditModal}
          onDeleteStudent={handleOpenDeleteModal}
          onOpenAddModal={handleOpenAddModal}
          onResetSearch={handleResetSearch}
          isSearching={Boolean(activeSearchTerm || selectedBranch)}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>Student Record Management System &bull; Java Spring Boot & React.js</p>
          <div className="footer-links">
            <a
              href="http://localhost:8080/h2-console"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
              title="Open H2 Database Console"
            >
              H2 Database Console
            </a>
            <span>&bull;</span>
            <span className="footer-status">REST API Status: {backendConnected ? '🟢 Online' : '🔴 Offline'}</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Student Modal */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
        isSubmitting={isSubmitting}
        serverErrors={formServerErrors}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        student={studentToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
