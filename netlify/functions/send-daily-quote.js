import { schedule } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import { Resend } from 'resend'

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You are never too old to set another goal.", author: "C.S. Lewis" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: courage to continue counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Keep your face always toward the sunshine.", author: "Walt Whitman" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Henry David Thoreau" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "You are braver than you believe, stronger than you seem.", author: "A.A. Milne" },
  { text: "Each morning we are born again. What we do today matters most.", author: "Buddha" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Your time is now. Start where you stand, never stop moving forward.", author: "Roy T. Bennett" },
  { text: "What lies within us is far greater than what lies ahead or behind.", author: "Ralph Waldo Emerson" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
]

function getTodayQuote() {
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return quotes[day % quotes.length]
}

function emailHtml(quote, date, siteUrl) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#FF6B35,#F15BB5,#9B5DE5);padding:28px;text-align:center;">
    <div style="font-size:2rem;">☀️</div>
    <h1 style="color:white;font-size:1.6rem;margin:6px 0 2px;font-weight:800;">BrightDay</h1>
    <p style="color:rgba(255,255,255,0.85);margin:0;font-size:0.85rem;">${date}</p>
  </div>
  <div style="padding:32px 28px;">
    <p style="color:#6b7280;font-size:0.9rem;margin:0 0 20px;">Good morning! Here's your daily spark of inspiration ✨</p>
    <div style="background:#fff8f5;border-left:4px solid #FF6B35;border-radius:12px;padding:24px 24px 20px;">
      <p style="font-style:italic;font-size:1.2rem;color:#1a1a2e;margin:0 0 14px;line-height:1.65;">"${quote.text}"</p>
      <p style="color:#9ca3af;font-size:0.88rem;margin:0;font-weight:500;">— ${quote.author}</p>
    </div>
    <div style="margin-top:28px;text-align:center;">
      <a href="${siteUrl}" style="display:inline-block;background:linear-gradient(135deg,#FF6B35,#F15BB5);color:white;text-decoration:none;padding:13px 28px;border-radius:50px;font-weight:700;font-size:0.95rem;">Open BrightDay ☀️</a>
    </div>
  </div>
  <div style="background:#f9fafb;padding:14px 28px;text-align:center;">
    <p style="color:#9ca3af;font-size:0.75rem;margin:0;">Reply "unsubscribe" to stop receiving these emails.</p>
  </div>
</div>
</body></html>`
}

// Runs every day at 8:00 AM UTC
export const handler = schedule('0 8 * * *', async () => {
  if (!process.env.RESEND_API_KEY) {
    console.error('[daily] RESEND_API_KEY not set — skipping')
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.FROM_EMAIL || 'BrightDay <onboarding@resend.dev>'
  const siteUrl = process.env.SITE_URL || 'https://shiny-meringue-5f782c.netlify.app'
  const quote = getTodayQuote()
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  // Load all active subscribers from Netlify Blobs
  let subscribers = []
  try {
    const store = getStore('subscribers')
    const { blobs } = await store.list()
    const records = await Promise.all(blobs.map(b => store.getJSON(b.key)))
    subscribers = records.filter(r => r?.active && r?.email)
    console.log(`[daily] ${subscribers.length} active subscribers`)
  } catch (err) {
    console.error('[daily] failed to load subscribers:', err.message)
    return
  }

  if (subscribers.length === 0) {
    console.log('[daily] no subscribers yet')
    return
  }

  const html = emailHtml(quote, date, siteUrl)
  let sent = 0

  for (const sub of subscribers) {
    try {
      await resend.emails.send({
        from,
        to: sub.email,
        subject: `✨ BrightDay — ${date}`,
        html,
      })
      sent++
    } catch (err) {
      console.error(`[daily] failed for ${sub.email}:`, err.message)
    }
  }

  console.log(`[daily] sent ${sent}/${subscribers.length}`)
})
