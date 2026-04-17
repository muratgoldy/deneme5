import { useState } from 'react'

const moods = [
  {
    id: 'morning',
    emoji: '🌅',
    label: 'Morning Energy',
    desc: 'Uplifting beats to start your day',
    color: '#FF6B35',
    videoId: 'videoseries',
    listId: 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
  },
  {
    id: 'focus',
    emoji: '🧠',
    label: 'Deep Focus',
    desc: 'Lo-fi beats to study & create',
    color: '#00BBF9',
    videoId: 'jfKfPfyJRdk',
    listId: null,
  },
  {
    id: 'chill',
    emoji: '🌿',
    label: 'Chill & Relax',
    desc: 'Calm acoustic & ambient sounds',
    color: '#00F5D4',
    videoId: 'videoseries',
    listId: 'PLnIclDWBCovHBsZ37VjFZbx0U2D3bXAY6',
  },
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy Vibes',
    desc: 'Feel-good songs to brighten up',
    color: '#FEE440',
    textColor: '#1a1a2e',
    videoId: 'videoseries',
    listId: 'PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx',
  },
  {
    id: 'power',
    emoji: '💪',
    label: 'Power Up',
    desc: 'High energy to get things done',
    color: '#9B5DE5',
    videoId: 'videoseries',
    listId: 'PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo',
  },
  {
    id: 'nature',
    emoji: '🌊',
    label: 'Nature Sounds',
    desc: 'Rain, waves & forest ambience',
    color: '#3A86FF',
    videoId: 'eKFTSSKCzWA',
    listId: null,
  },
]

function getEmbedUrl(mood) {
  if (mood.listId) {
    return `https://www.youtube.com/embed/videoseries?list=${mood.listId}&autoplay=1&rel=0`
  }
  return `https://www.youtube.com/embed/${mood.videoId}?autoplay=1&rel=0`
}

export default function FloatingPlayer() {
  const [open, setOpen] = useState(false)
  const [activeMood, setActiveMood] = useState(null)
  const isPlaying = activeMood !== null

  const selectMood = (mood) => {
    setActiveMood(mood.id === activeMood?.id ? null : mood)
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="player-backdrop" onClick={() => setOpen(false)} />
      )}

      {/* Panel */}
      {open && (
        <div className="player-panel">
          <div className="player-panel-header">
            <h3>🎵 Set the Vibe</h3>
            <button className="player-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="mood-grid">
            {moods.map((mood) => {
              const active = activeMood?.id === mood.id
              return (
                <button
                  key={mood.id}
                  className={`mood-card ${active ? 'mood-card-active' : ''}`}
                  style={{ '--mood-color': mood.color }}
                  onClick={() => selectMood(mood)}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <div className="mood-info">
                    <span className="mood-label">{mood.label}</span>
                    <span className="mood-desc">{mood.desc}</span>
                  </div>
                  {active && <span className="mood-playing-dot" />}
                </button>
              )
            })}
          </div>

          {activeMood && (
            <div className="player-embed-wrap">
              <div className="player-now-playing">
                <span className="bars">
                  <span /><span /><span /><span />
                </span>
                <span>Now playing: <strong>{activeMood.label}</strong></span>
              </div>
              <iframe
                key={activeMood.id}
                src={getEmbedUrl(activeMood)}
                title={activeMood.label}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="player-iframe"
              />
            </div>
          )}

          {!activeMood && (
            <p className="player-hint">Pick a mood above to start playing ☝️</p>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`fab ${isPlaying ? 'fab-playing' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Music player"
        title="Music player"
      >
        {isPlaying ? (
          <>
            <span className="fab-bars">
              <span /><span /><span /><span />
            </span>
            <span>{activeMood.emoji} {activeMood.label}</span>
          </>
        ) : (
          <>
            <span className="fab-icon">🎵</span>
            <span>Play Music</span>
          </>
        )}
        {false && (
          <span className="fab-label">{activeMood?.emoji}</span>
        )}
      </button>
    </>
  )
}
