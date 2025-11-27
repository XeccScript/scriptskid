import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  const { id } = req.query || {}

  const headerAllow = req.headers['x-allow-fetch']
  if (headerAllow && String(headerAllow).toLowerCase() === 'true') {
    return serveScript(id, res)
  }

  const key = req.query && req.query.key
  if (key && process.env.ACCESS_KEY && key === process.env.ACCESS_KEY) {
    return serveScript(id, res)
  }

  const ua = (req.headers['user-agent'] || '').toString().toLowerCase()
  if (ua.includes('roblox')) {
    return serveScript(id, res)
  }

  res.status(403).setHeader('content-type', 'text/plain').send('ACCESS DENIED')
}

async function serveScript(id, res) {
  if (!id) {
    res.status(400).setHeader('content-type', 'text/plain').send('BAD REQUEST')
    return
  }

  try {
    const client = await clientPromise
    const db = client.db('robloxkeys')
    const collection = db.collection('scripts')

    const doc = await collection.findOne({ _id: id })
    if (!doc) {
      res.status(404).setHeader('content-type', 'text/plain').send('NOT FOUND')
      return
    }

    res.status(200).setHeader('content-type', 'text/plain; charset=utf-8').send(doc.script)
  } catch (err) {
    console.error('/api/raw error:', err)
    res.status(500).setHeader('content-type', 'text/plain').send('DB ERROR')
  }
}
