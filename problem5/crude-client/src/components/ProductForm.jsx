import React, { useEffect, useState } from 'react'
import { createProduct, updateProduct, createProductWithImage, updateProductWithImage } from '../services/api'

export default function ProductForm({ product, onCreated, onSaved, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' })
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || 0,
      })
      // set existing preview if available
      setPreview(product.imageUrl || (product.image ? `http://localhost:5000/uploads/${product.image}` : null))
    }
  }, [product])

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }))

  const validateField = (name, value) => {
    switch (name) {
      case 'name': {
        if (!value || String(value).trim() === '') return 'Name is required'
        if (String(value).trim().length < 2) return 'Name must be at least 2 characters'
        return ''
      }
      case 'price': {
        if (value === '' || value === null || value === undefined) return 'Price is required'
        const n = Number(value)
        if (Number.isNaN(n)) return 'Price must be a number'
        if (n < 0) return 'Price cannot be negative'
        return ''
      }
      case 'stock': {
        if (value === '' || value === null || value === undefined) return 'Stock is required'
        const n = Number(value)
        if (!Number.isInteger(n)) return 'Stock must be an integer'
        if (n < 0) return 'Stock cannot be negative'
        return ''
      }
      case 'description': {
        if (value && String(value).length > 2000) return 'Description is too long'
        return ''
      }
      case 'category': return ''
      default: return ''
    }
  }

  const validateForm = (f, fileObj) => {
    const next = {}
    const nameErr = validateField('name', f.name)
    if (nameErr) next.name = nameErr
    const priceErr = validateField('price', f.price)
    if (priceErr) next.price = priceErr
    const stockErr = validateField('stock', f.stock)
    if (stockErr) next.stock = stockErr
    const descErr = validateField('description', f.description)
    if (descErr) next.description = descErr

    // file validation
    if (fileObj) {
      const maxBytes = 5 * 1024 * 1024 // 5MB
      if (!fileObj.type || !fileObj.type.startsWith('image/')) next.image = 'File must be an image'
      else if (fileObj.size > maxBytes) next.image = 'Image must be smaller than 5MB'
    }

    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // run validation
    const validation = validateForm(form, file)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      // focus the first invalid field if possible
      const first = Object.keys(validation)[0]
      const el = document.querySelector(`[name="${first}"]`)
      if (el && el.focus) el.focus()
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
      }
      if (product && product.id) {
        if (file) {
          await updateProductWithImage(product.id, payload, file)
        } else {
          await updateProduct(product.id, payload)
        }
        onSaved && onSaved()
      } else {
        if (file) {
          await createProductWithImage(payload, file)
        } else {
          await createProduct(payload)
        }
        setForm({ name: '', description: '', price: '', category: '', stock: '' })
        setFile(null)
        setPreview(null)
        onCreated && onCreated()
      }
    } catch (err) {
      alert(err.message || 'Error saving product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="product-form simple-form" onSubmit={handleSubmit}>
      <div className="row">
        <input name="name" placeholder="Name" value={form.name} onChange={(e) => { handleChange(e); setErrors((s) => { const copy = { ...s }; const v = validateField('name', e.target.value); if (v) copy.name = v; else delete copy.name; return copy }) }} onBlur={(e) => setErrors((s) => ({ ...s, ...(validateField('name', e.target.value) ? { name: validateField('name', e.target.value) } : {}) }))} />
        {errors.name && <div className="field-error" style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{errors.name}</div>}
      </div>

      <div className="row">
        <textarea name="description" placeholder="Description" value={form.description} onChange={(e) => { handleChange(e); setErrors((s) => { const copy = { ...s }; const v = validateField('description', e.target.value); if (v) copy.description = v; else delete copy.description; return copy }) }} rows={3} />
        {errors.description && <div className="field-error" style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{errors.description}</div>}
      </div>

      <div className="row two">
        <div>
          <input name="price" placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => { handleChange(e); setErrors((s) => { const copy = { ...s }; const v = validateField('price', e.target.value); if (v) copy.price = v; else delete copy.price; return copy }) }} />
          {errors.price && <div className="field-error" style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{errors.price}</div>}
        </div>
        <div>
          <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={(e) => { handleChange(e); setErrors((s) => { const copy = { ...s }; const v = validateField('stock', e.target.value); if (v) copy.stock = v; else delete copy.stock; return copy }) }} />
          {errors.stock && <div className="field-error" style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{errors.stock}</div>}
        </div>
      </div>

      <div className="row">
        <input name="category" placeholder="Category" value={form.category} onChange={(e) => { handleChange(e); setErrors((s) => { const copy = { ...s }; const v = validateField('category', e.target.value); if (v) copy.category = v; else delete copy.category; return copy }) }} />
        {errors.category && <div className="field-error" style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{errors.category}</div>}
      </div>

      <div className="row">
        <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Image</label>
        <input type="file" accept="image/*" onChange={(e) => {
          const f = e.target.files && e.target.files[0]
          // validate image immediately
          if (f) {
            const maxBytes = 5 * 1024 * 1024
            if (!f.type || !f.type.startsWith('image/')) {
              setErrors((s) => ({ ...s, image: 'File must be an image' }))
            } else if (f.size > maxBytes) {
              setErrors((s) => ({ ...s, image: 'Image must be smaller than 5MB' }))
            } else {
              setErrors((s) => { const copy = { ...s }; delete copy.image; return copy })
            }
          } else {
            setErrors((s) => { const copy = { ...s }; delete copy.image; return copy })
          }
          setFile(f)
        }} />
        {errors.image && <div className="field-error" style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{errors.image}</div>}
        {preview && (
          <div style={{ marginTop: 8 }}>
            <img src={preview} alt="preview" style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 6 }} />
          </div>
        )}
      </div>

      <div className="row actions">
        <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : product ? 'Save' : 'Create'}</button>
        {onCancel && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
