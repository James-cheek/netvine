import React from 'react'
import { SUPPORT_EMAIL } from '../lib/config'

const C = {
  canvas: '#F4F3EE',
  ink: '#1C2B27',
  accent: '#2F7D5D',
  paper: '#FFFFFF',
  muted: '#75837D',
  soft: '#E5E8E2',
}

export default function PrivacyPage({ onNavigate }) {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <img
          src="/netvine-wordmark.svg"
          alt="Netvine"
          style={{ height: 32, cursor: 'pointer' }}
          onClick={() => onNavigate('landing')}
        />
        <div style={styles.navRight}>
          <button style={styles.navLink} onClick={() => onNavigate('login')}>Log in</button>
          <button style={styles.navCta} onClick={() => onNavigate('signup')}>Start free</button>
        </div>
      </nav>

      <article style={styles.content}>
        <h1 style={styles.h1}>Privacy Policy</h1>
        <p style={styles.updated}>Last updated: August 8, 2026</p>

        <p style={styles.p}>
          This policy explains what information Netvine (<a href="https://www.netvine.app" style={styles.link}>www.netvine.app</a>) collects,
          how we use it, and your choices. Netvine is operated by an individual sole proprietor based in Nigeria.
        </p>

        <h2 style={styles.h2}>1. What we collect</h2>
        <p style={styles.p}><strong>Account information:</strong> your email address and password (hashed — we never see or store your actual password).</p>
        <p style={styles.p}><strong>Downline data:</strong> member names, progress notes, issues, solutions, tracking entries, and tree structure — everything you enter into the app.</p>
        <p style={styles.p}><strong>Payment information:</strong> if you subscribe to Pro, Paystack collects and processes your payment details. We receive a customer code and subscription status from Paystack but never see your card number or bank details.</p>
        <p style={styles.p}><strong>Usage data:</strong> basic technical information like your browser type and when you last logged in, used for keeping the service running and diagnosing issues.</p>

        <h2 style={styles.h2}>2. How we use your data</h2>
        <ul style={styles.ul}>
          <li style={styles.li}>To provide and operate the Netvine service</li>
          <li style={styles.li}>To authenticate your account and keep it secure</li>
          <li style={styles.li}>To process subscription payments via Paystack</li>
          <li style={styles.li}>To send you important service notifications (e.g. billing confirmations, security alerts)</li>
          <li style={styles.li}>To improve the service based on how it's used</li>
        </ul>
        <p style={styles.p}>
          We do <strong>not</strong> sell your data to third parties. We do <strong>not</strong> use your data for targeted advertising.
        </p>

        <h2 style={styles.h2}>3. Where your data is stored</h2>
        <p style={styles.p}>
          Your account and downline data are stored on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={styles.link}>Supabase</a>,
          a cloud database platform. Data is protected with row-level security, meaning each user can only access their own data.
          Supabase infrastructure is hosted on AWS.
        </p>

        <h2 style={styles.h2}>4. Third-party services</h2>
        <p style={styles.p}>Netvine uses the following third-party services:</p>
        <ul style={styles.ul}>
          <li style={styles.li}><strong>Supabase</strong> — authentication and database hosting</li>
          <li style={styles.li}><strong>Paystack</strong> — payment processing for Pro subscriptions</li>
          <li style={styles.li}><strong>Vercel</strong> — web hosting and delivery</li>
        </ul>
        <p style={styles.p}>
          Each of these services has its own privacy policy. We only share the minimum data needed for each service to function
          (e.g. your email for authentication, your user ID for payment metadata).
        </p>

        <h2 style={styles.h2}>5. Data security</h2>
        <p style={styles.p}>
          We take reasonable measures to protect your data, including encrypted connections (HTTPS),
          hashed passwords, and row-level database security. However, no system is 100% secure,
          and we cannot guarantee absolute security.
        </p>

        <h2 style={styles.h2}>6. Your rights</h2>
        <p style={styles.p}><strong>Access:</strong> you can view all your data in the app at any time.</p>
        <p style={styles.p}><strong>Deletion:</strong> you can request full deletion of your account and all associated data by
          contacting <a href={`mailto:${SUPPORT_EMAIL}`} style={styles.link}>{SUPPORT_EMAIL}</a>.
          We will process deletion requests within 30 days.</p>
        <p style={styles.p}><strong>Export:</strong> you can view and copy your data directly from the app.
          If you need a full data export, contact us and we'll assist you.</p>

        <h2 style={styles.h2}>7. Cookies</h2>
        <p style={styles.p}>
          Netvine uses essential cookies and local storage only for authentication (keeping you logged in).
          We do not use tracking cookies or third-party analytics cookies.
        </p>

        <h2 style={styles.h2}>8. Children</h2>
        <p style={styles.p}>
          Netvine is not intended for children under 16. We do not knowingly collect data from children.
          If you believe a child has created an account, please contact us so we can remove it.
        </p>

        <h2 style={styles.h2}>9. Changes to this policy</h2>
        <p style={styles.p}>
          We may update this privacy policy from time to time. If we make significant changes, we'll
          notify you by email or through a notice in the app. The "last updated" date at the top will always reflect the most recent version.
        </p>

        <h2 style={styles.h2}>10. Contact</h2>
        <p style={styles.p}>
          Questions or concerns about your privacy? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`} style={styles.link}>{SUPPORT_EMAIL}</a>.
        </p>
      </article>

      <footer style={styles.footer}>
        <img src="/logo-mark.svg" alt="" style={{ height: 28, opacity: 0.4 }} />
        <div style={styles.footerLinks}>
          <span style={styles.footerActive}>Privacy Policy</span>
          <span style={styles.footerDot}>&middot;</span>
          <button style={styles.footerLink} onClick={() => onNavigate('terms')}>Terms of Service</button>
        </div>
        <div style={styles.footerText}>Netvine — grow your network.</div>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    background: C.canvas,
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    maxWidth: 1080,
    margin: '0 auto',
  },
  navRight: { display: 'flex', alignItems: 'center', gap: 10 },
  navLink: {
    background: 'none', border: 'none', color: C.muted, fontSize: 14,
    fontWeight: 600, cursor: 'pointer', fontFamily: 'system-ui, sans-serif', padding: '8px 12px',
  },
  navCta: {
    padding: '8px 18px', borderRadius: 8, border: 'none', background: C.accent,
    color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
  },
  content: {
    maxWidth: 680,
    margin: '0 auto',
    padding: '40px 20px 56px',
  },
  h1: {
    fontFamily: 'Georgia, serif',
    fontSize: 'clamp(26px, 5vw, 36px)',
    fontWeight: 700,
    color: C.ink,
    margin: 0,
    letterSpacing: -0.3,
  },
  updated: {
    fontSize: 13,
    color: C.muted,
    marginTop: 8,
    marginBottom: 32,
  },
  h2: {
    fontFamily: 'Georgia, serif',
    fontSize: 18,
    fontWeight: 700,
    color: C.ink,
    marginTop: 32,
    marginBottom: 10,
  },
  p: {
    fontSize: 15,
    lineHeight: 1.7,
    color: C.ink,
    marginTop: 0,
    marginBottom: 14,
  },
  ul: {
    paddingLeft: 20,
    marginTop: 0,
    marginBottom: 14,
  },
  li: {
    fontSize: 15,
    lineHeight: 1.7,
    color: C.ink,
    marginBottom: 6,
  },
  link: {
    color: C.accent,
    textDecoration: 'none',
    fontWeight: 600,
  },
  footer: {
    padding: '32px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
  },
  footerLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: C.accent,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
  },
  footerActive: {
    color: C.muted,
    fontSize: 13,
    fontWeight: 600,
  },
  footerDot: {
    color: C.muted,
  },
  footerText: {
    fontSize: 13,
    color: C.muted,
  },
}
