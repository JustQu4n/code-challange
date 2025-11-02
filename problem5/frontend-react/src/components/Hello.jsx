import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from '../redux/slices/exampleSlice'
import useWindowSize from '../hooks/useWindowSize'

export default function Hello(){
  const count = useSelector((s)=> s.example.value)
  const dispatch = useDispatch()
  const { width } = useWindowSize()

  return (
    <section style={{marginTop:16}}>
      <div className="card">
        <h2>Hello from the component</h2>
        <p>Window width: {width}px</p>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button onClick={()=>dispatch(decrement())}>-</button>
          <strong>{count}</strong>
          <button onClick={()=>dispatch(increment())}>+</button>
        </div>
      </div>
    </section>
  )
}
