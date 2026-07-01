import React, { useState } from 'react'

const unitTypes = [
  'atmospheric_distillation', 'vacuum_distillation', 'catalytic_cracker',
  'hydrocracker', 'reformer', 'alkylation', 'coker', 'hydrotreater',
]

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #334155',
  background: '#0f172a', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = { color: '#94a3b8', fontSize: 13, marginBottom: 4, display: 'block' }

export default function UnitForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState({
    unit_name: '', unit_type: 'atmospheric_distillation', temperature: '', pressure: '', feed_rate: '', product_yield: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      unit_name: form.unit_name,
      unit_type: form.unit_type,
      temperature: parseFloat(form.temperature) || 0,
      pressure: parseFloat(form.pressure) || 0,
      feed_rate: parseFloat(form.feed_rate) || 0,
      product_yield: parseFloat(form.product_yield) || 0,
    })
    setForm({ unit_name: '', unit_type: 'atmospheric_distillation', temperature: '', pressure: '', feed_rate: '', product_yield: '' })
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#1e293b', borderRadius: 10, padding: 24, border: '1px solid #334155', marginBottom: 24,
    }}>
      <h3 style={{ color: '#e2e8f0', margin: '0 0 16px', fontSize: 18 }}>Add Refinery Unit</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Unit Name</label>
          <input name="unit_name" value={form.unit_name} onChange={handleChange} style={inputStyle} required />
        </div>
        <div>
          <label style={labelStyle}>Unit Type</label>
          <select name="unit_type" value={form.unit_type} onChange={handleChange} style={inputStyle}>
            {unitTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Temperature (°C)</label>
          <input name="temperature" type="number" value={form.temperature} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Pressure</label>
          <input name="pressure" type="number" value={form.pressure} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Feed Rate</label>
          <input name="feed_rate" type="number" value={form.feed_rate} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Product Yield</label>
          <input name="product_yield" type="number" value={form.product_yield} onChange={handleChange} style={inputStyle} />
        </div>
      </div>
      <button type="submit" style={{
        marginTop: 16, background: '#2563eb', color: '#fff', border: 'none', padding: '10px 24px',
        borderRadius: 6, cursor: 'pointer', fontSize: 15, fontWeight: 600,
      }}>Add Unit</button>
    </form>
  )
}
