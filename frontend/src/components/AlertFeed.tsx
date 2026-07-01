import { useWsStore } from '../store/wsStore'

function severityColor(s: string): string {
  switch (s) {
    case 'critical': return '#dc2626'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    default: return '#6b7280'
  }
}

export default function AlertFeed() {
  const alerts = useWsStore((s) => s.alerts)

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ color: '#ccc', marginBottom: 12, fontSize: 16 }}>Real-Time Alerts</h3>
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {alerts.length === 0 && (
          <p style={{ color: '#666', fontSize: 14 }}>No alerts yet.</p>
        )}
        {alerts.map((a, i) => (
          <div key={`${a.id}-${i}`} style={{
            background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, padding: '10px 14px',
            marginBottom: 6, borderLeft: `3px solid ${severityColor(a.severity)}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{a.title}</span>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: severityColor(a.severity), color: '#fff', textTransform: 'uppercase',
              }}>{a.severity}</span>
            </div>
            <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
