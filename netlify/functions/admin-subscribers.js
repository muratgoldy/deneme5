import { getStore } from '@netlify/blobs'

export const handler = async (event) => {
  // Simple password protection via query param: ?key=YOUR_ADMIN_KEY
  const adminKey = process.env.ADMIN_KEY
  const { key } = event.queryStringParameters || {}
  if (adminKey && key !== adminKey) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) }
  }

  try {
    const store = getStore('subscribers')
    const { blobs } = await store.list()
    const records = await Promise.all(blobs.map(b => store.getJSON(b.key)))
    const subscribers = records.filter(Boolean).sort((a, b) =>
      new Date(b.subscribedAt) - new Date(a.subscribedAt)
    )

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>BrightDay Subscribers</title>
<style>body{font-family:Inter,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;background:#fafafa;color:#1a1a2e}
h1{font-size:1.6rem;margin-bottom:4px}p{color:#6b7280}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);margin-top:24px}
th{background:#FF6B35;color:white;padding:12px 16px;text-align:left;font-size:0.85rem}
td{padding:11px 16px;border-bottom:1px solid #f3f4f6;font-size:0.9rem}
tr:last-child td{border-bottom:none}
.badge{background:#ecfdf5;color:#065f46;padding:2px 10px;border-radius:20px;font-size:0.78rem;font-weight:600}</style>
</head><body>
<h1>☀️ BrightDay Subscribers</h1>
<p>Total: <strong>${subscribers.length}</strong> subscriber${subscribers.length !== 1 ? 's' : ''}</p>
<table>
<thead><tr><th>#</th><th>Email</th><th>Subscribed</th><th>Status</th></tr></thead>
<tbody>
${subscribers.map((s, i) => `<tr>
  <td>${i + 1}</td>
  <td>${s.email}</td>
  <td>${new Date(s.subscribedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
  <td><span class="badge">${s.active ? 'Active' : 'Inactive'}</span></td>
</tr>`).join('')}
${subscribers.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:#9ca3af;padding:24px">No subscribers yet</td></tr>' : ''}
</tbody>
</table>
</body></html>`

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html,
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
