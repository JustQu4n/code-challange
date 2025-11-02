import { useState, useEffect } from 'react'

export default function useWindowSize(){
  const isClient = typeof window === 'object'
  function getSize(){
    return {
      width: isClient ? window.innerWidth : 0,
      height: isClient ? window.innerHeight : 0,
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(()=>{
    if(!isClient) return
    function onResize(){ setWindowSize(getSize()) }
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  }, [])

  return windowSize
}
