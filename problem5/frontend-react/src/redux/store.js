import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from './slices/exampleSlice'
import toastReducer from './slices/toastSlice'

const store = configureStore({
  reducer: {
    example: exampleReducer,
    toast: toastReducer,
  }
})

export default store
