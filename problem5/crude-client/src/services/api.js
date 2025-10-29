const BASE = 'http://localhost:5000/api'

async function request(path, options = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      data = { message: text }
    }
    const err = new Error(data.message || res.statusText)
    err.status = res.status
    err.data = data
    throw err
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export async function getProducts(query = {}) {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, v)
  })
  const path = `/products${params.toString() ? `?${params.toString()}` : ''}`
  return request(path, { method: 'GET' })
}

export async function getProduct(id) {
  return request(`/products/${id}`, { method: 'GET' })
}

export async function createProduct(payload) {
  return request('/products', { method: 'POST', body: JSON.stringify(payload) })
}

export async function updateProduct(id, payload) {
  return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' })
}

// Multipart create/update (for image upload)
export async function createProductWithImage(payload, file) {
  const url = `${BASE}/products`
  const form = new FormData()
  Object.entries(payload || {}).forEach(([k, v]) => form.append(k, v == null ? '' : v))
  if (file) form.append('image', file)

  const res = await fetch(url, { method: 'POST', body: form })
  if (!res.ok) {
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch (e) { data = { message: text } }
    const err = new Error(data.message || res.statusText)
    err.status = res.status
    err.data = data
    throw err
  }
  return res.json()
}

export async function updateProductWithImage(id, payload, file) {
  const url = `${BASE}/products/${id}`
  const form = new FormData()
  Object.entries(payload || {}).forEach(([k, v]) => form.append(k, v == null ? '' : v))
  if (file) form.append('image', file)

  const res = await fetch(url, { method: 'PUT', body: form })
  if (!res.ok) {
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch (e) { data = { message: text } }
    const err = new Error(data.message || res.statusText)
    err.status = res.status
    err.data = data
    throw err
  }
  return res.json()
}

export default { getProducts, getProduct, createProduct, updateProduct, deleteProduct }
