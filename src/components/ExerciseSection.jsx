import { useState, useEffect } from 'react'

const DAILY_GOAL = 3

const exercises = [
  {
    id: 1, emoji: '🧘', title: 'Box Breathing', duration: '2 min', energy: 'Calm', color: '#00BBF9', points: 20,
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
    id: 2, emoji: '💪', title: 'Power Stretch', duration: '3 min', energy: 'Energize', color: '#FF6B35', points: 30,
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
    id: 3, emoji: '🕺', title: '60-Second Dance Break', duration: '1 min', energy: 'Joy', color: '#F15BB5', points: 10,
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
    id: 4, emoji: '👁️', title: '20-20-20 Eye Rest', duration: '1 min', energy: 'Rest', color: '#9B5DE5', points: 10,
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
    id: 5, emoji: '🚶', title: 'Walk & Think', duration: '5 min', energy: 'Refresh', color: '#00F5D4', points: 50,
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
    id: 6, emoji: '🤲', title: 'Gratitude Pause', duration: '2 min', energy: 'Mindful', color: '#FEE440', points: 20,
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

const BADGES = [
  { id: 'first',    emoji: '⭐', label: 'First Step',     desc: 'Complete your first exercise',  req: (p) => p.total >= 1 },
  { id: 'streak3',  emoji: '🔥', label: 'On Fire',        desc: '3 days in a row',               req: (p) => p.streak >= 3 },
  { id: 'streak7',  emoji: '⚡', label: 'Week Warrior',   desc: '7-day streak',                  req: (p) => p.streak >= 7 },
  { id: 'streak30', emoji: '💎', label: 'Diamond Mind',   desc: '30-day streak',                 req: (p) => p.streak >= 30 },
  { id: 'total10',  emoji: '🌟', label: 'Rising Star',    desc: '10 exercises completed',        req: (p) => p.total >= 10 },
  { id: 'total50',  emoji: '🏆', label: 'Champion',       desc: '50 exercises completed',        req: (p) => p.total >= 50 },
  { id: 'goal',     emoji: '🎯', label: 'Daily Hero',     desc: `Hit the ${DAILY_GOAL}-a-day goal`, req: (p) => p.todayCount >= DAILY_GOAL },
]

const TODAY = new Date().toDateString()
const YESTERDAY = new Date(Date.now() - 86400000).toDateString()

function loadProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem('brightday-progress') || '{}')
    const isToday = raw.lastDate === TODAY
    const wasYesterday = raw.lastDate === YESTERDAY
    return {
      streak:     isToday || wasYesterday ? (raw.streak || 0) : 0,
      lastDate:   raw.lastDate || null,
      total:      raw.total || 0,
      points:     raw.points || 0,
      badges:     raw.badges || [],
      todayIds:   isToday ? (raw.todayIds || []) : [],
      todayCount: isToday ? (raw.todayCount || 0) : 0,
    }
  } catch {
    return { streak: 0, lastDate: null, total: 0, points: 0, badges: [], todayIds: [], todayCount: 0 }
  }
}

function saveProgress(p) {
  localStorage.setItem('brightday-progress', JSON.stringify(p))
}

export default function ExerciseSection() {
  const [active, setActive] = useState(null)
  const [progress, setProgress] = useState(loadProgress)
  const [celebrate, setCelebrate] = useState(null) // badge id to celebrate
  const [justEarned, setJustEarned] = useState(null)

  const markDone = () => {
    if (!active) return

    setProgress((prev) => {
      const isNewDay = prev.lastDate !== TODAY
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak
      const newTodayIds = prev.todayIds.includes(active.id)
        ? prev.todayIds
        : [...prev.todayIds, active.id]
      const alreadyDoneToday = prev.todayIds.includes(active.id)
      const newTotal = alreadyDoneToday ? prev.total : prev.total + 1
      const newPoints = alreadyDoneToday ? prev.points : prev.points + active.points
      const newTodayCount = alreadyDoneToday ? prev.todayCount : prev.todayCount + 1

      const updated = {
        streak: newStreak,
        lastDate: TODAY,
        total: newTotal,
        points: newPoints,
        badges: prev.badges,
        todayIds: newTodayIds,
        todayCount: newTodayCount,
      }

      // Check for new badges
      const newBadges = BADGES.filter(
        (b) => !prev.badges.includes(b.id) && b.req(updated)
      )
      if (newBadges.length) {
        updated.badges = [...prev.badges, ...newBadges.map((b) => b.id)]
        setTimeout(() => {
          setJustEarned(newBadges[newBadges.length - 1])
          setCelebrate(true)
          setTimeout(() => setCelebrate(false), 3000)
        }, 400)
      }

      saveProgress(updated)
      return updated
    })

    setActive(null)
  }

  const goalPct = Math.min(100, (progress.todayCount / DAILY_GOAL) * 100)
  const goalMet = progress.todayCount >= DAILY_GOAL

  return (
    <section className="section">

      {/* Badge earned toast */}
      {celebrate && justEarned && (
        <div className="badge-toast">
          <span className="badge-toast-emoji">{justEarned.emoji}</span>
          <div>
            <p className="badge-toast-title">Badge unlocked!</p>
            <p className="badge-toast-name">{justEarned.label}</p>
          </div>
        </div>
      )}

      <h2 className="section-title">Quick Energy Boosters</h2>

      {/* Streak + stats bar */}
      <div className="streak-header">
        <div className="streak-stat">
          <span className="streak-number">{progress.streak}</span>
          <span className="streak-fire">{progress.streak > 0 ? '🔥' : '💤'}</span>
          <span className="streak-label">day streak</span>
        </div>
        <div className="streak-divider" />
        <div className="streak-stat">
          <span className="streak-number">{progress.points}</span>
          <span className="streak-label">XP</span>
        </div>
        <div className="streak-divider" />
        <div className="streak-stat">
          <span className="streak-number">{progress.total}</span>
          <span className="streak-label">total done</span>
        </div>
      </div>

      {/* Daily goal progress */}
      <div className="daily-goal">
        <div className="daily-goal-header">
          <span>Today's goal</span>
          <span className={goalMet ? 'goal-met-label' : ''}>
            {goalMet ? '🎯 Goal reached!' : `${progress.todayCount} / ${DAILY_GOAL} exercises`}
          </span>
        </div>
        <div className="goal-bar-track">
          <div
            className={`goal-bar-fill ${goalMet ? 'goal-bar-done' : ''}`}
            style={{ width: `${goalPct}%` }}
          />
        </div>
      </div>

      {/* Badges */}
      <div className="badges-row">
        {BADGES.map((badge) => {
          const earned = progress.badges.includes(badge.id)
          return (
            <div
              key={badge.id}
              className={`badge-chip ${earned ? 'badge-earned' : 'badge-locked'}`}
              title={`${badge.label}: ${badge.desc}`}
            >
              <span>{badge.emoji}</span>
              <span className="badge-chip-label">{badge.label}</span>
            </div>
          )
        })}
      </div>

      <p className="section-subtitle" style={{ marginTop: 20 }}>
        Pick an activity — earn XP and keep your streak alive!
      </p>

      {/* Active exercise panel */}
      {active && (
        <div className="exercise-active" style={{ borderColor: active.color }}>
          <div className="exercise-active-header" style={{ background: active.color }}>
            <span className="exercise-emoji">{active.emoji}</span>
            <div>
              <h3>{active.title}</h3>
              <span className="exercise-meta">{active.duration} · {active.energy} · +{active.points} XP</span>
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
            ✅ Done! Claim +{active.points} XP
          </button>
        </div>
      )}

      {/* Exercise grid */}
      <div className="exercise-grid">
        {exercises.map((ex) => {
          const done = progress.todayIds.includes(ex.id)
          return (
            <button
              key={ex.id}
              className={`exercise-card ${done ? 'done' : ''}`}
              style={{ '--card-color': ex.color }}
              onClick={() => setActive(ex)}
            >
              <span className="exercise-card-emoji">{ex.emoji}</span>
              <div className="exercise-card-body">
                <h3>{ex.title}</h3>
                <div className="exercise-card-meta">
                  <span className="badge" style={{ background: ex.color + '33', color: ex.color }}>
                    {ex.energy}
                  </span>
                  <span className="duration">{ex.duration}</span>
                  <span className="xp-pill">+{ex.points} XP</span>
                </div>
              </div>
              {done && <span className="done-badge">✓ Done</span>}
            </button>
          )
        })}
      </div>

    </section>
  )
}
