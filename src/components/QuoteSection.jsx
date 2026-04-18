import { useState } from 'react'
import { useLanguage } from '../LanguageContext.jsx'

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "action" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", category: "courage" },
  { text: "Each morning we are born again. What we do today matters most.", author: "Buddha", category: "mindfulness" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "belief" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "passion" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "resilience" },
  { text: "Your time is now. Start where you stand, and never stop moving forward.", author: "Roy T. Bennett", category: "action" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "action" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin", category: "resilience" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "action" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "inner strength" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", category: "impact" },
  // Marcus Aurelius
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", category: "wisdom" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius", category: "resilience" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", category: "action" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius", category: "courage" },
  // Socrates
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "wisdom" },
  { text: "Wonder is the beginning of wisdom.", author: "Socrates", category: "wisdom" },
  { text: "Be kind, for everyone you meet is fighting a hard battle.", author: "Socrates", category: "impact" },
  // Braveheart
  { text: "Every man dies, not every man really lives.", author: "William Wallace — Braveheart", category: "courage" },
  { text: "They may take our lives, but they'll never take our freedom!", author: "William Wallace — Braveheart", category: "freedom" },
  // Nelson Mandela
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "resilience" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", category: "wisdom" },
  { text: "I learned that courage was not the absence of fear, but the triumph over it.", author: "Nelson Mandela", category: "courage" },
  { text: "Do not judge me by my successes, judge me by how many times I fell down and got back up again.", author: "Nelson Mandela", category: "resilience" },
  // Atatürk
  { text: "Peace at home, peace in the world.", author: "Mustafa Kemal Atatürk", category: "leadership" },
  { text: "Science is the most reliable guide in life.", author: "Mustafa Kemal Atatürk", category: "wisdom" },
  { text: "A good mother is worth a hundred teachers.", author: "Mustafa Kemal Atatürk", category: "impact" },
]

const affirmations = [
  "I am capable. I am resilient. Today I choose to move forward with purpose and joy.",
  "I have everything I need within me to create an amazing day.",
  "Every challenge I face is shaping me into a stronger, wiser person.",
  "I choose gratitude, growth, and grace in everything I do today.",
  "My potential is limitless and my spirit is unbreakable.",
  "I radiate positive energy and attract wonderful opportunities.",
  "Today I show up fully — for myself and for those around me.",
  "I am worthy of all the good that comes to me today.",
  "Small steps taken consistently lead to extraordinary results.",
  "I breathe in calm and exhale anything that does not serve me.",
  "I trust the process. I trust myself. I trust today.",
  "My mind is clear, my heart is open, and my energy is boundless.",
]

const categoryColors = {
  action:           '#FF6B35',
  courage:          '#9B5DE5',
  mindfulness:      '#00BBF9',
  belief:           '#F15BB5',
  passion:          '#FEE440',
  resilience:       '#00F5D4',
  impact:           '#FB5607',
  'inner strength': '#3A86FF',
  wisdom:           '#7B2FBE',
  freedom:          '#06D6A0',
  leadership:       '#EF233C',
}

const images = [
  { url: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&q=80', alt: 'Hot air balloons' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', alt: 'Starry night mountains' },
  { url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', alt: 'Ocean waves' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Mountain sunrise' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', alt: 'Sunlit forest' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&q=80', alt: 'Golden field' },
  { url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80', alt: 'Sunrise sky' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', alt: 'Forest path' },
  { url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', alt: 'Waterfall' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', alt: 'Mountain peak' },
]

export default function QuoteSection() {
  const { t } = useLanguage()
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)

  const [index, setIndex] = useState(() => dayOfYear % quotes.length)
  const [imageIndex, setImageIndex] = useState(() => dayOfYear % images.length)
  const [affirmIndex, setAffirmIndex] = useState(() => dayOfYear % affirmations.length)
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
      setIndex(Math.floor(Math.random() * quotes.length))
      setImageIndex(Math.floor(Math.random() * images.length))
      setAffirmIndex(Math.floor(Math.random() * affirmations.length))
      setAnimating(false)
    }, 300)
  }

  return (
    <section className="section">
      <h2 className="section-title">{t('quote_section_title')}</h2>

      <div className={`quote-card ${animating ? 'fade-out' : 'fade-in'}`}>
        <div className="quote-image-wrap">
          <img src={images[imageIndex].url} alt={images[imageIndex].alt} className="quote-image" />
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
        <button className="btn btn-outline" onClick={nextQuote}>{t('quote_next')}</button>
        <button className="btn btn-primary" onClick={randomQuote}>{t('quote_surprise')}</button>
      </div>

      <div className="affirmation-box">
        <h3>{t('quote_affirmation_title')}</h3>
        <p>{affirmations[affirmIndex]}</p>
        <button
          className="affirmation-refresh"
          onClick={() => setAffirmIndex((i) => (i + 1) % affirmations.length)}
        >
          {t('quote_affirmation_refresh')}
        </button>
      </div>
    </section>
  )
}
