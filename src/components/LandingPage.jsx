import React, { useEffect, useRef, useState } from 'react'
import { FREE_MEMBER_LIMIT, PLANS } from '../lib/pricing'

const C = {
  canvas: '#F4F3EE',
  ink: '#1C2B27',
  accent: '#2F7D5D',
  accentLight: '#3FA97C',
  paper: '#FFFFFF',
  muted: '#75837D',
  soft: '#E5E8E2',
  line: '#B9C4BE',
}

/* ─── animated hero chart ─── */

const TREE = [
  { id: 0, name: 'You', x: 250, y: 48, r: 28, root: true, parent: null, delay: 0 },
  { id: 1, name: 'Ada', x: 130, y: 170, r: 22, parent: 0, delay: 600 },
  { id: 2, name: 'Tunde', x: 370, y: 170, r: 22, parent: 0, delay: 900 },
  { id: 3, name: 'Joy', x: 60, y: 290, r: 19, parent: 1, delay: 1500 },
  { id: 4, name: 'Emeka', x: 185, y: 290, r: 19, parent: 1, delay: 1800 },
  { id: 5, name: 'Chioma', x: 310, y: 290, r: 19, parent: 2, delay: 2100 },
  { id: 6, name: 'David', x: 430, y: 290, r: 19, parent: 2, delay: 2400 },
  { id: 7, name: 'Bola', x: 120, y: 395, r: 16, parent: 3, delay: 3000 },
  { id: 8, name: 'Ife', x: 245, y: 395, r: 16, parent: 4, delay: 3300 },
  { id: 9, name: 'Sam', x: 370, y: 395, r: 16, parent: 5, delay: 3600 },
]

const STATUS_COLORS = ['#2F7D5D', '#5B7A8C', '#1F5C42', '#C08A2D', '#2F7D5D']

function HeroChart() {
  const [visible, setVisible] = useState(new Set())
  const timers = useRef([])

  useEffect(() => {
    TREE.forEach((node) => {
      const t = setTimeout(() => {
        setVisible((prev) => new Set(prev).add(node.id))
      }, node.delay + 400)
      timers.current.push(t)
    })
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <svg viewBox="0 0 500 440" style={{ width: '100%', maxWidth: 500, display: 'block', margin: '0 auto' }}>
      {/* connector lines — drawn when both ends visible */}
      {TREE.filter((n) => n.parent !== null).map((node) => {
        const parent = TREE[node.parent]
        const show = visible.has(node.id) && visible.has(parent.id)
        const midY = (parent.y + node.y) / 2
        return (
          <path
            key={`l-${node.id}`}
            d={`M ${parent.x} ${parent.y + parent.r} C ${parent.x} ${midY}, ${node.x} ${midY}, ${node.x} ${node.y - node.r}`}
            fill="none"
            stroke={C.line}
            strokeWidth={1.8}
            strokeLinecap="round"
            style={{
              opacity: show ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />
        )
      })}
      {/* nodes */}
      {TREE.map((node) => {
        const show = visible.has(node.id)
        const color = node.root ? C.ink : STATUS_COLORS[node.id % STATUS_COLORS.length]
        const initials = node.name.split(/\s+/).map((w) => w[0]).join('').toUpperCase()
        return (
          <g
            key={node.id}
            transform={`translate(${node.x},${node.y})`}
            style={{
              opacity: show ? 1 : 0,
              transform: `translate(${node.x}px,${node.y}px) scale(${show ? 1 : 0.3})`,
              transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <circle
              r={node.r}
              fill={node.root ? C.ink : C.paper}
              stroke={node.root ? C.ink : color}
              strokeWidth={2.2}
            />
            <text
              textAnchor="middle"
              dy="0.35em"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: node.r * 0.8,
                fontWeight: 700,
                fill: node.root ? C.canvas : C.ink,
                userSelect: 'none',
              }}
            >
              {initials}
            </text>
            <text
              y={node.r + 14}
              textAnchor="middle"
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 11,
                fontWeight: 600,
                fill: C.ink,
                userSelect: 'none',
              }}
            >
              {node.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── main landing ─── */

export default function LandingPage({ onNavigate }) {
  return (
    <div style={styles.page}>
      {/* nav */}
      <nav style={styles.nav}>
        <img src="/netvine-wordmark.svg" alt="Netvine" style={{ height: 32 }} />
        <div style={styles.navRight}>
          <button style={styles.navLink} onClick={() => onNavigate('login')}>Log in</button>
          <button style={styles.navCta} onClick={() => onNavigate('signup')}>Start free</button>
        </div>
      </nav>

      {/* hero */}
      <section style={styles.hero}>
        <h1 style={styles.h1}>
          See your entire network.<br />
          <span style={{ color: C.accent }}>Grow it with clarity.</span>
        </h1>
        <p style={styles.heroSub}>
          Netvine gives network marketing leaders a beautiful visual map of their downline — track every member's progress, spot who needs help, and watch your team grow.
        </p>
        <button style={styles.heroCta} onClick={() => onNavigate('signup')}>
          Start free
        </button>
        <div style={styles.heroNote}>Free forever for up to {FREE_MEMBER_LIMIT} members. No card required.</div>
      </section>

      {/* live chart */}
      <section style={styles.chartSection}>
        <div style={styles.chartFrame}>
          <HeroChart />
        </div>
      </section>

      {/* features */}
      <section style={styles.features}>
        <h2 style={styles.h2}>Built for how you actually work</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: '🌳', title: 'Visual org chart', desc: 'See your full downline as a zoomable, pannable tree. Circles, connector lines, names — the way you already think about your network.' },
            { icon: '📋', title: 'Member profiles', desc: 'Track each person\'s progress status, current issue, proposed solution, and a dated log of every interaction.' },
            { icon: '☁️', title: 'Cloud sync', desc: 'Your data saves automatically and stays in sync. Log in from any device and pick up where you left off.' },
            { icon: '📱', title: 'Mobile-first', desc: 'Designed for your phone first. Pinch to zoom, tap to select, swipe to pan — works the way you expect.' },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureTitle}>{f.title}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section style={styles.pricing} id="pricing">
        <h2 style={styles.h2}>Simple pricing</h2>
        <p style={styles.pricingSub}>Start free, upgrade when you're ready to grow beyond {FREE_MEMBER_LIMIT} members.</p>

        <div style={styles.pricingGrid}>
          {/* Free */}
          <div style={styles.priceCard}>
            <div style={styles.priceLabel}>Free</div>
            <div style={styles.priceAmount}>₦0</div>
            <div style={styles.priceInterval}>forever</div>
            <ul style={styles.priceFeatures}>
              <li>Up to {FREE_MEMBER_LIMIT} members</li>
              <li>Full org chart</li>
              <li>Member profiles & tracking</li>
              <li>Cloud sync</li>
            </ul>
            <button style={styles.priceBtn} onClick={() => onNavigate('signup')}>
              Start free
            </button>
          </div>

          {/* Pro */}
          <div style={{ ...styles.priceCard, ...styles.priceCardPro }}>
            <div style={styles.proBadge}>FOUNDING PRICE</div>
            <div style={styles.priceLabel}>Pro</div>
            <div style={styles.priceAmountPro}>{PLANS.ngn_monthly.display}</div>
            <div style={styles.priceInterval}>
              or {PLANS.ngn_annual.display} ({PLANS.ngn_annual.savings})
            </div>
            <ul style={styles.priceFeatures}>
              <li><strong>Unlimited</strong> members</li>
              <li>Everything in Free</li>
              <li>Priority support</li>
              <li>All future features</li>
            </ul>
            <div style={styles.foundingNote}>
              This founding price is locked in for as long as your subscription stays active. Regular price will be {PLANS.ngn_monthly.futureDisplay}.
            </div>
            <button style={styles.priceBtnPro} onClick={() => onNavigate('signup')}>
              Start free, upgrade later
            </button>
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section style={styles.finalCta}>
        <h2 style={{ ...styles.h2, color: '#fff' }}>Ready to see your network clearly?</h2>
        <button style={styles.finalCtaBtn} onClick={() => onNavigate('signup')}>
          Start free
        </button>
      </section>

      {/* footer */}
      <footer style={styles.footer}>
        <img src="/logo-mark.svg" alt="" style={{ height: 28, opacity: 0.4 }} />
        <div style={styles.footerText}>
          Netvine — grow your network.
        </div>
      </footer>
    </div>
  )
}

/* ─── styles ─── */

const styles = {
  page: {
    background: C.canvas,
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflowX: 'hidden',
  },

  /* nav */
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    maxWidth: 1080,
    margin: '0 auto',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: C.muted,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    padding: '8px 12px',
  },
  navCta: {
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    background: C.accent,
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },

  /* hero */
  hero: {
    textAlign: 'center',
    padding: '48px 20px 20px',
    maxWidth: 640,
    margin: '0 auto',
  },
  h1: {
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(28px, 6vw, 44px)',
    fontWeight: 700,
    color: C.ink,
    lineHeight: 1.15,
    letterSpacing: -0.5,
    margin: 0,
  },
  heroSub: {
    fontSize: 16,
    lineHeight: 1.6,
    color: C.muted,
    marginTop: 18,
    maxWidth: 480,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroCta: {
    marginTop: 28,
    padding: '14px 36px',
    borderRadius: 12,
    border: 'none',
    background: C.accent,
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    boxShadow: '0 4px 14px rgba(47,125,93,0.3)',
  },
  heroNote: {
    fontSize: 13,
    color: C.muted,
    marginTop: 12,
  },

  /* chart showcase */
  chartSection: {
    padding: '20px 20px 48px',
    maxWidth: 560,
    margin: '0 auto',
  },
  chartFrame: {
    background: C.paper,
    borderRadius: 20,
    padding: '28px 16px 12px',
    boxShadow: '0 8px 40px rgba(28,43,39,0.10)',
    border: `1px solid ${C.soft}`,
  },

  /* features */
  features: {
    padding: '56px 20px',
    maxWidth: 900,
    margin: '0 auto',
  },
  h2: {
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(22px, 4vw, 32px)',
    fontWeight: 700,
    color: C.ink,
    textAlign: 'center',
    margin: 0,
    letterSpacing: -0.3,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 18,
    marginTop: 36,
  },
  featureCard: {
    background: C.paper,
    borderRadius: 14,
    padding: '22px 20px',
    boxShadow: '0 2px 8px rgba(28,43,39,0.05)',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  featureTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: 16,
    fontWeight: 700,
    color: C.ink,
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 13.5,
    lineHeight: 1.55,
    color: C.muted,
  },

  /* pricing */
  pricing: {
    padding: '56px 20px',
    maxWidth: 760,
    margin: '0 auto',
  },
  pricingSub: {
    textAlign: 'center',
    fontSize: 15,
    color: C.muted,
    marginTop: 8,
    marginBottom: 32,
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 18,
    alignItems: 'start',
  },
  priceCard: {
    background: C.paper,
    borderRadius: 16,
    padding: '28px 24px',
    boxShadow: '0 2px 10px rgba(28,43,39,0.06)',
    position: 'relative',
  },
  priceCardPro: {
    border: `2px solid ${C.accent}`,
  },
  proBadge: {
    position: 'absolute',
    top: -11,
    left: 20,
    background: C.accent,
    color: '#fff',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.2,
    padding: '4px 10px',
    borderRadius: 5,
  },
  priceLabel: {
    fontFamily: 'Georgia, serif',
    fontSize: 20,
    fontWeight: 700,
    color: C.ink,
  },
  priceAmount: {
    fontFamily: 'Georgia, serif',
    fontSize: 36,
    fontWeight: 700,
    color: C.ink,
    marginTop: 4,
  },
  priceAmountPro: {
    fontFamily: 'Georgia, serif',
    fontSize: 36,
    fontWeight: 700,
    color: C.accent,
    marginTop: 4,
  },
  priceInterval: {
    fontSize: 14,
    color: C.muted,
    marginTop: 2,
  },
  priceFeatures: {
    listStyle: 'none',
    padding: 0,
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    fontSize: 14,
    color: C.ink,
    lineHeight: 1.4,
  },
  foundingNote: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 1.5,
    marginBottom: 18,
    padding: '10px 12px',
    background: '#F0F7F4',
    borderRadius: 8,
  },
  priceBtn: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    border: `1.5px solid ${C.soft}`,
    background: C.paper,
    color: C.ink,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },
  priceBtnPro: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    border: 'none',
    background: C.accent,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },

  /* final CTA */
  finalCta: {
    background: C.ink,
    padding: '56px 20px',
    textAlign: 'center',
  },
  finalCtaBtn: {
    marginTop: 22,
    padding: '14px 40px',
    borderRadius: 12,
    border: 'none',
    background: C.accent,
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },

  /* footer */
  footer: {
    padding: '32px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: C.muted,
  },
}
