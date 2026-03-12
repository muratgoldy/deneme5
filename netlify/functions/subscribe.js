const { getStore } = require('@netlify/blobs')

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

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
    const store = getStore({ name: 'subscribers', consistency: 'strong' })
    const key = Buffer.from(email).toString('base64url')
    await store.setJSON(key, { email, subscribedAt: new Date().toISOString() })
    console.log('New subscriber:', email)
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
  } catch (err) {
    console.error('Storage error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save' }) }
  }
}
