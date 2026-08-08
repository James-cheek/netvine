import React, { useState } from 'react'
import { useProfile } from '../lib/ProfileContext'
import UpgradeModal from './UpgradeModal'

const COLORS = {
  canvas: '#F4F3EE',
  ink: '#1C2B27',
  accent: '#2F7D5D',
  paper: '#FFFFFF',
  muted: '#75837D',
  soft: '#E5E8E2',
}

export default function BillingPage({ onBack }) {
  const { profile, isPro } = useProfile()
  const [showUpgrade, setShowUpgrade] = useState(false)

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={onBack}>{'←'} Back to chart</button>

        <div style={styles.heading}>Billing</div>

        <div style={styles.card}>
          <div style={styles.planRow}>
            <div>
              <div style={styles.planLabel}>Current plan</div>
              <div style={styles.planValue}>
                {isPro ? 'Pro' : 'Free'}
              </div>
            </div>
            <div style={isPro ? styles.proBadge : styles.freeBadge}>
              {isPro ? 'PRO' : 'FREE'}
            </div>
          </div>

          {isPro && profile?.subscription_status && (
            <div style={styles.statusRow}>
              <div style={styles.statusLabel}>Status</div>
              <div style={styles.statusValue}>{profile.subscription_status}</div>
            </div>
          )}
        </div>

        {!isPro && (
          <div style={styles.upgradeCard}>
            <div style={styles.upgradeTitle}>Unlock unlimited members</div>
            <div style={styles.upgradeText}>
              You're on the free plan with up to 10 members. Upgrade to Pro for unlimited growth.
            </div>
            <button style={styles.upgradeBtn} onClick={() => setShowUpgrade(true)}>
              Upgrade to Pro
            </button>
          </div>
        )}

        {isPro && (
          <div style={styles.manageCard}>
            <div style={styles.manageText}>
              To update your payment method, change plans, or cancel your subscription:
            </div>
            <a
              href="https://paystack.com/pay/manage"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.manageLink}
            >
              Manage subscription on Paystack
            </a>
          </div>
        )}

        <div style={styles.email}>
          Signed in as {profile?.email || '...'}
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    background: COLORS.canvas,
    overflowY: 'auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  container: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '18px 18px 60px',
  },
  backBtn: {
    padding: '8px 14px',
    borderRadius: 9,
    border: `1px solid ${COLORS.soft}`,
    background: COLORS.paper,
    color: COLORS.ink,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  heading: {
    fontFamily: 'Georgia, serif',
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.ink,
    marginTop: 24,
    marginBottom: 20,
  },
  card: {
    background: COLORS.paper,
    borderRadius: 14,
    padding: '18px 20px',
    boxShadow: '0 2px 8px rgba(28,43,39,0.06)',
    marginBottom: 16,
  },
  planRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  planValue: {
    fontFamily: 'Georgia, serif',
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.ink,
    marginTop: 2,
  },
  proBadge: {
    background: COLORS.accent,
    color: '#fff',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: '5px 12px',
    borderRadius: 6,
  },
  freeBadge: {
    background: COLORS.soft,
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: '5px 12px',
    borderRadius: 6,
  },
  statusRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTop: `1px solid ${COLORS.soft}`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: 600,
    color: COLORS.ink,
    textTransform: 'capitalize',
  },
  upgradeCard: {
    background: '#F0F7F4',
    borderRadius: 14,
    padding: '20px',
    marginBottom: 16,
  },
  upgradeTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.ink,
  },
  upgradeText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 1.5,
  },
  upgradeBtn: {
    marginTop: 14,
    padding: '12px 20px',
    borderRadius: 10,
    border: 'none',
    background: COLORS.accent,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  manageCard: {
    background: COLORS.paper,
    borderRadius: 14,
    padding: '18px 20px',
    boxShadow: '0 2px 8px rgba(28,43,39,0.06)',
    marginBottom: 16,
  },
  manageText: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 1.5,
  },
  manageLink: {
    display: 'inline-block',
    marginTop: 10,
    fontSize: 14,
    fontWeight: 600,
    color: COLORS.accent,
    textDecoration: 'none',
  },
  email: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 24,
    textAlign: 'center',
  },
}
