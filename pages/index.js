import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const base = typeof window !== 'undefined' ? window.location.origin : ''

  async function create() {
    setLoading(true)
    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      })
      const data = await res.json()
      if (res.ok) setUrl(base + '/api/raw/' + data.id)
      else alert(data.error || 'failed')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create raw script URL</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.h1}>Create raw script URL</h1>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your script here..."
            style={styles.textarea}
          />

          <div style={styles.controls}>
            <button onClick={create} disabled={loading || !script.trim()} style={styles.button}>
              {loading ? 'Creating...' : 'Create script'}
            </button>
            <button onClick={() => { setScript(''); setUrl('') }} style={styles.ghost}>Clear</button>
          </div>

          {url && (
            <div style={styles.result}>
              <div style={{ marginBottom: 8, color: '#cbd5e1' }}>
                Raw URL (works only via HTTP request with required header):
              </div>
              {/* ✅ Clickable link */}
              <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                {url}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg,#0b1020, #071027)',
    fontFamily: "'Poppins', system-ui, sans-serif",
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 900,
    background: '#071022',
    padding: 24,
    borderRadius: 12,
  },
  h1: { color: '#e6eef8', marginBottom: 12, fontSize: 22, fontWeight: 600 },
  textarea: {
    width: '100%',
    height: 240,
    background: '#031025',
    color: '#dbeafe',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    resize: 'vertical',
  },
  controls: { display: 'flex', gap: 10, marginTop: 12 },
  button: {
    background: 'linear-gradient(90deg,#1f6feb,#8b5cf6)',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  ghost: {
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  result: {
    marginTop: 16,
    background: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 8,
  },
  link: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#38bdf8',
    textDecoration: 'underline',
    wordBreak: 'break-all',
  },
}
