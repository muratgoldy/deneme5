import { getStore } from '@netlify/blobs'
import { Resend } from 'resend'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You are never too old to set another goal.", author: "C.S. Lewis" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Keep your face always toward the sunshine.", author: "Walt Whitman" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Henry David Thoreau" },
]

function todayQuote() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return quotes[day % quotes.length]
}

function welcomeHtml(email, quote) {
  const siteUrl = process.env.SITE_URL || 'https://shiny-meringue-5f782c.netlify.app'
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#FF6B35,#F15BB5,#9B5DE5);padding:32px 28px;text-align:center;">
    <div style="font-size:2.5rem;">☀️</div>
    <h1 style="color:white;font-size:1.8rem;margin:8px 0 4px;font-weight:800;">BrightDay</h1>
    <p style="color:rgba(255,255,255,0.9);margin:0;font-size:0.95rem;">Every day is a chance to shine brighter.</p>
  </div>
  <div style="padding:32px 28px;">
    <h2 style="color:#1a1a2e;font-size:1.3rem;margin:0 0 12px;">You're subscribed! 🎉</h2>
    <p style="color:#6b7280;line-height:1.7;margin:0 0 24px;">Welcome to BrightDay daily quotes. Every morning you'll wake up to a hand-picked spark of inspiration.</p>
    <div style="background:#fff8f5;border-left:4px solid #FF6B35;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#FF6B35;margin:0 0 10px;">Today's quote</p>
      <p style="font-style:italic;font-size:1.1rem;color:#1a1a2e;margin:0 0 10px;line-height:1.6;">"${quote.text}"</p>
      <p style="color:#9ca3af;font-size:0.85rem;margin:0;">— ${quote.author}</p>
    </div>
    <div style="text-align:center;">
      <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#FF6B35,#F15BB5);color:white;text-decoration:none;padding:13px 28px;border-radius:50px;font-weight:700;font-size:0.95rem;">Open BrightDay ☀️</a>
    </div>
  </div>
  <div style="background:#f9fafb;padding:16px 28px;text-align:center;">
    <p style="color:#9ca3af;font-size:0.78rem;margin:0;">You subscribed with ${email}. Reply "unsubscribe" to stop.</p>
  </div>
</div>
</body></html>`
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const params = new URLSearchParams(event.body || '')
  const email = (params.get('email') || '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) }
  }

  // Save to Netlify Blobs database
  let saved = false
  try {
    const store = getStore('subscribers')
    const key = Buffer.from(email).toString('base64url')
    const existing = await store.get(key)
    if (!existing) {
      await store.setJSON(key, { email, subscribedAt: new Date().toISOString(), active: true })
      console.log('[subscribe] saved:', email)
    } else {
      console.log('[subscribe] already exists:', email)
    }
    saved = true
  } catch (err) {
    console.error('[subscribe] blob error:', err.message)
  }

  // Send welcome email via Resend (optional — works without it)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const from = process.env.FROM_EMAIL || 'BrightDay <onboarding@resend.dev>'
      const quote = todayQuote()
      await resend.emails.send({
        from,
        to: email,
        subject: '✨ Welcome to BrightDay — your daily spark starts now',
        html: welcomeHtml(email, quote),
      })
      console.log('[subscribe] welcome email sent:', email)
    } catch (err) {
      console.error('[subscribe] email error:', err.message)
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true, saved }) }
}
