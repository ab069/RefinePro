import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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

interface Stats {
  total_units: number
  online_units: number
  avg_efficiency: number
  total_yield: number
}

interface Alert {
  id: string
  unit_id: string
  title: string
  alert_type: string
  severity: string
  status: string
  description: string
  created_at: string
  unit_name: string
}

interface RefineState {
  units: Unit[]
  stats: Stats | null
  alerts: Alert[]
  loading: boolean
  fetchUnits: () => Promise<void>
  fetchStats: () => Promise<void>
  fetchAlerts: () => Promise<void>
  submitUnit: (data: Record<string, unknown>) => Promise<void>
  updateAlertStatus: (id: string, status: string) => Promise<void>
  deleteUnit: (id: string) => Promise<void>
}

export const useRefineStore = create<RefineState>((set) => ({
  units: [],
  stats: null,
  alerts: [],
  loading: false,
  fetchUnits: async () => {
    const { data } = await api.get('/units')
    set({ units: data })
  },
  fetchStats: async () => {
    const { data } = await api.get('/units/stats')
    set({ stats: data })
  },
  fetchAlerts: async () => {
    const { data } = await api.get('/alerts')
    set({ alerts: data })
  },
  submitUnit: async (unitData) => {
    await api.post('/units', unitData)
  },
  updateAlertStatus: async (id, status) => {
    await api.patch(`/alerts/${id}/status?status=${status}`)
  },
  deleteUnit: async (id) => {
    await api.delete(`/units/${id}`)
  },
}))
