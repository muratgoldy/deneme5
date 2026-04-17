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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [activeMood, setActiveMood] = useState(null)

  const selectMood = (mood) => {
    setActiveMood(mood.id === activeMood?.id ? null : mood)
    setPickerOpen(false)
  }

  const stop = () => setActiveMood(null)

  return (
    <>
      {/* Mini video player — small but visible so mobile browsers keep playing */}
      {activeMood && (
        <div className="player-mini-video">
          <iframe
            key={activeMood.id}
            src={getEmbedUrl(activeMood)}
            title={activeMood.label}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="player-mini-iframe"
          />
        </div>
      )}

      {/* Mood picker — slides up when open, doesn't cover content */}
      {pickerOpen && (
        <div className="mood-picker-panel">
          <div className="mood-picker-header">
            <span>🎵 Choose your vibe</span>
            <button className="player-close" onClick={() => setPickerOpen(false)}>✕</button>
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
        </div>
      )}

      {/* Mini-bar — always visible at bottom, never blocks content */}
      <div className={`mini-player ${activeMood ? 'mini-player-active' : ''}`}
           style={activeMood ? { '--mood-color': activeMood.color } : {}}>
        {activeMood ? (
          <>
            <span className="mini-bars">
              <span /><span /><span /><span />
            </span>
            <span className="mini-mood-name">{activeMood.emoji} {activeMood.label}</span>
            <button className="mini-change" onClick={() => setPickerOpen(o => !o)}>
              Change
            </button>
            <button className="mini-stop" onClick={stop} aria-label="Stop music">✕</button>
          </>
        ) : (
          <button className="mini-play-btn" onClick={() => setPickerOpen(o => !o)}>
            <span>🎵</span>
            <span>Play Music</span>
          </button>
        )}
      </div>
    </>
  )
}
