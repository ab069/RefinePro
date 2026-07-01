import { create } from 'zustand'

interface WSMessage {
  type: string
  [key: string]: unknown
}

interface WSState {
  alerts: WSMessage[]
  connected: boolean
  addAlert: (alert: WSMessage) => void
  setConnected: (v: boolean) => void
}

export const useWsStore = create<WSState>((set) => ({
  alerts: [],
  connected: false,
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 50) })),
  setConnected: (v) => set({ connected: v }),
}))
