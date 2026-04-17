import { useState } from 'react'
import Header from './components/Header.jsx'
import QuoteSection from './components/QuoteSection.jsx'
import ExerciseSection from './components/ExerciseSection.jsx'
import DonationSection from './components/DonationSection.jsx'
import VideosSection from './components/VideosSection.jsx'
import NewsletterSection from './components/NewsletterSection.jsx'
import FloatingPlayer from './components/FloatingPlayer.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('inspire')

  return (
    <div className="app">
      <Header />

      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'inspire' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspire')}
        >
          ✨ Inspire Me
        </button>
        <button
          className={`tab-btn ${activeTab === 'move' ? 'active' : ''}`}
          onClick={() => setActiveTab('move')}
        >
          ⚡ Get Moving
        </button>
        <button
          className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          🎬 Watch & Grow
        </button>
        <button
          className={`tab-btn ${activeTab === 'give' ? 'active' : ''}`}
          onClick={() => setActiveTab('give')}
        >
          ❤️ Give Back
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
