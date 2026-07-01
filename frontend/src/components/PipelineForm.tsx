import { useState } from 'react'
import { usePipeStore } from '../store/pipeStore'

export default function PipelineForm() {
  const submit = usePipeStore((s) => s.submitPipeline)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', material: 'steel', length_km: '', diameter_mm: '', max_pressure: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submit({
      name: form.name,
      material: form.material,
      length_km: parseFloat(form.length_km),
      diameter_mm: parseFloat(form.diameter_mm),
      max_pressure: parseFloat(form.max_pressure),
    })
    setForm({ name: '', material: 'steel', length_km: '', diameter_mm: '', max_pressure: '' })
    setOpen(false)
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px',
        borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14,
      }}>
        {open ? 'Cancel' : '+ Add Pipeline'}
      </button>

      {open && (
        <form onSubmit={handleSubmit} style={{
          marginTop: 12, background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: 20,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          <input placeholder="Pipeline Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inpStyle} required />
          <select value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} style={inpStyle}>
            <option value="steel">Steel</option>
            <option value="plastic">Plastic</option>
            <option value="concrete">Concrete</option>
          </select>
          <input type="number" step="0.1" placeholder="Length (km)" value={form.length_km} onChange={(e) => setForm({ ...form, length_km: e.target.value })}
            style={inpStyle} required />
          <input type="number" step="0.1" placeholder="Diameter (mm)" value={form.diameter_mm} onChange={(e) => setForm({ ...form, diameter_mm: e.target.value })}
            style={inpStyle} required />
          <input type="number" step="0.1" placeholder="Max Pressure (bar)" value={form.max_pressure} onChange={(e) => setForm({ ...form, max_pressure: e.target.value })}
            style={inpStyle} required />
          <button type="submit" style={{
            background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6,
            cursor: 'pointer', fontWeight: 600, fontSize: 14, gridColumn: '1 / -1', padding: 10,
          }}>Create Pipeline</button>
        </form>
      )}
    </div>
  )
}

const inpStyle: React.CSSProperties = {
  background: '#0f0f0f', border: '1px solid #333', borderRadius: 4, padding: '8px 12px',
  color: '#eee', fontSize: 14, outline: 'none',
}
