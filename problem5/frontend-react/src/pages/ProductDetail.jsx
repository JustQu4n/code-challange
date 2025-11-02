import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToast } from '../redux/slices/toastSlice'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Modal from '../components/common/Modal'
import ProductForm from '../components/forms/ProductForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { API_ENDPOINTS } from '../config/api'
import './ProductDetail.css'

export default function ProductDetail({ productId, onBack }) {
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false })

  useEffect(() => {
    fetchProductDetail()
  }, [productId])

  const fetchProductDetail = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_ENDPOINTS.products}/${productId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      // Handle new API response format with nested data
      setProduct(data.data || data)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err.message)
      showToast('error', `Failed to load product: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (type, message) => {
    dispatch(addToast({ message, type, duration: 3000 }))
  }

  const handleUpdateProduct = async (formData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${API_ENDPOINTS.products}/${productId}`, {
        method: 'PUT',
        body: formData // FormData is sent directly
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedProduct = await response.json()
      // Handle new API response format with nested data
      setProduct(updatedProduct.data || updatedProduct)
      showToast('success', `Product updated successfully!`)
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Error updating product:', error)
      showToast('error', `Failed to update product: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.products}/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      showToast('success', `Product "${product.name}" deleted successfully!`)
      
      // Navigate back after short delay
      setTimeout(() => {
        if (onBack) onBack()
      }, 1500)
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('error', `Failed to delete product: ${error.message}`)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' }
    if (stock < 20) return { text: 'Low Stock', class: 'low-stock' }
    if (stock < 50) return { text: 'In Stock', class: 'medium-stock' }
    return { text: 'In Stock', class: 'high-stock' }
  }

  if (loading) {
    return (
      <div className="product-detail-layout">
        <Header />
        <main className="product-detail-main">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-detail-layout">
        <Header />
        <main className="product-detail-main">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Failed to Load Product</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchProductDetail}>
              Try Again
            </button>
            {onBack && (
              <button className="btn btn-outline" onClick={onBack}>
                Go Back
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-layout">
        <Header />
        <main className="product-detail-main">
          <div className="error-container">
            <div className="error-icon">📦</div>
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            {onBack && (
              <button className="btn btn-primary" onClick={onBack}>
                Go Back
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const stockStatus = getStockStatus(product.stock)

  return (
    <div className="product-detail-layout">
      <Header />
      
      <main className="product-detail-main">
        <div className="product-detail-container">
          {/* Header Actions */}
          <div className="detail-header">
            {onBack && (
              <button className="btn-back" onClick={onBack}>
                ← Back to Products
              </button>
            )}
            <div className="detail-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditModalOpen(true)}
              >
                ✏️ Edit Product
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => setConfirmDialog({ isOpen: true })}
              >
                🗑️ Delete Product
              </button>
            </div>
          </div>

          {/* Product Information Card */}
          <div className="product-card">
            <div className="product-header">
              <div>
                <h1 className="product-name">{product.name}</h1>
                <span className="product-id">ID: #{product.id}</span>
              </div>
              <div className={`stock-badge ${stockStatus.class}`}>
                {stockStatus.text}
              </div>
            </div>

            {/* Product Image and Description */}
            <div className="product-overview">
              {product.imageUrl && (
                <div className="product-image-container">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div className="image-placeholder" style={{ display: 'none' }}>
                    <span className="placeholder-icon">🖼️</span>
                    <span className="placeholder-text">No Image</span>
                  </div>
                </div>
              )}
              {!product.imageUrl && (
                <div className="product-image-container">
                  <div className="image-placeholder">
                    <span className="placeholder-icon">🖼️</span>
                    <span className="placeholder-text">No Image Available</span>
                  </div>
                </div>
              )}
              
              {product.description && (
                <div className="product-description">
                  <h3 className="description-title">Description</h3>
                  <p className="description-text">{product.description}</p>
                </div>
              )}
            </div>

            <div className="product-details">
              {/* Main Info */}
              <div className="detail-section">
                <h2 className="section-title">Product Information</h2>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value category-badge">{product.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Price</span>
                    <span className="detail-value price">{product.price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Stock Quantity</span>
                    <span className={`detail-value stock-value ${stockStatus.class}`}>
                      {product.stock} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="detail-section">
                <h2 className="section-title">Timeline</h2>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Created At</span>
                    <span className="detail-value">{formatDate(product.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">{formatDate(product.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="detail-section">
                <h2 className="section-title">Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <div className="stat-label">Price</div>
                      <div className="stat-value">{product.price}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <div className="stat-label">In Stock</div>
                      <div className="stat-value">{product.stock}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-info">
                      <div className="stat-label">Category</div>
                      <div className="stat-value">{product.category}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Warning */}
              {product.stock < 20 && (
                <div className={`alert ${product.stock === 0 ? 'alert-danger' : 'alert-warning'}`}>
                  <span className="alert-icon">⚠️</span>
                  <div className="alert-content">
                    <strong>
                      {product.stock === 0 ? 'Out of Stock!' : 'Low Stock Warning!'}
                    </strong>
                    <p>
                      {product.stock === 0 
                        ? 'This product is currently out of stock. Please restock soon.'
                        : `Only ${product.stock} units remaining. Consider restocking.`
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && setIsEditModalOpen(false)}
        title="Edit Product"
        size="medium"
      >
        <ProductForm
          onSubmit={handleUpdateProduct}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
          initialData={product}
          mode="edit"
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}
