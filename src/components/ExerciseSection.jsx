import { useState } from 'react'

const exercises = [
  {
    id: 1,
    emoji: '🧘',
    title: 'Box Breathing',
    duration: '2 min',
    energy: 'Calm',
    color: '#00BBF9',
    steps: [
      'Sit upright in your chair',
      'Breathe IN slowly for 4 counts',
      'HOLD your breath for 4 counts',
      'Breathe OUT slowly for 4 counts',
      'HOLD empty for 4 counts',
      'Repeat 4 times — feel the calm wash over you',
    ],
    benefit: 'Reduces stress instantly and sharpens focus',
  },
  {
    id: 2,
    emoji: '💪',
    title: 'Power Stretch',
    duration: '3 min',
    energy: 'Energize',
    color: '#FF6B35',
    steps: [
      'Stand up from your seat',
      'Reach both arms above your head — stretch tall!',
      'Roll your shoulders back 5 times',
      'Gently tilt your head side to side',
      'Shake out your hands and wiggle your fingers',
      'Take one big deep breath and smile',
    ],
    benefit: 'Releases tension and boosts circulation',
  },
  {
    id: 3,
    emoji: '🕺',
    title: '60-Second Dance Break',
    duration: '1 min',
    energy: 'Joy',
    color: '#F15BB5',
    steps: [
      'Put on your favorite upbeat song',
      'Stand up — anywhere is fine!',
      'Move your body however feels good',
      'Shake your arms, bop your head',
      'Smile and let go for 60 seconds',
      'Return to your seat feeling amazing',
    ],
    benefit: 'Releases endorphins and lifts mood immediately',
  },
  {
    id: 4,
    emoji: '👁️',
    title: '20-20-20 Eye Rest',
    duration: '1 min',
    energy: 'Rest',
    color: '#9B5DE5',
    steps: [
      'Look away from your screen',
      'Find something 20 feet (6m) away',
      'Stare at it for 20 seconds',
      'Blink slowly 10 times',
      'Gently cup your warm palms over closed eyes',
      'Rest for 10 seconds — ahh, relief!',
    ],
    benefit: 'Reduces eye strain and refreshes your vision',
  },
  {
    id: 5,
    emoji: '🚶',
    title: 'Walk & Think',
    duration: '5 min',
    energy: 'Refresh',
    color: '#00F5D4',
    steps: [
      'Stand up and walk around your space',
      'No phone — just you and your thoughts',
      'Notice 3 things you can see',
      'Notice 2 things you can hear',
      'Take 5 slow, intentional breaths',
      'Return with a fresh perspective',
    ],
    benefit: 'Clears mental fog and sparks creativity',
  },
  {
    id: 6,
    emoji: '🤲',
    title: 'Gratitude Pause',
    duration: '2 min',
    energy: 'Mindful',
    color: '#FEE440',
    steps: [
      'Close your eyes and take a breath',
      'Think of one person you appreciate',
      'Think of one thing your body does for you',
      'Think of one small moment that made you smile',
      'Feel the warmth of these thoughts',
      'Open your eyes — you are enough',
    ],
    benefit: 'Rewires your brain toward positivity and resilience',
  },
]

export default function ExerciseSection() {
  const [active, setActive] = useState(null)
  const [completedIds, setCompletedIds] = useState([])

  const startExercise = (exercise) => {
    setActive(exercise)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const markDone = () => {
    if (active) {
      setCompletedIds((prev) => [...prev, active.id])
      setActive(null)
    }
  }

  return (
    <section className="section">
      <h2 className="section-title">Quick Energy Boosters</h2>
      <p className="section-subtitle">
        Pick an activity — just a few minutes can transform your day.
      </p>

      {active && (
        <div className="exercise-active" style={{ borderColor: active.color }}>
          <div className="exercise-active-header" style={{ background: active.color }}>
            <span className="exercise-emoji">{active.emoji}</span>
            <div>
              <h3>{active.title}</h3>
              <span className="exercise-meta">{active.duration} · {active.energy}</span>
            </div>
            <button className="close-btn" onClick={() => setActive(null)}>✕</button>
          </div>
          <ol className="exercise-steps">
            {active.steps.map((step, i) => (
              <li key={i} className="exercise-step">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="exercise-benefit">
            <strong>Why this works:</strong> {active.benefit}
          </p>
          <button className="btn btn-primary btn-full" onClick={markDone}>
            ✅ I Did It! That felt great!
          </button>
        </div>
      )}

      <div className="exercise-grid">
        {exercises.map((ex) => {
          const done = completedIds.includes(ex.id)
          return (
            <button
              key={ex.id}
              className={`exercise-card ${done ? 'done' : ''}`}
              style={{ '--card-color': ex.color }}
              onClick={() => startExercise(ex)}
            >
              <span className="exercise-card-emoji">{ex.emoji}</span>
              <div className="exercise-card-body">
                <h3>{ex.title}</h3>
                <div className="exercise-card-meta">
                  <span className="badge" style={{ background: ex.color + '33', color: ex.color }}>
                    {ex.energy}
                  </span>
                  <span className="duration">{ex.duration}</span>
                </div>
              </div>
              {done && <span className="done-badge">✓ Done</span>}
            </button>
          )
        })}
      </div>

      {completedIds.length > 0 && (
        <div className="streak-box">
          <p>
            🎉 You completed <strong>{completedIds.length}</strong> activity{completedIds.length > 1 ? ' sessions' : ''} today! Keep it up!
          </p>
        </div>
      )}
    </section>
  )
}
