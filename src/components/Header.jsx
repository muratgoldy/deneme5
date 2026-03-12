export default function Header() {
  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-sun">☀️</span>
          <span className="logo-text">BrightDay</span>
        </div>
        <div className="header-greeting">
          <p className="greeting-text">{greeting()}, friend!</p>
          <p className="date-text">{today}</p>
        </div>
      </div>
      <div className="header-tagline">
        <p>Every day is a chance to shine brighter.</p>
      </div>
    </header>
  )
}
