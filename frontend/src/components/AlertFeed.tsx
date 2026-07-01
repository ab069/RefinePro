import React from 'react'

interface Alert {
  id: string
  title: string
  alert_type: string
  severity: string
  status: string
  description: string
  created_at: string
  unit_name: string
}

function sevColor(s: string): string {
  const colors: Record<string, string> = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#60a5fa' }
  return colors[s] || '#94a3b8'
}

export default function AlertFeed({ alerts, onUpdateStatus }: { alerts: Alert[]; onUpdateStatus: (id: string, status: string) => void }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ color: '#e2e8f0', margin: '0 0 12px', fontSize: 18 }}>Alerts</h3>
      {alerts.map((a) => (
        <div key={a.id} style={{
          background: '#1e293b', borderRadius: 8, padding: '10px 16px', border: '1px solid #334155',
          marginBottom: 6, color: '#e2e8f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{a.title}</strong>
              {a.unit_name && <span style={{ color: '#94a3b8', marginLeft: 8, fontSize: 13 }}>({a.unit_name})</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: sevColor(a.severity), fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{a.severity}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{a.status}</span>
              {a.status === 'active' && (
                <button onClick={() => onUpdateStatus(a.id, 'acknowledged')} style={{
                  background: '#2563eb', color: '#fff', border: 'none', padding: '4px 10px',
                  borderRadius: 4, cursor: 'pointer', fontSize: 12,
                }}>Ack</button>
              )}
            </div>
          </div>
          {a.description && <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{a.description}</div>}
        </div>
      ))}
      {alerts.length === 0 && <div style={{ color: '#64748b', textAlign: 'center', padding: 24 }}>No alerts</div>}
    </div>
  )
}
