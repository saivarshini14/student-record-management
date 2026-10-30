import React from 'react';

export default function StatsOverview({ stats }) {
  const {
    totalStudents = 0,
    averageMarks = 0,
    highestMarks = 0,
    lowestMarks = 0,
    passCount = 0,
    failCount = 0,
    passPercentage = 0,
  } = stats || {};

  return (
    <div className="stats-grid">
      {/* Total Students Registered - Highlighted Requirement */}
      <div className="stat-card stat-total">
        <div className="stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Registered Students</span>
          <div className="stat-value-group">
            <span className="stat-number">{totalStudents}</span>
            <span className="stat-subtext">active in database</span>
          </div>
        </div>
      </div>

      {/* Average Marks */}
      <div className="stat-card stat-average">
        <div className="stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Class Average Marks</span>
          <div className="stat-value-group">
            <span className="stat-number">{averageMarks.toFixed(1)}</span>
            <span className="stat-unit">/ 100</span>
          </div>
        </div>
      </div>

      {/* Highest & Lowest Score */}
      <div className="stat-card stat-top">
        <div className="stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Highest Score</span>
          <div className="stat-value-group">
            <span className="stat-number">{highestMarks.toFixed(1)}</span>
            <span className="stat-subtext">Low: {lowestMarks.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Passing Statistics */}
      <div className="stat-card stat-pass">
        <div className="stat-icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Pass Rate</span>
          <div className="stat-value-group">
            <span className="stat-number">{passPercentage}%</span>
            <span className="stat-subtext">{passCount} Pass &bull; {failCount} Fail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
