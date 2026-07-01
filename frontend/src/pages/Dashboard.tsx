import React, { useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import StatsCards from '../components/StatsCards'
import UnitForm from '../components/UnitForm'
import UnitList from '../components/UnitList'
import AlertFeed from '../components/AlertFeed'
import { useRefineStore } from '../store/refineStore'
import { useWsStore } from '../store/wsStore'

export default function Dashboard() {
  const { units, stats, alerts, fetchUnits, fetchStats, fetchAlerts, submitUnit, updateAlertStatus, deleteUnit } = useRefineStore()
  const wsConnected = useWsStore((s) => s.connected)

  const load = useCallback(async () => {
    await Promise.all([fetchUnits(), fetchStats(), fetchAlerts()])
  }, [fetchUnits, fetchStats, fetchAlerts])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (data: Record<string, unknown>) => {
    await submitUnit(data)
    await load()
  }

  const handleDelete = async (id: string) => {
    await deleteUnit(id)
    await load()
  }

  const handleAck = async (id: string, status: string) => {
    await updateAlertStatus(id, status)
    await fetchAlerts()
  }

  return (
    <Layout>
      {wsConnected && (
        <div style={{
          background: '#065f46', color: '#d1fae5', padding: '6px 16px', borderRadius: 6,
          marginBottom: 16, fontSize: 13, textAlign: 'center',
        }}>
          WebSocket connected — real-time monitoring active
        </div>
      )}
      <StatsCards stats={stats} />
      <UnitForm onSubmit={handleSubmit} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <UnitList units={units} onDelete={handleDelete} />
        <AlertFeed alerts={alerts} onUpdateStatus={handleAck} />
      </div>
    </Layout>
  )
}
