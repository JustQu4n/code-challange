import React, { useState } from 'react'
import { deleteProduct } from '../services/api'

export default function ProductList({ products, loading, error, pagination, filters, onChangeFilters, onRefresh, onEdit, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      setDeletingId(id)
      await deleteProduct(id)
      onDeleted && onDeleted()
    } catch (err) {
      alert(err.message || 'Error deleting product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="panel simple-list">
      <div className="panel-header">
        <div className="left">
          <input
            className="search"
            placeholder="Search products..."
            defaultValue={filters.search || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onChangeFilters({ page: 1, search: e.target.value })
            }}
          />
        </div>
        <div className="right">
          <button className="btn ghost" onClick={() => onRefresh()}>Seach</button>
        </div>
      </div>

      {loading ? (
        <div className="placeholder">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="cards">
          {products.length === 0 ? (
            <div className="empty">No products found</div>
          ) : (
            products.map((p) => {
              const src = p.imageUrl || (p.image ? `http://localhost:5000/uploads/${p.image}` : null)
              return (
                <article className="card" key={p.id}>
                  {src && (
                    <div className="card-media">
                      <img src={src} alt={p.name} />
                    </div>
                  )}

                  <div className="card-main">
                    <div className="card-title">{p.name}</div>
                    <div className="card-desc muted">{p.description}</div>
                  </div>
                  <div className="card-meta">
                    <div className="meta">{p.category || '—'}</div>
                    <div className="meta price">{Number(p.price).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div>
                    <div className="meta stock">Stock: {p.stock}</div>
                  </div>
                  <div className="card-actions">
                    <button className="btn ghost" onClick={() => onEdit && onEdit(p)}>Edit</button>
                    <button className="btn danger" onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}>
                      {deletingId === p.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      )}

      <div className="panel-footer">
        <div className="muted">Total: {pagination.total || 0} • Page {pagination.page || 1} / {pagination.totalPages || 1}</div>
      </div>
    </section>
  )
}
