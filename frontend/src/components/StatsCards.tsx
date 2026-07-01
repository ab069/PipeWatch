interface Props {
  total: number
  atRisk: number
  leaks: number
  avgIntegrity: number
  loading?: boolean
}

export default function StatsCards({ total, atRisk, leaks, avgIntegrity, loading }: Props) {
  const cards = [
    { label: 'Total Pipelines', value: total, color: '#dc2626' },
    { label: 'At Risk', value: atRisk, color: '#f97316' },
    { label: 'Leaks Detected', value: leaks, color: '#ef4444' },
    { label: 'Avg Integrity', value: loading ? '...' : `${avgIntegrity}%`, color: '#22c55e' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
      {cards.map((c) => (
        <div key={c.label} style={{
          background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '18px 20px',
          borderLeft: `3px solid ${c.color}`,
        }}>
          <div style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{c.label}</div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 700, marginTop: 4 }}>{c.value}</div>
        </div>
      ))}
    </div>
  )
}
