import { create } from 'zustand'
import axios from 'axios'

interface Pipeline {
  id: string
  user_id: string
  name: string
  material: string
  length_km: number
  diameter_mm: number
  max_pressure: number
  current_pressure: number
  flow_rate: number
  status: string
  leak_status: string
  integrity_score: number
  created_at?: string
}

interface Stats {
  total: number
  at_risk: number
  leaks: number
  avg_integrity: number
}

interface PipeState {
  pipelines: Pipeline[]
  stats: Stats | null
  loading: boolean
  fetchPipelines: () => Promise<void>
  fetchStats: () => Promise<void>
  submitPipeline: (data: any) => Promise<void>
  deletePipeline: (id: string) => Promise<void>
}

const api = () => axios.create({
  baseURL: '/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('pipewatch-auth') ? JSON.parse(localStorage.getItem('pipewatch-auth')!).state?.token : ''}` },
})

export const usePipeStore = create<PipeState>((set, get) => ({
  pipelines: [],
  stats: null,
  loading: false,

  fetchPipelines: async () => {
    set({ loading: true })
    try {
      const { data } = await api().get('/pipelines')
      set({ pipelines: data })
    } finally {
      set({ loading: false })
    }
  },

  fetchStats: async () => {
    try {
      const { data } = await api().get('/pipelines/stats')
      set({ stats: data })
    } catch {}
  },

  submitPipeline: async (pipelineData) => {
    await api().post('/pipelines', pipelineData)
    await get().fetchPipelines()
    await get().fetchStats()
  },

  deletePipeline: async (id) => {
    await api().delete(`/pipelines/${id}`)
    await get().fetchPipelines()
    await get().fetchStats()
  },
}))
