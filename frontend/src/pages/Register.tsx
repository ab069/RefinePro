import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const pageStyle: React.CSSProperties = {
  minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const cardStyle: React.CSSProperties = {
  background: '#1e293b', padding: 40, borderRadius: 12, border: '1px solid #334155', width: 380,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #334155',
  background: '#0f172a', color: '#e2e8f0', fontSize: 14, marginBottom: 16, boxSizing: 'border-box',
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    try {
      await register(email, password, name)
      navigate('/dashboard')
    } catch {
      setErr('Registration failed')
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#e2e8f0', margin: '0 0 24px', textAlign: 'center', fontSize: 28 }}>RefinePro</h2>
        <h3 style={{ color: '#94a3b8', margin: '0 0 20px', textAlign: 'center', fontSize: 16, fontWeight: 400 }}>Create account</h3>
        {err && <div style={{ color: '#ef4444', marginBottom: 12, textAlign: 'center', fontSize: 14 }}>{err}</div>}
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={{
            width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none',
            borderRadius: 6, cursor: 'pointer', fontSize: 16, fontWeight: 600,
          }}>Register</button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          Have an account? <Link to="/login" style={{ color: '#60a5fa' }}>Login</Link>
        </div>
      </div>
    </div>
  )
}
