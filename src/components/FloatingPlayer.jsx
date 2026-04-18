import { useState, useRef } from 'react'
import { useLanguage } from '../LanguageContext.jsx'

const MOOD_DATA = [
  { id: 'morning', emoji: '🌅', color: '#FF6B35', url: 'https://www.youtube.com/embed/videoseries?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI&rel=0' },
  { id: 'focus',   emoji: '🧠', color: '#00BBF9', url: 'https://www.youtube.com/embed/jfKfPfyJRdk?rel=0' },
  { id: 'chill',   emoji: '🌿', color: '#00F5D4', url: 'https://www.youtube.com/embed/videoseries?list=PLnIclDWBCovHBsZ37VjFZbx0U2D3bXAY6&rel=0' },
  { id: 'happy',   emoji: '😊', color: '#FEE440', url: 'https://www.youtube.com/embed/videoseries?list=PLgzTt0k8mXzEk586ze4BjvDXR7c-TUSnx&rel=0' },
  { id: 'power',   emoji: '💪', color: '#9B5DE5', url: 'https://www.youtube.com/embed/videoseries?list=PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo&rel=0' },
  { id: 'nature',  emoji: '🌊', color: '#3A86FF', url: 'https://www.youtube.com/embed/eKFTSSKCzWA?rel=0' },
]

export default function FloatingPlayer() {
  const { t } = useLanguage()
  const [activeMood, setActiveMood] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [playerVisible, setPlayerVisible] = useState(true)
  const iframeRef = useRef(null)

  const moods = MOOD_DATA.map((m) => ({
    ...m,
    label: t(`mood_${m.id}_label`),
    desc:  t(`mood_${m.id}_desc`),
  }))

  const selectMood = (mood) => {
    const next = mood.id === activeMood?.id ? null : mood
    setActiveMood(next)
    setPickerOpen(false)
    setPlayerVisible(true)
    if (iframeRef.current) {
      iframeRef.current.src = next ? next.url : 'about:blank'
    }
  }

  const stop = () => {
    setActiveMood(null)
    if (iframeRef.current) iframeRef.current.src = 'about:blank'
  }

  return (
    <>
      <div
        className="yt-player-wrap"
        style={{
          opacity: activeMood && playerVisible ? 1 : 0,
          pointerEvents: activeMood && playerVisible ? 'auto' : 'none',
          bottom: activeMood && playerVisible ? '104px' : '52px',
        }}
      >
        <div className="yt-player-bar" style={{ background: activeMood?.color || '#FF6B35' }}>
          <span>{activeMood?.emoji} {activeMood?.label}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="yt-ctrl" onClick={() => setPlayerVisible(v => !v)} title="Minimise">
              {playerVisible ? '▾' : '▴'}
            </button>
            <button className="yt-ctrl" onClick={stop} title="Stop">✕</button>
          </div>
        </div>
        <iframe
          ref={iframeRef}
          src="about:blank"
          title="Music player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="yt-iframe"
        />
      </div>

      {pickerOpen && (
        <div className="mood-picker-panel">
          <div className="mood-picker-header">
            <span>{t('player_choose_vibe')}</span>
            <button className="player-close" onClick={() => setPickerOpen(false)}>✕</button>
          </div>
          <div className="mood-grid">
            {moods.map((mood) => (
              <button
                key={mood.id}
                className={`mood-card ${activeMood?.id === mood.id ? 'mood-card-active' : ''}`}
                style={{ '--mood-color': mood.color }}
                onClick={() => selectMood(mood)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <div className="mood-info">
                  <span className="mood-label">{mood.label}</span>
                  <span className="mood-desc">{mood.desc}</span>
                </div>
                {activeMood?.id === mood.id && <span className="mood-playing-dot" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`mini-player ${activeMood ? 'mini-player-active' : ''}`} style={activeMood ? { '--mood-color': activeMood.color } : {}}>
        {activeMood ? (
          <>
            <span className="mini-bars"><span /><span /><span /><span /></span>
            <span className="mini-mood-name">{activeMood.emoji} {activeMood.label}</span>
            <button className="mini-change" onClick={() => setPickerOpen(o => !o)}>{t('player_change')}</button>
            <button className="mini-stop" onClick={stop} aria-label="Stop">✕</button>
          </>
        ) : (
          <button className="mini-play-btn" onClick={() => setPickerOpen(o => !o)}>
            <span>🎵</span>
            <span>{t('player_play_music')}</span>
          </button>
        )}
      </div>
    </>
  )
}
