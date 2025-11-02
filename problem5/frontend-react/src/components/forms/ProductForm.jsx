import React, { useState, useEffect } from 'react'
import './ProductForm.css'

export default function ProductForm({ onSubmit, onCancel, isSubmitting, initialData = null, mode = 'create' }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: ''
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  // Populate form with initial data for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price || '',
        stock: initialData.stock?.toString() || ''
      })
      // Set existing image preview
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl)
      }
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }))
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }))
      }
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    // Reset file input
    const fileInput = document.getElementById('image')
    if (fileInput) fileInput.value = ''
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else if (!/^\$?\d+(\.\d{1,2})?$/.test(formData.price.trim())) {
      newErrors.price = 'Invalid price format (e.g., $123 or 123)'
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'Stock is required'
    } else if (!/^\d+$/.test(formData.stock.trim()) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add form fields
      submitData.append('name', formData.name.trim())
      submitData.append('description', formData.description.trim())
      submitData.append('category', formData.category)
      submitData.append('price', formData.price.startsWith('$') ? formData.price : `$${formData.price}`)
      submitData.append('stock', parseInt(formData.stock))
      
      // Add image if selected
      if (imageFile) {
        submitData.append('image', imageFile)
      }
      
      onSubmit(submitData)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Product Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          disabled={isSubmitting}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          disabled={isSubmitting}
          rows="3"
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          className={`form-input ${errors.category ? 'error' : ''}`}
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
          <option value="Sports">Sports</option>
          <option value="Toys">Toys</option>
          <option value="Food">Food</option>
          <option value="Accessories">Accessories</option>
          <option value="Furniture">Furniture</option>
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="image" className="form-label">
          Product Image
        </label>
        <div className="image-upload-container">
          {imagePreview ? (
            <div className="image-preview-wrapper">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button
                type="button"
                className="btn-remove-image"
                onClick={handleRemoveImage}
                disabled={isSubmitting}
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="image-upload-placeholder">
              <span className="upload-icon">📷</span>
              <span className="upload-text">No image selected</span>
            </div>
          )}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="file-input"
          />
          <label htmlFor="image" className={`btn-upload ${isSubmitting ? 'disabled' : ''}`}>
            {imagePreview ? 'Change Image' : 'Choose Image'}
          </label>
        </div>
        {errors.image && <span className="error-message">{errors.image}</span>}
        <span className="form-hint">Maximum file size: 5MB. Accepted formats: JPG, PNG, GIF, WebP</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Price <span className="required">*</span>
          </label>
          <input
            type="text"
            id="price"
            name="price"
            className={`form-input ${errors.price ? 'error' : ''}`}
            value={formData.price}
            onChange={handleChange}
            placeholder="$123 or 123"
            disabled={isSubmitting}
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="stock" className="form-label">
            Stock <span className="required">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            className={`form-input ${errors.stock ? 'error' : ''}`}
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            disabled={isSubmitting}
          />
          {errors.stock && <span className="error-message">{errors.stock}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (mode === 'edit' ? 'Updating...' : 'Creating...') 
            : (mode === 'edit' ? 'Update Product' : 'Create Product')
          }
        </button>
      </div>
    </form>
  )
}
