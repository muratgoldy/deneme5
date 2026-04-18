import { useLanguage } from '../LanguageContext.jsx'

const LANGS = ['en', 'es', 'tr', 'zh']

export default function Header() {
  const { lang, t, setLanguage } = useLanguage()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('greeting_morning')
    if (hour < 17) return t('greeting_afternoon')
    return t('greeting_evening')
  }

  const today = new Date().toLocaleDateString(t('date_locale'), {
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
          <p className="greeting-text">{greeting()}, {t('greeting_friend')}!</p>
          <p className="date-text">{today}</p>
        </div>
        <div className="lang-switcher">
          {LANGS.map((l) => (
            <button
              key={l}
              className={`lang-btn ${lang === l ? 'lang-btn-active' : ''}`}
              onClick={() => setLanguage(l)}
              title={t(`lang_${l}`)}
            >
              {t(`lang_${l}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="header-tagline">
        <p>{t('tagline')}</p>
      </div>
    </header>
  )
}
