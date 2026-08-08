import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const COLORS = {
  canvas: '#F4F3EE',
  ink: '#1C2B27',
  accent: '#2F7D5D',
  paper: '#FFFFFF',
  muted: '#75837D',
  soft: '#E5E8E2',
}

export default function AuthPage({ initialMode = 'login', onBack }) {
  const [mode, setMode] = useState(initialMode) // login | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const clearFeedback = () => { setMessage(null); setError(null) }

  const handleLogin = async (e) => {
    e.preventDefault()
    clearFeedback()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    clearFeedback()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a confirmation link.')
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    clearFeedback()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset link sent — check your email.')
    }
  }

  const onSubmit = mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleReset

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src="/netvine-wordmark.svg" alt="Netvine" style={styles.logoImg} />
        </div>
        <div style={styles.tagline}>
          {mode === 'login' && 'Log in to your account'}
          {mode === 'signup' && 'Create your account'}
          {mode === 'reset' && 'Reset your password'}
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            autoComplete="email"
          />
          {mode !== 'reset' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          )}

          {error && <div style={styles.error}>{error}</div>}
          {message && <div style={styles.success}>{message}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Please wait...' :
              mode === 'login' ? 'Log in' :
              mode === 'signup' ? 'Sign up' :
              'Send reset link'}
          </button>
        </form>

        <div style={styles.links}>
          {mode === 'login' && (
            <>
              <button style={styles.linkBtn} onClick={() => { setMode('signup'); clearFeedback() }}>
                Don't have an account? Sign up
              </button>
              <button style={styles.linkBtn} onClick={() => { setMode('reset'); clearFeedback() }}>
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <button style={styles.linkBtn} onClick={() => { setMode('login'); clearFeedback() }}>
              Already have an account? Log in
            </button>
          )}
          {mode === 'reset' && (
            <button style={styles.linkBtn} onClick={() => { setMode('login'); clearFeedback() }}>
              Back to log in
            </button>
          )}
        </div>

        {onBack && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button style={styles.linkBtn} onClick={onBack}>
              {'←'} Back to home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    background: COLORS.canvas,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    background: COLORS.paper,
    borderRadius: 16,
    padding: '36px 28px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 8px 30px rgba(28,43,39,0.10)',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: 4,
  },
  logoImg: {
    height: 48,
    width: 'auto',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: `1px solid ${COLORS.soft}`,
    background: COLORS.paper,
    color: COLORS.ink,
    fontSize: 15,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    padding: '12px 16px',
    borderRadius: 10,
    border: `1px solid ${COLORS.accent}`,
    background: COLORS.accent,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    marginTop: 4,
  },
  error: {
    fontSize: 13,
    color: '#A05252',
    background: '#FDF2F2',
    padding: '10px 12px',
    borderRadius: 8,
  },
  success: {
    fontSize: 13,
    color: '#2F7D5D',
    background: '#F0F7F4',
    padding: '10px 12px',
    borderRadius: 8,
  },
  links: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 0,
  },
}
