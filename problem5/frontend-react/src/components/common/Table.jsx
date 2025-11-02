import React, { useState } from 'react'
import './Table.css'

export default function Table({ 
  columns, 
  data, 
  sortable = true, 
  pagination = false,
  pageSize = 10 
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)

  // Sorting logic
  const sortedData = React.useMemo(() => {
    // Ensure data is always an array
    if (!data || !Array.isArray(data)) return []
    
    if (!sortable || !sortConfig.key) return data

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [data, sortConfig, sortable])

  // Pagination logic
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key) => {
    if (!sortable) return

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '⇅'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key}
                onClick={() => sortable && handleSort(col.key)}
                className={sortable ? 'sortable' : ''}
              >
                {col.label}
                {sortable && <span className="sort-icon">{getSortIcon(col.key)}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-state">
                No data available
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="table-pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
