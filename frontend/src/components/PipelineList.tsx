import { useState } from 'react'
import { usePipeStore } from '../store/pipeStore'
import { useWebSocket } from '../hooks/useWebSocket'

function integrityColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 50) return '#f97316'
  return '#ef4444'
}

export default function PipelineList() {
  const pipelines = usePipeStore((s) => s.pipelines)
  const deletePipeline = usePipeStore((s) => s.deletePipeline)
  const { send } = useWebSocket()
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleAnalyze = (id: string) => {
    send({ action: 'analyze', pipeline_id: id })
  }

  return (
    <div>
      <h3 style={{ color: '#ccc', marginBottom: 12, fontSize: 16 }}>Pipelines</h3>
      {pipelines.length === 0 && (
        <p style={{ color: '#666', fontSize: 14 }}>No pipelines yet. Add one above.</p>
      )}
      {pipelines.map((p) => (
        <div key={p.id} style={{
          background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, marginBottom: 8,
          borderLeft: `3px solid ${p.leak_status === 'confirmed' ? '#dc2626' : p.leak_status === 'suspicious' ? '#f97316' : '#333'}`,
        }}>
          <div onClick={() => setExpanded(expanded === p.id ? null : p.id)}
            style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#fff', fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: '#888', fontSize: 12, marginLeft: 10 }}>{p.material}</span>
              <span style={{
                marginLeft: 10, fontSize: 11, padding: '2px 8px', borderRadius: 10,
                background: p.status === 'active' ? '#065f46' : p.status === 'shutdown' ? '#7f1d1d' : '#713f12',
                color: '#ccc',
              }}>{p.status}</span>
              {p.leak_status !== 'normal' && (
                <span style={{
                  marginLeft: 6, fontSize: 11, padding: '2px 8px', borderRadius: 10,
                  background: '#dc2626', color: '#fff',
                }}>{p.leak_status}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: integrityColor(p.integrity_score), fontWeight: 700 }}>{p.integrity_score}</span>
              <button onClick={(e) => { e.stopPropagation(); handleAnalyze(p.id) }} style={{
                background: '#dc2626', color: '#fff', border: 'none', padding: '4px 10px',
                borderRadius: 4, cursor: 'pointer', fontSize: 11,
              }}>Analyze</button>
            </div>
          </div>
          {expanded === p.id && (
            <div style={{ padding: '0 18px 14px', borderTop: '1px solid #333', paddingTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                <div><span style={{ color: '#888' }}>Length:</span> <span style={{ color: '#ccc' }}>{p.length_km} km</span></div>
                <div><span style={{ color: '#888' }}>Diameter:</span> <span style={{ color: '#ccc' }}>{p.diameter_mm} mm</span></div>
                <div><span style={{ color: '#888' }}>Pressure:</span> <span style={{ color: '#ccc' }}>{p.current_pressure} / {p.max_pressure} bar</span></div>
                <div><span style={{ color: '#888' }}>Flow Rate:</span> <span style={{ color: '#ccc' }}>{p.flow_rate} m³/h</span></div>
              </div>
              <button onClick={() => { if (confirm('Delete this pipeline?')) deletePipeline(p.id) }} style={{
                marginTop: 10, background: 'transparent', border: '1px solid #555', color: '#ef4444',
                padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11,
              }}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
