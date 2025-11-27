import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const base = typeof window !== 'undefined' ? window.location.origin : ''

  async function create() {
    setLoading(true)
    setError('')
    setUrl('')

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        data = { error: text || 'Invalid server response' }
      }

      if (!res.ok || !data.id) {
        setError(data.error || 'Failed to create script')
        return
      }

      // Force-fetch the raw URL to ensure it exists
      const rawRes = await fetch(base + '/api/raw/' + data.id, {
        method: 'GET',
        headers: { 'x-allow-fetch': 'true' },
      })

      if (!rawRes.ok) {
        setError('Failed to fetch raw script after creation.')
        return
      }

      setUrl(base + '/api/raw/' + data.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create Raw Script URL</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.h1}>Raw Script URL Generator</h1>

          <textarea
            style={styles.textarea}
            placeholder="Paste your script here..."
            value={script}
            onChange={(e) => setScript(e.target.value)}
          />

          <div style={styles.controls}>
            <button
              style={styles.button}
              onClick={create}
              disabled={loading || !script.trim()}
            >
              {loading ? 'Creating...' : 'Generate URL'}
            </button>
            <button
              style={styles.clearButton}
              onClick={() => { setScript(''); setUrl(''); setError('') }}
            >
              Clear
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {url && (
            <div style={styles.result}>
              <div style={styles.resultLabel}>
                Your raw script URL (requires proper header to access):
              </div>
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
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg,#0f172a,#1e293b)',
    padding: 20,
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: 800,
    background: '#1e293b',
    padding: 30,
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  h1: {
    color: '#f1f5f9',
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 700,
  },
  textarea: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    border: '1px solid #334155',
    padding: 12,
    background: '#0f172a',
    color: '#f1f5f9',
    fontSize: 14,
    resize: 'vertical',
  },
  controls: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)',
    border: 'none',
    padding: '12px 20px',
    borderRadius: 10,
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    transition: '0.2s',
  },
  clearButton: {
    flex: 0.5,
    background: 'transparent',
    border: '1px solid #64748b',
    padding: '12px 20px',
    borderRadius: 10,
    color: '#94a3b8',
    fontWeight: 600,
    cursor: 'pointer',
    transition: '0.2s',
  },
  error: {
    marginTop: 14,
    color: '#f87171',
    fontWeight: 500,
  },
  result: {
    marginTop: 18,
    background: 'rgba(255,255,255,0.05)',
    padding: 14,
    borderRadius: 10,
  },
  resultLabel: {
    marginBottom: 6,
    color: '#cbd5e1',
    fontSize: 13,
  },
  link: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#38bdf8',
    textDecoration: 'underline',
    wordBreak: 'break-all',
  },
}
