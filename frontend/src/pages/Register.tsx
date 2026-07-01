import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password })
      setAuth(data.access_token, data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 40, width: 380,
        borderTop: '3px solid #dc2626',
      }}>
        <h1 style={{ color: '#dc2626', fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
          PIPE<span style={{ color: '#eee' }}>WATCH</span>
        </h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: 24, fontSize: 13 }}>Create your account</p>

        {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
          style={inpStyle} required />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          style={inpStyle} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={inpStyle} required />

        <button type="submit" style={{
          width: '100%', background: '#dc2626', color: '#fff', border: 'none', padding: 12,
          borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 15, marginTop: 8,
        }}>Register</button>

        <p style={{ color: '#666', textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          Already have an account? <Link to="/login" style={{ color: '#dc2626' }}>Sign In</Link>
        </p>
      </form>
    </div>
  )
}

const inpStyle: React.CSSProperties = {
  width: '100%', background: '#0f0f0f', border: '1px solid #333', borderRadius: 6,
  padding: '10px 14px', color: '#eee', fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box',
}
