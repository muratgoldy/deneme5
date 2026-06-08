import { useState, useEffect, useRef, useCallback } from 'react'

// 💛 Edit these to personalise! 💛
const WIFE_NAME = 'Nadide'
const DAUGHTER_ONE = '[Daughter 1]' // <- replace with your eldest's name
const DAUGHTER_TWO = '[Daughter 2]' // <- replace with your youngest's name

const CONFETTI_COLORS = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#8338ec', '#ff7b00']

// Little floating doodles that drift around the page
const DOODLES = ['🎨', '🖌️', '🎂', '🎈', '💛', '⭐', '🌸', '🖍️', '🎉', '🦋']

// 📸 Family snapshots — swap these out any time (files live in /public/photos)
const PHOTOS = [
  { src: '/photos/family-rockets.jpg', caption: 'Reaching for the stars, together 🚀', tilt: -3 },
  { src: '/photos/family-engine.jpg', caption: 'Our little astronauts 👩‍🚀', tilt: 2.5 },
  { src: '/photos/family-cheers.jpg', caption: 'Adventure squad 💫', tilt: -2 },
  { src: '/photos/nadide-selfie.jpg', caption: 'Out of this world ✨', tilt: 3 },
]

function Confetti({ pieces }) {
  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: p.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

function Cake({ lit, onBlow }) {
  return (
    <button
      className={`cake ${lit ? 'lit' : 'out'}`}
      onClick={onBlow}
      aria-label={lit ? 'Make a wish and blow out the candles' : 'Candles are out — make a wish!'}
      title={lit ? 'Click to blow out the candles 🎂' : 'Wish made! 💫'}
    >
      <div className="candles">
        {[0, 1, 2].map((i) => (
          <span className="candle" key={i}>
            <span className="flame" />
          </span>
        ))}
      </div>
      <div className="cake-top" />
      <div className="cake-body">
        <span className="drip" />
        <span className="drip" />
        <span className="drip" />
      </div>
      <div className="cake-plate" />
    </button>
  )
}

export default function App() {
  const [confetti, setConfetti] = useState([])
  const [candlesLit, setCandlesLit] = useState(true)
  const [wishMade, setWishMade] = useState(false)
  const idRef = useRef(0)

  const burst = useCallback((count = 80) => {
    const pieces = Array.from({ length: count }, () => ({
      id: idRef.current++,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: 2.5 + Math.random() * 2.5,
      delay: Math.random() * 0.4,
      size: 8 + Math.random() * 10,
      rotate: Math.random() * 360,
      round: Math.random() > 0.6,
    }))
    setConfetti((prev) => [...prev, ...pieces])
    // clean up after the animation finishes
    const ids = new Set(pieces.map((p) => p.id))
    setTimeout(() => {
      setConfetti((prev) => prev.filter((p) => !ids.has(p.id)))
    }, 5500)
  }, [])

  // A welcome burst when the page loads 🎉
  useEffect(() => {
    const t = setTimeout(() => burst(120), 400)
    return () => clearTimeout(t)
  }, [burst])

  const blowCandles = () => {
    if (candlesLit) {
      setCandlesLit(false)
      setWishMade(true)
      burst(140)
    } else {
      // relight + celebrate again
      setCandlesLit(true)
      setTimeout(() => setCandlesLit(false), 50)
    }
  }

  return (
    <div className="page">
      <Confetti pieces={confetti} />

      {/* drifting doodles */}
      <div className="doodles" aria-hidden="true">
        {DOODLES.map((d, i) => (
          <span
            key={i}
            className="doodle"
            style={{
              left: `${(i * 9 + 4) % 96}%`,
              animationDuration: `${10 + (i % 5) * 3}s`,
              animationDelay: `${i * 0.7}s`,
              fontSize: `${1.4 + (i % 4) * 0.4}rem`,
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* floating balloons */}
      <div className="balloons" aria-hidden="true">
        {CONFETTI_COLORS.map((c, i) => (
          <span
            key={i}
            className="balloon"
            style={{
              left: `${8 + i * 15}%`,
              background: c,
              animationDuration: `${9 + i * 1.5}s`,
              animationDelay: `${i * 1.3}s`,
            }}
          />
        ))}
      </div>

      <main className="hero">
        <p className="eyebrow">a little something for the artist of our family ✨</p>

        <h1 className="title">
          Happy Birthday,
          <span className="name">
            {WIFE_NAME}!
            <svg className="underline" viewBox="0 0 320 40" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M5 28 C 60 12, 120 12, 180 24 S 280 36, 315 16"
                fill="none"
                stroke="#ef476f"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="subtitle">
          To the one who paints color into our every ordinary day —
          and somehow makes the whole house feel like a masterpiece. 🎨
        </p>

        <figure className="hero-photo">
          <img src="/photos/nadide-mural.jpg" alt={`${WIFE_NAME} beside a beautiful flower mural`} loading="lazy" />
          <figcaption>the artist &amp; her masterpiece 🌸</figcaption>
        </figure>

        <section className="cake-section">
          <Cake lit={candlesLit} onBlow={blowCandles} />
          <p className="cake-caption">
            {candlesLit
              ? 'Tap the cake, close your eyes, and make a wish 💫'
              : 'Ooooh — wish made! We love you to the moon and back 🌙💛'}
          </p>
        </section>

        <section className={`card message ${wishMade ? 'reveal' : ''}`}>
          <h2>Dear {WIFE_NAME},</h2>
          <p>
            Thank you for being the most <strong>fun, lively, wonderfully colorful</strong> heart
            of this family. Your art doesn’t just hang on the walls — it lives in the way you
            laugh, the way you turn an ordinary afternoon into an adventure, and the way you love us.
          </p>
          <p>
            {DAUGHTER_ONE} and {DAUGHTER_TWO} are the luckiest girls in the world to have you for a
            mom — and I’m the luckiest to call you mine. Watching the three of you create, giggle,
            and make beautiful messes together is my favorite picture in the whole gallery of my life.
          </p>
          <p>
            Today, we celebrate <em>you</em>. Your kindness, your spark, your imagination,
            and every single thing that makes you, you.
          </p>
          <p className="signoff">
            With all our love,
            <br />
            {DAUGHTER_ONE}, {DAUGHTER_TWO} &amp; me 💛
          </p>
        </section>

        <section className="gallery">
          <h2 className="gallery-title">Our favorite snapshots 📸</h2>
          <div className="polaroids">
            {PHOTOS.map((photo) => (
              <figure
                className="polaroid"
                key={photo.src}
                style={{ '--tilt': `${photo.tilt}deg` }}
              >
                <span className="tape" />
                <img src={photo.src} alt={photo.caption} loading="lazy" />
                <figcaption>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <button className="celebrate-btn" onClick={() => burst(160)}>
          🎉 Throw some confetti! 🎉
        </button>
      </main>

      <footer className="footer">
        <p>Made with love, paint &amp; a lot of glitter — just for you, {WIFE_NAME}. 🖌️</p>
      </footer>
    </div>
  )
}
