import { useAuthStore } from '../store/authStore'
import { useWsStore } from '../store/wsStore'

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const connected = useWsStore((s) => s.connected)

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
      <header style={{
        background: '#1a1a1a',
        borderBottom: '2px solid #dc2626',
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#dc2626', fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
            PIPE<span style={{ color: '#eee' }}>WATCH</span>
          </span>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? '#22c55e' : '#ef4444',
            display: 'inline-block',
          }} />
          <span style={{ color: '#888', fontSize: 12 }}>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#ccc', fontSize: 14 }}>{user?.name}</span>
          <button onClick={logout} style={{
            background: 'transparent', border: '1px solid #dc2626', color: '#dc2626',
            padding: '4px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 13,
          }}>Logout</button>
        </div>
      </header>
      <main style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}
