import { useState, useEffect } from 'react'

export default function useFetch(url, options){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    if(!url) return
    let cancelled = false
    setLoading(true)
    fetch(url, options)
      .then(res => {
        if(!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(json => { if(!cancelled) setData(json) })
      .catch(err => { if(!cancelled) setError(err) })
      .finally(()=> { if(!cancelled) setLoading(false) })

    return ()=> { cancelled = true }
  },[url, options])

  return { data, loading, error }
}
