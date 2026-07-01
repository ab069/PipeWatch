import { create } from 'zustand'

interface Alert {
  id: string
  pipeline_id: string
  pipeline_name?: string
  title: string
  alert_type: string
  severity: string
  description?: string
}

interface WsState {
  alerts: Alert[]
  connected: boolean
  addAlert: (alert: Alert) => void
  setConnected: (v: boolean) => void
}

export const useWsStore = create<WsState>((set) => ({
  alerts: [],
  connected: false,
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 50) })),
  setConnected: (v) => set({ connected: v }),
}))
