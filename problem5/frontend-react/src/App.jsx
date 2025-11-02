import React from 'react'
import { useSelector } from 'react-redux'
import Homepage from './pages/Homepage'
import ToastContainer from './components/common/Toast'
import './styles/global.css'

export default function App(){
  const toasts = useSelector((state) => state.toast.toasts)

  return (
    <>
      <Homepage />
      <ToastContainer toasts={toasts} />
    </>
  )
}
