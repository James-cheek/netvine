import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { APP_VERSION, compareVersions } from '../lib/version'

const COLORS = {
  canvas: '#F4F3EE',
  ink: '#1C2B27',
  accent: '#2F7D5D',
  paper: '#FFFFFF',
  muted: '#75837D',
  soft: '#E5E8E2',
}

export default function Announcements() {
  const { user } = useAuth()
  const [announcement, setAnnouncement] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!user) return

    (async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('released_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) return

      setAnnouncement(data)

      if (compareVersions(data.version, APP_VERSION) > 0) {
        setShowBanner(true)
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('last_seen_version')
        .eq('id', user.id)
        .single()

      const lastSeen = profile?.last_seen_version
      if (!lastSeen || compareVersions(data.version, lastSeen) > 0) {
        setShowPopup(true)
      }
    })()
  }, [user])

  const dismiss = async () => {
    setShowPopup(false)
    if (announcement) {
      await supabase
        .from('profiles')
        .update({ last_seen_version: announcement.version })
        .eq('id', user.id)
    }
  }

  return (
    <>
      {showBanner && (
        <div
          style={styles.banner}
          onClick={() => window.location.reload()}
        >
          A new version is available — tap to refresh
        </div>
      )}

      {showPopup && announcement && (
        <div style={styles.backdrop} onClick={dismiss}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div style={styles.badge}>NEW</div>
            <div style={styles.popupTitle}>{announcement.title}</div>
            <div style={styles.version}>v{announcement.version}</div>
            <div style={styles.notes}>
              {announcement.notes.split('\n').map((line, i) => {
                const trimmed = line.replace(/^-\s*/, '')
                if (!trimmed) return null
                return (
                  <div key={i} style={styles.noteLine}>
                    <span style={styles.bullet}>{'•'}</span>
                    <span>{trimmed}</span>
                  </div>
                )
              })}
            </div>
            <button style={styles.gotItBtn} onClick={dismiss}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: COLORS.accent,
    color: '#fff',
    textAlign: 'center',
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    cursor: 'pointer',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(28,43,39,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 200,
  },
  popup: {
    background: COLORS.paper,
    borderRadius: 16,
    padding: '28px 24px 24px',
    width: '100%',
    maxWidth: 380,
    boxShadow: '0 20px 50px rgba(28,43,39,0.25)',
  },
  badge: {
    display: 'inline-block',
    background: COLORS.accent,
    color: '#fff',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.2,
    padding: '3px 8px',
    borderRadius: 4,
    marginBottom: 12,
    fontFamily: 'system-ui, sans-serif',
  },
  popupTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.ink,
    lineHeight: 1.3,
  },
  version: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
    marginBottom: 18,
    fontWeight: 600,
  },
  notes: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 24,
  },
  noteLine: {
    display: 'flex',
    gap: 8,
    fontSize: 14,
    color: COLORS.ink,
    lineHeight: 1.5,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  bullet: {
    color: COLORS.accent,
    fontWeight: 700,
    flexShrink: 0,
  },
  gotItBtn: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: `1px solid ${COLORS.accent}`,
    background: COLORS.accent,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
}
