import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { useWsStore } from '../store/wsStore'

export function useWebSocket(unitId?: string) {
  const token = useAuthStore((s) => s.token)
  const addAlert = useWsStore((s) => s.addAlert)
  const setConnected = useWsStore((s) => s.setConnected)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!token || !unitId) return

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host = window.location.host
    const url = `${protocol}://${host}/ws/process/${unitId}?token=${token}`

    function connect() {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => setConnected(true)
      ws.onclose = () => {
        setConnected(false)
        setTimeout(connect, 3000)
      }
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.type === 'alert' || msg.type === 'upset_detection') {
          addAlert(msg)
        }
      }
    }

    connect()
    return () => {
      wsRef.current?.close()
    }
  }, [token, unitId, addAlert, setConnected])

  const send = (data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  return { send }
}
