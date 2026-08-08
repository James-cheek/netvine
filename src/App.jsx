import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ProfileProvider } from './lib/ProfileContext'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import DownlineTracker from './components/DownlineTracker'
import Announcements from './components/Announcements'
import TermsPage from './components/TermsPage'
import PrivacyPage from './components/PrivacyPage'

function viewFromPath() {
  const p = window.location.pathname
  if (p === '/terms') return 'terms'
  if (p === '/privacy') return 'privacy'
  if (p === '/login') return 'login'
  if (p === '/signup') return 'signup'
  return 'landing'
}

function AppInner() {
  const { session } = useAuth()
  const [view, setView] = useState(viewFromPath)

  const navigate = (v) => {
    const path = v === 'landing' ? '/' : `/${v}`
    window.history.pushState(null, '', path)
    setView(v)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const onPop = () => setView(viewFromPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (view === 'terms') return <TermsPage onNavigate={navigate} />
  if (view === 'privacy') return <PrivacyPage onNavigate={navigate} />

  if (session === undefined) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#F4F3EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ color: '#75837D', fontFamily: 'Georgia, serif', fontSize: 18 }}>
          Loading...
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <ProfileProvider>
        <Announcements />
        <DownlineTracker />
      </ProfileProvider>
    )
  }

  if (view === 'login' || view === 'signup') {
    return <AuthPage initialMode={view} onBack={() => navigate('landing')} />
  }

  return <LandingPage onNavigate={navigate} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
