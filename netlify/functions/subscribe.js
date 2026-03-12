import { getStore } from '@netlify/blobs'
import { Resend } from 'resend'

const headers = { 'Content-Type': 'application/json' }

const quotes = [
  "The secret of getting ahead is getting started.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "You are never too old to set another goal or to dream a new dream.",
  "Start where you are. Use what you have. Do what you can.",
  "Act as if what you do makes a difference. It does.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "What you get by achieving your goals is not as important as what you become.",
  "Keep your face always toward the sunshine and shadows will fall behind you.",
  "The only way to do great work is to love what you do.",
  "In the middle of every difficulty lies opportunity.",
]

function getTodayQuote() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return quotes[day % quotes.length]
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

  // Save subscriber to Netlify Blobs
  try {
    const store = getStore('subscribers')
    const key = Buffer.from(email).toString('base64url')
    await store.setJSON(key, { email, subscribedAt: new Date().toISOString() })
    console.log('Subscriber saved:', email)
  } catch (err) {
    console.error('Blob error:', email, err.message)
  }

  // Send welcome email via Resend
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      const resend = new Resend(apiKey)
      const todayQuote = getTodayQuote()
      const fromEmail = process.env.FROM_EMAIL || 'BrightDay <onboarding@resend.dev>'

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: '✨ Welcome to BrightDay Daily Quotes!',
        html: `
          <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fafafa;padding:32px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:24px;">
              <span style="font-size:2.5rem;">☀️</span>
              <h1 style="font-size:1.8rem;font-weight:800;color:#1a1a2e;margin:8px 0 4px;">BrightDay</h1>
              <p style="color:#6b7280;font-size:0.95rem;">Every day is a chance to shine brighter.</p>
            </div>
            <p style="font-size:1rem;color:#1a1a2e;line-height:1.7;">
              You're in! 🎉 Starting tomorrow, you'll receive a hand-picked motivational quote every morning.
            </p>
            <div style="background:#fff;border-left:4px solid #FF6B35;border-radius:12px;padding:20px 24px;margin:24px 0;">
              <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#FF6B35;margin:0 0 8px;">Today's quote</p>
              <p style="font-family:Georgia,serif;font-style:italic;font-size:1.15rem;color:#1a1a2e;margin:0;line-height:1.6;">"${todayQuote}"</p>
            </div>
            <p style="font-size:0.85rem;color:#6b7280;text-align:center;margin-top:24px;">
              You can unsubscribe anytime. We respect your inbox.
            </p>
          </div>
        `,
      })
      console.log('Welcome email sent to:', email)
    } catch (err) {
      console.error('Email send error:', err.message)
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
}
