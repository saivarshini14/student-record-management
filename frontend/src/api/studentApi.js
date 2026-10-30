// API service for Student Record Management System
// Uses relative '/api/students' in production (same origin) or VITE_API_URL when decoupled
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/students';

/**
 * Helper to process API responses and format validation errors
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP error ${response.status}`);
    error.status = response.status;
    error.errors = data?.errors || null;
    error.data = data;
    throw error;
  }

  return data;
}

export const studentApi = {
  /**
   * Fetch all students, with optional rollNumber or general search filter
   */
  async getAllStudents(rollNumber = '', generalSearch = '') {
    const params = new URLSearchParams();
    if (rollNumber && rollNumber.trim()) {
      params.append('rollNumber', rollNumber.trim());
    } else if (generalSearch && generalSearch.trim()) {
      params.append('search', generalSearch.trim());
    }

    const url = params.toString() ? `${API_BASE_URL}?${params.toString()}` : API_BASE_URL;
    const res = await fetch(url);
    const result = await handleResponse(res);
    return result.data || [];
  },

  /**
   * Search student specifically by roll number
   */
  async searchByRollNumber(rollNumber) {
    if (!rollNumber || !rollNumber.trim()) {
      return this.getAllStudents();
    }
    const res = await fetch(`${API_BASE_URL}/search?rollNumber=${encodeURIComponent(rollNumber.trim())}`);
    const result = await handleResponse(res);
    return result.data || [];
  },

  /**
   * Fetch single student by ID
   */
  async getStudentById(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    const result = await handleResponse(res);
    return result.data;
  },

  /**
   * Add a new student record
   */
  async createStudent(studentData) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: studentData.name?.trim(),
        rollNumber: studentData.rollNumber?.trim().toUpperCase(),
        branch: studentData.branch?.trim(),
        marks: parseFloat(studentData.marks),
      }),
    });
    const result = await handleResponse(res);
    return result.data;
  },

  /**
   * Update an existing student record
   */
  async updateStudent(id, studentData) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: studentData.name?.trim(),
        rollNumber: studentData.rollNumber?.trim().toUpperCase(),
        branch: studentData.branch?.trim(),
        marks: parseFloat(studentData.marks),
      }),
    });
    const result = await handleResponse(res);
    return result.data;
  },

  /**
   * Delete a student record by ID
   */
  async deleteStudent(id) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  /**
   * Get registration metrics & statistics
   */
  async getStats() {
    const res = await fetch(`${API_BASE_URL}/stats`);
    const result = await handleResponse(res);
    return result.data || {
      totalStudents: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0,
      passCount: 0,
      failCount: 0,
      passPercentage: 0,
    };
  },
};
