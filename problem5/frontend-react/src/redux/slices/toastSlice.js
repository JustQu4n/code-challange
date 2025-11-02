import { createSlice } from '@reduxjs/toolkit'

let toastId = 0

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: []
  },
  reducers: {
    addToast(state, action) {
      const id = ++toastId
      const { message, type = 'info', duration = 3000 } = action.payload
      state.toasts.push({ id, message, type, duration })
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    }
  }
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer
