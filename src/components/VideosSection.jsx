import { useState } from 'react'

const videos = [
  {
    id: 'qp0HIF3SfI4',
    title: 'How Great Leaders Inspire Action',
    speaker: 'Simon Sinek',
    duration: '18 min',
    category: 'Leadership',
    categoryColor: '#9B5DE5',
    description: 'Discover the Golden Circle and why starting with "why" transforms how you lead and live.',
  },
  {
    id: 'fLJsdqxnZb0',
    title: 'The Happy Secret to Better Work',
    speaker: 'Shawn Achor',
    duration: '12 min',
    category: 'Happiness',
    categoryColor: '#FFA500',
    description: 'Shawn Achor reveals why happiness fuels success — not the other way around.',
  },
  {
    id: '_X0mgOOSpLU',
    title: 'The Power of Believing You Can Improve',
    speaker: 'Carol Dweck',
    duration: '10 min',
    category: 'Growth Mindset',
    categoryColor: '#00BBF9',
    description: 'Learn how the simple belief in growth transforms achievement and resilience.',
  },
  {
    id: 'iCvmsMzlF7o',
    title: 'The Power of Vulnerability',
    speaker: 'Brené Brown',
    duration: '20 min',
    category: 'Connection',
    categoryColor: '#F15BB5',
    description: 'Brené Brown explores how vulnerability is the birthplace of courage and belonging.',
  },
  {
    id: 'Ks-_Mh1QhMc',
    title: 'Your Body Language May Shape Who You Are',
    speaker: 'Amy Cuddy',
    duration: '21 min',
    category: 'Confidence',
    categoryColor: '#00F5D4',
    description: 'Simple body postures can transform your confidence and performance in minutes.',
  },
  {
    id: 'Cpc-t-Uwv1I',
    title: 'Why We Do What We Do',
    speaker: 'Tony Robbins',
    duration: '22 min',
    category: 'Motivation',
    categoryColor: '#FF6B35',
    description: 'Tony Robbins digs into the invisible forces that drive every human action.',
  },
]

export default function VideosSection() {
  const [playingId, setPlayingId] = useState(null)

  return (
    <section className="section">
      <h2 className="section-title">Watch & Grow</h2>
      <p className="section-subtitle">
        Curated talks that will shift your perspective and fuel your fire.
      </p>

      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-embed-wrap">
              {playingId === video.id ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                />
              ) : (
                <button
                  className="video-thumb-btn"
                  onClick={() => setPlayingId(video.id)}
                  aria-label={`Play ${video.title}`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="video-thumb"
                  />
                  <div className="video-play-overlay">
                    <div className="play-btn-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="video-card-body">
              <span
                className="video-category-badge"
                style={{ background: video.categoryColor }}
              >
                {video.category}
              </span>
              <h3 className="video-title">{video.title}</h3>
              <p className="video-speaker">{video.speaker} · {video.duration}</p>
              <p className="video-desc">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
