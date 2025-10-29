import React, { useEffect, useState } from 'react'
import ProductList from './components/ProductList'
import ProductForm from './components/ProductForm'
import { getProducts } from './services/api'

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ page: 1, limit: 10 })
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 })
  const [editing, setEditing] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const fetchList = async (opts = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getProducts({ ...filters, ...opts })
      setProducts(res.data || [])
      if (res.pagination) setPagination(res.pagination)
    } catch (err) {
      setError(err.message || 'Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.limit])

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Crude Client</h1>
          <p className="muted">Simple CRUD UI connected to product API (http://localhost:5000/api)</p>
        </div>
        <div>
          <button className="btn" onClick={() => setShowCreate(true)}>Create Product</button>
        </div>
      </header>

      <main>
        <ProductList
          products={products}
          loading={loading}
          error={error}
          pagination={pagination}
          filters={filters}
          onChangeFilters={(next) => setFilters((s) => ({ ...s, ...next }))}
          onRefresh={() => fetchList()}
          onEdit={(p) => {
            setEditing(p)
            setShowEdit(true)
          }}
          onDeleted={() => fetchList()}
        />

        {showEdit && editing && (
          <div className="modal-backdrop" onMouseDown={() => setShowEdit(false)}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Product</h2>
                <button className="btn ghost" onClick={() => setShowEdit(false)}>Close</button>
              </div>
              <div className="modal-body">
                <ProductForm
                  product={editing}
                  onSaved={() => {
                    setShowEdit(false)
                    setEditing(null)
                    fetchList()
                  }}
                  onCancel={() => {
                    setShowEdit(false)
                    setEditing(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="modal-backdrop" onMouseDown={() => setShowCreate(false)}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Product</h2>
                <button className="btn ghost" onClick={() => setShowCreate(false)}>Close</button>
              </div>
              <div className="modal-body">
                <ProductForm
                  onCreated={() => {
                    setShowCreate(false)
                    setFilters((s) => ({ ...s, page: 1 }))
                    fetchList({ page: 1 })
                  }}
                  onCancel={() => setShowCreate(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
