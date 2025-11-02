import React from 'react'
import { useDispatch } from 'react-redux'
import { addToast } from '../redux/slices/toastSlice'
import Table from '../components/common/Table'
import useFetch from '../hooks/useFetch'
import { API_ENDPOINTS } from '../config/api'
import './Products.css'

export default function Products() {
  const dispatch = useDispatch()
  const { data: products, loading, error } = useFetch(API_ENDPOINTS.products)

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (value) => (
        <span style={{ 
          color: value < 20 ? '#ef4444' : value < 50 ? '#f59e0b' : '#10b981', 
          fontWeight: 600 
        }}>
          {value}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    { 
      key: 'updatedAt', 
      label: 'Last Updated',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
  ]

  const handleRefresh = () => {
    window.location.reload()
    dispatch(addToast({ 
      message: 'Refreshing products...', 
      type: 'info', 
      duration: 2000 
    }))
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1 className="products-title">Products</h1>
          <p className="products-subtitle">
            Manage and view all products from the API
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="products-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Failed to load products</h3>
            <p>{error.message}</p>
            <button className="btn btn-primary" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products && (
          <>
            <div className="products-stats">
              <div className="stat-card">
                <div className="stat-value">{products.length}</div>
                <div className="stat-label">Total Products</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {products.filter(p => p.stock < 20).length}
                </div>
                <div className="stat-label">Low Stock</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {new Set(products.map(p => p.category)).size}
                </div>
                <div className="stat-label">Categories</div>
              </div>
            </div>

            <Table 
              columns={columns} 
              data={products} 
              sortable 
              pagination 
              pageSize={10} 
            />
          </>
        )}
      </div>
    </div>
  )
}
