import React, { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useProfile } from '../lib/ProfileContext'
import { PLANS, PAYSTACK_PUBLIC_KEY } from '../lib/pricing'

const COLORS = {
  canvas: '#F4F3EE',
  ink: '#1C2B27',
  accent: '#2F7D5D',
  paper: '#FFFFFF',
  muted: '#75837D',
  soft: '#E5E8E2',
}

function detectNigeria() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return tz === 'Africa/Lagos'
  } catch { return false }
}

export default function UpgradeModal({ onClose }) {
  const { user } = useAuth()
  const { refreshProfile } = useProfile()
  const usdAvailable = PLANS.usd_monthly.code && PLANS.usd_annual.code
  const [currency, setCurrency] = useState(() => usdAvailable && !detectNigeria() ? 'USD' : 'NGN')
  const [interval, setInterval] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const planKey = `${currency.toLowerCase()}_${interval}`
  const plan = PLANS[planKey]
  const otherInterval = interval === 'monthly' ? 'annually' : 'monthly'
  const otherPlan = PLANS[`${currency.toLowerCase()}_${otherInterval === 'annually' ? 'annual' : 'monthly'}`]

  const handleCheckout = () => {
    if (!PAYSTACK_PUBLIC_KEY || !plan.code) {
      alert('Payment is not configured yet. Please try again later.')
      return
    }

    setLoading(true)

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      plan: plan.code,
      metadata: { user_id: user.id },
      callback: () => {
        setTimeout(() => {
          refreshProfile()
          onClose()
        }, 2000)
      },
      onClose: () => setLoading(false),
    })
    handler.openIframe()
  }

  useEffect(() => {
    if (document.getElementById('paystack-script')) return
    const s = document.createElement('script')
    s.id = 'paystack-script'
    s.src = 'https://js.paystack.co/v2/inline.js'
    s.async = true
    document.head.appendChild(s)
  }, [])

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <div style={styles.badge}>PRO</div>
        <div style={styles.title}>Grow without limits</div>
        <div style={styles.subtitle}>
          Upgrade to Pro and add unlimited members to your network.
        </div>

        <div style={styles.features}>
          {['Unlimited members', 'All current & future features', 'Priority support'].map((f) => (
            <div key={f} style={styles.featureRow}>
              <span style={styles.check}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* currency toggle — only shown when USD plans are configured */}
        {usdAvailable && (
          <div style={styles.toggleRow}>
            <button
              style={currency === 'NGN' ? styles.toggleActive : styles.toggleBtn}
              onClick={() => setCurrency('NGN')}
            >NGN ₦</button>
            <button
              style={currency === 'USD' ? styles.toggleActive : styles.toggleBtn}
              onClick={() => setCurrency('USD')}
            >USD $</button>
          </div>
        )}

        {/* price card */}
        <div style={styles.priceCard}>
          <div style={styles.priceMain}>{plan.display}</div>
          <div style={styles.founding}>Founding member price</div>
          <div style={styles.futurePrice}>
            Locks in at this rate — regular price {plan.futureDisplay}
          </div>
          {plan.savings && <div style={styles.savingsBadge}>{plan.savings}</div>}
        </div>

        {/* interval toggle */}
        <div style={styles.intervalRow}>
          <button
            style={interval === 'monthly' ? styles.intervalActive : styles.intervalBtn}
            onClick={() => setInterval('monthly')}
          >Monthly</button>
          <button
            style={interval === 'annual' ? styles.intervalActive : styles.intervalBtn}
            onClick={() => setInterval('annual')}
          >Annual{otherPlan.savings ? ` — ${otherPlan.savings}` : ''}</button>
        </div>

        <button
          style={{ ...styles.checkoutBtn, opacity: loading ? 0.6 : 1 }}
          disabled={loading}
          onClick={handleCheckout}
        >
          {loading ? 'Opening checkout...' : `Upgrade to Pro — ${plan.display}`}
        </button>

        <div style={styles.guarantee}>
          Cancel anytime. No hidden fees.
        </div>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(28,43,39,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 300,
  },
  modal: {
    position: 'relative',
    background: COLORS.paper,
    borderRadius: 16,
    padding: '32px 24px 24px',
    width: '100%',
    maxWidth: 400,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 50px rgba(28,43,39,0.25)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'none',
    border: 'none',
    fontSize: 18,
    color: COLORS.muted,
    cursor: 'pointer',
    padding: 4,
  },
  badge: {
    display: 'inline-block',
    background: COLORS.accent,
    color: '#fff',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: '4px 10px',
    borderRadius: 5,
    marginBottom: 14,
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.ink,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 1.5,
  },
  features: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  featureRow: {
    display: 'flex',
    gap: 8,
    fontSize: 14,
    color: COLORS.ink,
    alignItems: 'center',
  },
  check: {
    color: COLORS.accent,
    fontWeight: 700,
    fontSize: 16,
  },
  toggleRow: {
    display: 'flex',
    gap: 6,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    padding: '8px 0',
    borderRadius: 8,
    border: `1px solid ${COLORS.soft}`,
    background: COLORS.paper,
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  toggleActive: {
    flex: 1,
    padding: '8px 0',
    borderRadius: 8,
    border: `1px solid ${COLORS.accent}`,
    background: '#F0F7F4',
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  priceCard: {
    background: COLORS.canvas,
    borderRadius: 12,
    padding: '16px 18px',
    marginBottom: 14,
    textAlign: 'center',
  },
  priceMain: {
    fontFamily: 'Georgia, serif',
    fontSize: 32,
    fontWeight: 700,
    color: COLORS.ink,
  },
  founding: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.accent,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  futurePrice: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  savingsBadge: {
    display: 'inline-block',
    marginTop: 8,
    background: '#E8F5EE',
    color: '#1F5C42',
    fontSize: 12,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 12,
  },
  intervalRow: {
    display: 'flex',
    gap: 6,
    marginBottom: 18,
  },
  intervalActive: {
    flex: 1,
    padding: '10px 0',
    borderRadius: 8,
    border: `1.5px solid ${COLORS.accent}`,
    background: COLORS.paper,
    color: COLORS.ink,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  intervalBtn: {
    flex: 1,
    padding: '10px 0',
    borderRadius: 8,
    border: `1px solid ${COLORS.soft}`,
    background: COLORS.paper,
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  checkoutBtn: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 10,
    border: 'none',
    background: COLORS.accent,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  guarantee: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 12,
  },
}
