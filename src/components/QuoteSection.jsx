import { useState, useEffect } from 'react'

const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    category: "action",
  },
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne",
    category: "courage",
  },
  {
    text: "Each morning we are born again. What we do today matters most.",
    author: "Buddha",
    category: "mindfulness",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "belief",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "passion",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "resilience",
  },
  {
    text: "Your time is now. Start where you stand, and never stop moving forward.",
    author: "Roy T. Bennett",
    category: "action",
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "action",
  },
  {
    text: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin",
    category: "resilience",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "action",
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "inner strength",
  },
  {
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "impact",
  },
]

const categoryColors = {
  action: '#FF6B35',
  courage: '#9B5DE5',
  mindfulness: '#00BBF9',
  belief: '#F15BB5',
  passion: '#FEE440',
  resilience: '#00F5D4',
  impact: '#FB5607',
  'inner strength': '#3A86FF',
}

const images = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Mountain sunrise' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', alt: 'Forest path' },
  { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', alt: 'Ocean waves' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80', alt: 'Golden field' },
  { url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80', alt: 'Sunrise sky' },
]

export default function QuoteSection() {
  const [index, setIndex] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    return dayOfYear % quotes.length
  })
  const [imageIndex, setImageIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const quote = quotes[index]
  const color = categoryColors[quote.category] || '#FF6B35'

  const nextQuote = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setIndex((i) => (i + 1) % quotes.length)
      setImageIndex((i) => (i + 1) % images.length)
      setAnimating(false)
    }, 300)
  }

  const randomQuote = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      const next = Math.floor(Math.random() * quotes.length)
      setIndex(next)
      setImageIndex(Math.floor(Math.random() * images.length))
      setAnimating(false)
    }, 300)
  }

  return (
    <section className="section">
      <h2 className="section-title">Today's Inspiration</h2>

      <div className={`quote-card ${animating ? 'fade-out' : 'fade-in'}`}>
        <div className="quote-image-wrap">
          <img
            src={images[imageIndex].url}
            alt={images[imageIndex].alt}
            className="quote-image"
          />
          <div className="quote-image-overlay" style={{ background: `${color}33` }} />
        </div>

        <div className="quote-body">
          <span className="quote-category" style={{ background: color }}>
            {quote.category}
          </span>
          <blockquote className="quote-text">"{quote.text}"</blockquote>
          <cite className="quote-author">— {quote.author}</cite>
        </div>
      </div>

      <div className="quote-actions">
        <button className="btn btn-outline" onClick={nextQuote}>
          Next Quote →
        </button>
        <button className="btn btn-primary" onClick={randomQuote}>
          Surprise Me 🎲
        </button>
      </div>

      <div className="affirmation-box">
        <h3>Your daily affirmation</h3>
        <p>
          I am capable. I am resilient. Today I choose to move forward with
          purpose and joy.
        </p>
      </div>
    </section>
  )
}
