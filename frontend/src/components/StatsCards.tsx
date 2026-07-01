import React from 'react'

interface Stats {
  total_units: number
  online_units: number
  avg_efficiency: number
  total_yield: number
}

const cardStyle: React.CSSProperties = {
  background: '#1e293b',
  borderRadius: 10,
  padding: '20px 24px',
  color: '#e2e8f0',
  border: '1px solid #334155',
}

const valStyle: React.CSSProperties = { fontSize: 28, fontWeight: 700, margin: '4px 0 0', color: '#60a5fa' }

export default function StatsCards({ stats }: { stats: Stats | null }) {
  if (!stats) return null
  const cards = [
    { label: 'Total Units', value: stats.total_units },
    { label: 'Online Units', value: stats.online_units },
    { label: 'Avg Efficiency', value: `${stats.avg_efficiency}%` },
    { label: 'Total Yield', value: stats.total_yield },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
      {cards.map((c) => (
        <div key={c.label} style={cardStyle}>
          <div style={{ fontSize: 14, color: '#94a3b8' }}>{c.label}</div>
          <div style={valStyle}>{c.value}</div>
        </div>
      ))}
    </div>
  )
}
