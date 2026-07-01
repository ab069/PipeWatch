import { useEffect } from 'react'
import Layout from '../components/Layout'
import StatsCards from '../components/StatsCards'
import PipelineForm from '../components/PipelineForm'
import PipelineList from '../components/PipelineList'
import AlertFeed from '../components/AlertFeed'
import { usePipeStore } from '../store/pipeStore'
import { useWebSocket } from '../hooks/useWebSocket'

export default function Dashboard() {
  const pipelines = usePipeStore((s) => s.pipelines)
  const stats = usePipeStore((s) => s.stats)
  const loading = usePipeStore((s) => s.loading)
  const fetchPipelines = usePipeStore((s) => s.fetchPipelines)
  const fetchStats = usePipeStore((s) => s.fetchStats)
  useWebSocket()

  useEffect(() => {
    fetchPipelines()
    fetchStats()
  }, [])

  return (
    <Layout>
      <StatsCards
        total={stats?.total ?? 0}
        atRisk={stats?.at_risk ?? 0}
        leaks={stats?.leaks ?? 0}
        avgIntegrity={stats?.avg_integrity ?? 0}
        loading={loading}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 24 }}>
        <div>
          <AlertFeed />
          <PipelineForm />
        </div>
        <div>
          <PipelineList />
        </div>
      </div>
    </Layout>
  )
}
