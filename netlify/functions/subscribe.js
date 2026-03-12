import { getStore } from '@netlify/blobs'

const headers = { 'Content-Type': 'application/json' }

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const params = new URLSearchParams(event.body || '')
  const email = (params.get('email') || '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) }
  }

  try {
    const store = getStore('subscribers')
    const key = Buffer.from(email).toString('base64url')
    await store.setJSON(key, { email, subscribedAt: new Date().toISOString() })
    console.log('Subscriber saved:', email)
  } catch (err) {
    // Blobs unavailable — email still captured in function logs
    console.error('Blob error, email logged only:', email, err.message)
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
}
