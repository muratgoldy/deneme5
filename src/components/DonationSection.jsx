const charities = [
  {
    name: 'Against Malaria Foundation',
    shortName: 'AMF',
    emoji: '🦟',
    color: '#00BBF9',
    tagline: 'Save a life for ~$3,000.',
    description:
      'AMF funds the distribution of long-lasting insecticide-treated nets to protect people from malaria — one of the most cost-effective ways to save lives on the planet.',
    impact: [
      'A $5 donation protects a child for years',
      'Independently audited distributions',
      'Consistently ranked #1 by GiveWell',
    ],
    url: 'https://www.againstmalaria.com',
    cta: 'Donate to AMF',
  },
  {
    name: 'Share The Meal',
    shortName: 'WFP',
    emoji: '🍽️',
    color: '#FF6B35',
    tagline: 'Feed a child for less than a coffee.',
    description:
      'A UN World Food Programme app that lets you share meals with children in need. As little as $0.80 feeds a child for a full day through school meal programs.',
    impact: [
      '$0.80 = one school meal for a child',
      'Supports 18+ countries in crisis',
      'WFP won the 2020 Nobel Peace Prize',
    ],
    url: 'https://sharethemeal.org',
    cta: 'Share a Meal',
  },
  {
    name: 'GiveDirectly',
    shortName: 'GD',
    emoji: '💸',
    color: '#9B5DE5',
    tagline: 'Cash directly to people in extreme poverty.',
    description:
      'GiveDirectly sends money directly to people living in extreme poverty, with no strings attached. Research shows direct cash transfers are one of the highest-impact ways to help.',
    impact: [
      'Recipients decide what they need most',
      'Shown to reduce hunger, improve health',
      'Among the most evidence-backed charities',
    ],
    url: 'https://www.givedirectly.org',
    cta: 'Give Directly',
  },
]

const quickActions = [
  { emoji: '📱', text: 'Download the Share The Meal app and donate $0.80 right now.' },
  { emoji: '☕', text: 'Skip one coffee this week — donate that $5 to AMF.' },
  { emoji: '🔗', text: 'Share this page with a friend to multiply the impact.' },
  { emoji: '📅', text: 'Set up a small monthly donation — even $5/month makes a difference.' },
]

export default function DonationSection() {
  return (
    <section className="section">
      <h2 className="section-title">Give Back & Feel Good</h2>
      <p className="section-subtitle">
        One of the fastest ways to boost your own mood is to help someone else.
        Every amount counts.
      </p>

      <div className="charity-grid">
        {charities.map((charity) => (
          <div
            key={charity.name}
            className="charity-card"
            style={{ '--charity-color': charity.color }}
          >
            <div className="charity-header" style={{ background: charity.color }}>
              <span className="charity-emoji">{charity.emoji}</span>
              <div>
                <h3>{charity.name}</h3>
                <p className="charity-tagline">{charity.tagline}</p>
              </div>
            </div>

            <div className="charity-body">
              <p className="charity-desc">{charity.description}</p>

              <ul className="charity-impact">
                {charity.impact.map((item, i) => (
                  <li key={i}>
                    <span className="impact-dot" style={{ background: charity.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={charity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary charity-btn"
              style={{ background: charity.color }}
            >
              {charity.cta} →
            </a>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h3>Tiny actions, massive ripple effects</h3>
        <div className="quick-action-grid">
          {quickActions.map((action, i) => (
            <div key={i} className="quick-action-card">
              <span className="quick-action-emoji">{action.emoji}</span>
              <p>{action.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="impact-note">
        <p>
          💡 <strong>Remember:</strong> You don't need to be wealthy to make an impact. Small,
          consistent giving from many people creates enormous change. Even sharing this page
          helps spread awareness.
        </p>
      </div>
    </section>
  )
}
