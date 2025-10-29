import React, { useEffect, useState } from 'react'
import { createProduct, updateProduct, createProductWithImage, updateProductWithImage } from '../services/api'

export default function ProductForm({ product, onCreated, onSaved, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' })
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      </div>

      <div className="row">
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} />
      </div>

      <div className="row two">
        <div>
          <input name="price" placeholder="Price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
        </div>
        <div>
          <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} required />
        </div>
      </div>

      <div className="row">
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      </div>

      <div className="row">
        <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Image</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files && e.target.files[0])} />
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
