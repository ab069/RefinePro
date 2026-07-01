import React from 'react'
import { useAuthStore } from '../store/authStore'

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: '#2563eb',
    color: '#fff',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { margin: 0, fontSize: 24, fontWeight: 700 },
  userArea: { display: 'flex', alignItems: 'center', gap: 12 },
  btn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
  },
  container: { maxWidth: 1200, margin: '0 auto', padding: '24px 16px' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <div style={styles.header}>
        <h1 style={styles.title}>RefinePro</h1>
        <div style={styles.userArea}>
          <span>{user?.name}</span>
          <button style={styles.btn} onClick={logout}>Logout</button>
        </div>
      </div>
      <div style={styles.container}>{children}</div>
    </div>
  )
}
