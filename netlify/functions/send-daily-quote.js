import { schedule } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { Resend } from 'resend'

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Henry David Thoreau" },
  { text: "Keep your face always toward the sunshine and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
]

function getTodayQuote() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return quotes[day % quotes.length]
}

// Runs every day at 8:00 AM UTC
export const handler = schedule('0 8 * * *', async () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY not set — skipping daily send')
    return
  }

  const fromEmail = process.env.FROM_EMAIL || 'BrightDay <onboarding@resend.dev>'
  const resend = new Resend(apiKey)
  const quote = getTodayQuote()

  // Get all subscribers from Blobs
  let subscribers = []
  try {
    const store = getStore('subscribers')
    const { blobs } = await store.list()
    subscribers = await Promise.all(blobs.map((b) => store.getJSON(b.key)))
    subscribers = subscribers.filter(Boolean)
    console.log(`Sending daily quote to ${subscribers.length} subscribers`)
  } catch (err) {
    console.error('Failed to load subscribers:', err.message)
    return
  }

  if (subscribers.length === 0) {
    console.log('No subscribers yet.')
    return
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Send to each subscriber
  let sent = 0
  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: sub.email,
        subject: `✨ Your BrightDay Quote — ${today}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fafafa;padding:32px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:24px;">
              <span style="font-size:2.5rem;">☀️</span>
              <h1 style="font-size:1.8rem;font-weight:800;color:#1a1a2e;margin:8px 0 4px;">BrightDay</h1>
              <p style="color:#6b7280;font-size:0.9rem;">${today}</p>
            </div>
            <div style="background:#fff;border-left:4px solid #FF6B35;border-radius:12px;padding:24px 28px;margin:0 0 24px;">
              <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#FF6B35;margin:0 0 12px;">Your daily spark</p>
              <p style="font-family:Georgia,serif;font-style:italic;font-size:1.25rem;color:#1a1a2e;margin:0 0 12px;line-height:1.6;">"${quote.text}"</p>
              <p style="font-size:0.9rem;color:#6b7280;margin:0;">— ${quote.author}</p>
            </div>
            <div style="text-align:center;">
              <a href="https://shiny-meringue-5f782c.netlify.app" style="display:inline-block;background:#FF6B35;color:white;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:600;font-size:0.95rem;">
                Open BrightDay ☀️
              </a>
            </div>
            <p style="font-size:0.8rem;color:#9ca3af;text-align:center;margin-top:24px;">
              You're receiving this because you subscribed to BrightDay daily quotes.<br>
              To unsubscribe, reply with "unsubscribe".
            </p>
          </div>
        `,
      })
      sent++
    } catch (err) {
      console.error(`Failed to send to ${sub.email}:`, err.message)
    }
  }

  console.log(`Daily quote sent to ${sent}/${subscribers.length} subscribers`)
})
