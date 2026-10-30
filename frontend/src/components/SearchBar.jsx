import React, { useState } from 'react';

export default function SearchBar({
  searchRollNo,
  onSearchChange,
  onSearchSubmit,
  onResetSearch,
  totalResults,
  isSearching,
  selectedBranch,
  onBranchFilterChange,
  branches,
}) {
  const [localInput, setLocalInput] = useState(searchRollNo || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(localInput);
  };

  const handleClear = () => {
    setLocalInput('');
    onResetSearch();
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setLocalInput(val);
    onSearchChange(val);
  };

  return (
    <div className="search-filter-card">
      <div className="search-row">
        {/* Roll Number Search Form */}
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-group">
            <span className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by student roll number (e.g. CS2024-001)..."
              value={localInput}
              onChange={handleInputChange}
              aria-label="Search by Roll Number"
            />
            {localInput && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-secondary btn-search">
            Search Roll No
          </button>
          {isSearching && (
            <button
              type="button"
              className="btn btn-outline btn-reset"
              onClick={handleClear}
            >
              Reset
            </button>
          )}
        </form>

        {/* Branch Filter Dropdown */}
        <div className="branch-filter-group">
          <label htmlFor="branch-filter" className="branch-filter-label">
            Filter Branch:
          </label>
          <select
            id="branch-filter"
            className="branch-filter-select"
            value={selectedBranch}
            onChange={(e) => onBranchFilterChange(e.target.value)}
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Search / Filter Feedback Bar */}
      {(isSearching || selectedBranch) && (
        <div className="search-status-bar">
          <span className="search-status-text">
            Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'record' : 'records'}
            {isSearching && <span> matching roll number <code>"{searchRollNo}"</code></span>}
            {selectedBranch && <span> in branch <strong>"{selectedBranch}"</strong></span>}
          </span>
          <button
            type="button"
            className="btn-text-link"
            onClick={handleClear}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
