import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { removeToast } from '../../redux/slices/toastSlice'
import './Toast.css'

function ToastItem({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id))
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast, dispatch])

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      default: return 'ℹ'
    }
  }

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{toast.message}</span>
      <button 
        className="toast-close" 
        onClick={() => dispatch(removeToast(toast.id))}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
