import { useState } from 'react'

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

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  return quotes[dayOfYear % quotes.length]
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const previewQuote = getDailyQuote()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const formData = new FormData()
      formData.append('form-name', 'newsletter')
      formData.append('email', email)

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <div className="newsletter-left">
          <div className="newsletter-icon">✉️</div>
          <h2 className="newsletter-title">Daily Quote in Your Inbox</h2>
          <p className="newsletter-subtitle">
            Start every morning with a hand-picked motivational quote delivered straight to you.
            No spam — just one spark of inspiration per day.
          </p>

          <div className="newsletter-preview">
            <p className="newsletter-preview-label">Today's quote preview</p>
            <p className="newsletter-preview-quote">"{previewQuote}"</p>
          </div>
        </div>

        <div className="newsletter-right">
          {status === 'success' ? (
            <div className="newsletter-success">
              <div className="success-icon">🎉</div>
              <h3>You're in!</h3>
              <p>
                Welcome to the BrightDay community. Your first quote is on its way — check your inbox!
              </p>
            </div>
          ) : (
            <form
              name="newsletter"
              method="POST"
              data-netlify="true"
              onSubmit={handleSubmit}
              className="newsletter-form"
            >
              <input type="hidden" name="form-name" value="newsletter" />

              <label className="newsletter-label" htmlFor="newsletter-email">
                Your email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="newsletter-input"
                disabled={status === 'loading'}
              />

              {errorMsg && <p className="newsletter-error">{errorMsg}</p>}

              <button
                type="submit"
                className="btn btn-primary newsletter-submit"
                disabled={status === 'loading' || !email}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe — it\'s free'}
              </button>

              <p className="newsletter-note">
                Unsubscribe anytime. We respect your inbox.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
