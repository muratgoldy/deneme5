import { useState } from 'react'
import { LanguageProvider, useLanguage } from './LanguageContext.jsx'
import Header from './components/Header.jsx'
import QuoteSection from './components/QuoteSection.jsx'
import ExerciseSection from './components/ExerciseSection.jsx'
import DonationSection from './components/DonationSection.jsx'
import VideosSection from './components/VideosSection.jsx'
import NewsletterSection from './components/NewsletterSection.jsx'
import FloatingPlayer from './components/FloatingPlayer.jsx'
import Footer from './components/Footer.jsx'

function AppInner() {
  const [activeTab, setActiveTab] = useState('inspire')
  const { t } = useLanguage()

  return (
    <div className="app">
      <Header />

      <nav className="tab-nav">
        <button className={`tab-btn ${activeTab === 'inspire' ? 'active' : ''}`} onClick={() => setActiveTab('inspire')}>
          {t('tab_inspire')}
        </button>
        <button className={`tab-btn ${activeTab === 'move' ? 'active' : ''}`} onClick={() => setActiveTab('move')}>
          {t('tab_move')}
        </button>
        <button className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
          {t('tab_videos')}
        </button>
        <button className={`tab-btn ${activeTab === 'give' ? 'active' : ''}`} onClick={() => setActiveTab('give')}>
          {t('tab_give')}
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'inspire' && <QuoteSection />}
        {activeTab === 'move' && <ExerciseSection />}
        {activeTab === 'videos' && <VideosSection />}
        {activeTab === 'give' && <DonationSection />}
      </main>

      <NewsletterSection />
      <Footer />
      <FloatingPlayer />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  )
}
