import React from 'react'
import './ActionButtons.css'

export default function ActionButtons({ onView, onEdit, onDelete }) {
  return (
    <div className="action-buttons">
      {onView && (
        <button 
          className="action-btn action-btn-view"
          onClick={onView}
          title="View Details"
        >
          👁️ View
        </button>
      )}
      <button 
        className="action-btn action-btn-edit"
        onClick={onEdit}
        title="Edit"
      >
        ✏️ Edit
      </button>
      <button 
        className="action-btn action-btn-delete"
        onClick={onDelete}
        title="Delete"
      >
        🗑️ Delete
      </button>
    </div>
  )
}
