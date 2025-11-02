import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToast } from '../redux/slices/toastSlice'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import ProductForm from '../components/forms/ProductForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import ActionButtons from '../components/common/ActionButtons'
import ProductDetail from './ProductDetail'
import useFetch from '../hooks/useFetch'
import { API_ENDPOINTS } from '../config/api'
import './Homepage.css'

export default function Homepage() {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingProduct, setEditingProduct] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, productId: null, productName: '' })
  const [viewingProductId, setViewingProductId] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 5
  })
  
  // Build query string from filters
  const buildQueryString = () => {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.search) params.append('search', filters.search)
    params.append('page', filters.page.toString())
    params.append('limit', filters.limit.toString())
    params.append('refresh', refreshKey.toString())
    return params.toString()
  }
  
  // Fetch products from API with refresh key - MUST be before any conditional returns
  const { data: apiResponse, loading, error } = useFetch(`${API_ENDPOINTS.products}?${buildQueryString()}`)
  
  // Extract products array from API response
  const products = apiResponse?.data || []
  const pagination = apiResponse?.pagination || null
  
  // Show product detail view if a product is selected
  if (viewingProductId !== null) {
    return (
      <ProductDetail 
        productId={viewingProductId} 
        onBack={() => {
          setViewingProductId(null)
          setRefreshKey(prev => prev + 1) // Refresh list when coming back
        }}
      />
    )
  }
  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'imageUrl',
      label: 'Image',
      render: (value, row) => (
        <div style={{ 
          width: '50px', 
          height: '50px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
          background: '#f3f4f6'
        }}>
          {value ? (
            <img 
              src={value} 
              alt={row.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = '<span style="font-size: 1.5rem; opacity: 0.3;">📦</span>'
              }}
            />
          ) : (
            <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>📦</span>
          )}
        </div>
      )
    },
    { 
      key: 'name', 
      label: 'Product Name',
      render: (value, row) => (
        <span 
          style={{ 
            color: '#2563eb', 
            cursor: 'pointer', 
            fontWeight: 500,
            textDecoration: 'underline'
          }}
          onClick={() => setViewingProductId(row.id)}
          title="Click to view details"
        >
          {value}
        </span>
      )
    },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (value) => (
        <span style={{ color: value < 20 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
          {value}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <ActionButtons
          onView={() => setViewingProductId(row.id)}
          onEdit={() => handleEditClick(row)}
          onDelete={() => handleDeleteClick(row)}
        />
      )
    }
  ]

  const showToast = (type, message) => {
    const defaultMessages = {
      success: 'Operation completed successfully!',
      error: 'An error occurred. Please try again.',
      warning: 'Warning: Please check your input.',
      info: 'This is an informational message.',
    }
    dispatch(addToast({ 
      message: message || defaultMessages[type], 
      type, 
      duration: 3000 
    }))
  }

  const handleCreateProduct = async (formData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(API_ENDPOINTS.products, {
        method: 'POST',
        body: formData // FormData is sent directly, don't set Content-Type header
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const newProduct = result.data || result
      
      // Show success toast
      showToast('success', `Product "${newProduct.name}" created successfully!`)
      
      // Close modal
      setIsModalOpen(false)
      
      // Refresh products list
      setRefreshKey(prev => prev + 1)
      
    } catch (error) {
      console.error('Error creating product:', error)
      showToast('error', `Failed to create product: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleUpdateProduct = async (formData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${API_ENDPOINTS.products}/${editingProduct.id}`, {
        method: 'PUT',
        body: formData // FormData is sent directly
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const updatedProduct = result.data || result
      
      // Show success toast
      showToast('success', `Product "${updatedProduct.name}" updated successfully!`)
      
      // Close modal and reset editing state
      setIsModalOpen(false)
      setEditingProduct(null)
      
      // Refresh products list
      setRefreshKey(prev => prev + 1)
      
    } catch (error) {
      console.error('Error updating product:', error)
      showToast('error', `Failed to update product: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (product) => {
    setConfirmDialog({
      isOpen: true,
      productId: product.id,
      productName: product.name
    })
  }

  const handleConfirmDelete = async () => {
    const { productId, productName } = confirmDialog
    
    try {
      const response = await fetch(`${API_ENDPOINTS.products}/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Show success toast
      showToast('success', `Product "${productName}" deleted successfully!`)
      
      // Refresh products list
      setRefreshKey(prev => prev + 1)
      
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('error', `Failed to delete product: ${error.message}`)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to page 1 when filters change
    }))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setRefreshKey(prev => prev + 1)
  }

  const handleClearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      page: 1,
      limit: 5
    })
    setRefreshKey(prev => prev + 1)
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
    setRefreshKey(prev => prev + 1)
  }

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsModalOpen(false)
      setEditingProduct(null)
    }
  }

  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      handleUpdateProduct(formData)
    } else {
      handleCreateProduct(formData)
    }
  }

  return (
    <div className="homepage-layout">
      <Header />
      
      <main className="homepage-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to CRUDER Client</h1>
            <p className="hero-subtitle">
              A modern React + Redux starter with pre-built components
            </p>
          </div>
        </section>


        {/* Table Demo Section */}
        <section className="demo-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Products</h2>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setEditingProduct(null)
                setIsModalOpen(true)
              }}
            >
              ➕ Create Product
            </button>
          </div>

          {/* Search and Filter Form */}
          <div className="filter-container">
            <form onSubmit={handleSearchSubmit} className="filter-form">
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="search" className="filter-label">Search</label>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    className="filter-input"
                    placeholder="Search by name or description..."
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="category" className="filter-label">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="filter-input"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                    <option value="Sports">Sports</option>
                    <option value="Toys">Toys</option>
                    <option value="Food">Food</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="minPrice" className="filter-label">Min Price</label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    className="filter-input"
                    placeholder="$0"
                    min="0"
                    step="0.01"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="maxPrice" className="filter-label">Max Price</label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    className="filter-input"
                    placeholder="$9999"
                    min="0"
                    step="0.01"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button type="submit" className="btn btn-primary">
                  🔍 Search
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleClearFilters}
                >
                  ✕ Clear Filters
                </button>
              </div>
            </form>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading products...
            </div>
          )}
          {error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#ef4444',
              background: '#fef2f2',
              borderRadius: '8px'
            }}>
              Error loading products: {error.message}
            </div>
          )}
          {!loading && !error && products && (
            <>
              <Table 
                columns={columns} 
                data={products} 
                sortable={false}
                pagination={false}
              />
              
              {/* Backend Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="pagination-container">
                  <button 
                    className="btn btn-outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total products)
                  </span>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />

      {/* Create/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        size="medium"
      >
        <ProductForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          isSubmitting={isSubmitting}
          initialData={editingProduct}
          mode={editingProduct ? 'edit' : 'create'}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, productId: null, productName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDialog.productName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}
