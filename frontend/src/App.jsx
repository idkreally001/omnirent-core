// frontend/src/App.jsx
import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState("Waiting for backend...")

  useEffect(() => {
    // This is the handshake call
    axios.get('http://localhost:5000/api/handshake')
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error("The handshake failed:", error)
        setMessage("Backend is not responding.")
      })
  }, [])

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>OmniRent Project</h1>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{message}</p>
    </div>
  )
}

export default App