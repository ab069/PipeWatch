import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { useWsStore } from '../store/wsStore'

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const addAlert = useWsStore((s) => s.addAlert)
  const setConnected = useWsStore((s) => s.setConnected)

  useEffect(() => {
    if (!token || !user) return

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host = window.location.host
    const url = `${protocol}://${host}/ws/${user.id}`

    function connect() {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => setConnected(true)

      ws.onclose = () => {
        setConnected(false)
        setTimeout(connect, 3000)
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'alert') {
            addAlert(msg.data)
          }
        } catch {}
      }
    }

    connect()

    return () => {
      wsRef.current?.close()
    }
  }, [token, user])

  const send = (data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  return { send }
}
