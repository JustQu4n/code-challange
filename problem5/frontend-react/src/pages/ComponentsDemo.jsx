import React from 'react'
import { useDispatch } from 'react-redux'
import { addToast } from '../redux/slices/toastSlice'
import Menu from '../components/common/Menu'

export default function ComponentsDemo() {
  const dispatch = useDispatch()

  const menuItems = [
    {
      key: 'home',
      label: 'Home',
      icon: '🏠',
      href: '/',
    },
    {
      key: 'products',
      label: 'Products',
      icon: '📦',
      href: '/products',
      badge: '5',
    },
    {
      key: 'services',
      label: 'Services',
      icon: '⚙️',
      href: '/services',
    },
    {
      key: 'about',
      label: 'About',
      icon: 'ℹ️',
      href: '/about',
    },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Components Demo</h1>
      
      <section style={{ marginBottom: 60 }}>
        <h2>Menu Component - Horizontal</h2>
        <Menu items={menuItems} orientation="horizontal" />
      </section>

      <section style={{ marginBottom: 60 }}>
        <h2>Menu Component - Vertical</h2>
        <div style={{ maxWidth: 300 }}>
          <Menu items={menuItems} orientation="vertical" />
        </div>
      </section>

      <section>
        <h2>Toast Notifications</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button 
            className="btn btn-success"
            onClick={() => dispatch(addToast({ message: 'Success toast!', type: 'success' }))}
          >
            Success
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => dispatch(addToast({ message: 'Error toast!', type: 'error' }))}
          >
            Error
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => dispatch(addToast({ message: 'Warning toast!', type: 'warning' }))}
          >
            Warning
          </button>
          <button 
            className="btn btn-info"
            onClick={() => dispatch(addToast({ message: 'Info toast!', type: 'info' }))}
          >
            Info
          </button>
        </div>
      </section>
    </div>
  )
}
