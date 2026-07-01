import React, { useState } from 'react'

interface Unit {
  id: string
  unit_name: string
  unit_type: string
  status: string
  temperature: number
  pressure: number
  feed_rate: number
  product_yield: number
  efficiency: number
  created_at: string
}

function effColor(eff: number): string {
  if (eff >= 70) return '#22c55e'
  if (eff >= 40) return '#eab308'
  return '#ef4444'
}

function statusColor(s: string): string {
  const colors: Record<string, string> = { online: '#22c55e', offline: '#ef4444', maintenance: '#eab308', startup: '#60a5fa' }
  return colors[s] || '#94a3b8'
}

const rowStyle: React.CSSProperties = {
  background: '#1e293b', borderRadius: 8, padding: '12px 16px', border: '1px solid #334155',
  cursor: 'pointer', color: '#e2e8f0', marginBottom: 8,
}

export default function UnitList({ units, onDelete }: { units: Unit[]; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ color: '#e2e8f0', margin: '0 0 12px', fontSize: 18 }}>Refinery Units</h3>
      {units.map((u) => (
        <div key={u.id}>
          <div style={rowStyle} onClick={() => setExpanded(expanded === u.id ? null : u.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{u.unit_name}</strong>
                <span style={{ color: '#94a3b8', marginLeft: 8, fontSize: 13 }}>{u.unit_type.replace(/_/g, ' ')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: statusColor(u.status), fontSize: 13, fontWeight: 600 }}>{u.status}</span>
                <span style={{ color: effColor(u.efficiency), fontWeight: 700 }}>{u.efficiency}%</span>
              </div>
            </div>
          </div>
          {expanded === u.id && (
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, marginBottom: 8, border: '1px solid #334155', color: '#cbd5e1', fontSize: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>Temperature: <strong>{u.temperature}°C</strong></div>
                <div>Pressure: <strong>{u.pressure}</strong></div>
                <div>Feed Rate: <strong>{u.feed_rate}</strong></div>
                <div>Product Yield: <strong>{u.product_yield}</strong></div>
                <div>Efficiency: <strong style={{ color: effColor(u.efficiency) }}>{u.efficiency}%</strong></div>
                <div>Status: <strong style={{ color: statusColor(u.status) }}>{u.status}</strong></div>
              </div>
              <button onClick={() => onDelete(u.id)} style={{
                marginTop: 12, background: '#dc2626', color: '#fff', border: 'none',
                padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
              }}>Delete</button>
            </div>
          )}
        </div>
      ))}
      {units.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: 24 }}>No units yet</div>}
    </div>
  )
}
