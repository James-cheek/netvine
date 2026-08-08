import React, { useState } from 'react'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ProfileProvider } from './lib/ProfileContext'
import LandingPage from './components/LandingPage'
import AuthPage from './components/AuthPage'
import DownlineTracker from './components/DownlineTracker'
import Announcements from './components/Announcements'

function AppInner() {
  const { session } = useAuth()
  const [view, setView] = useState('landing') // landing | login | signup

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
    return <AuthPage initialMode={view} onBack={() => setView('landing')} />
  }

  return <LandingPage onNavigate={setView} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
