import React from 'react'
import { SUPPORT_EMAIL } from '../lib/config'
import { PLANS, FREE_MEMBER_LIMIT } from '../lib/pricing'

const C = {
  canvas: '#F4F3EE',
  ink: '#1C2B27',
  accent: '#2F7D5D',
  paper: '#FFFFFF',
  muted: '#75837D',
  soft: '#E5E8E2',
}

export default function TermsPage({ onNavigate }) {
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
        <h1 style={styles.h1}>Terms of Service</h1>
        <p style={styles.updated}>Last updated: August 8, 2026</p>

        <p style={styles.p}>
          These terms govern your use of Netvine (<a href="https://www.netvine.app" style={styles.link}>www.netvine.app</a>),
          a network marketing downline tracker operated by an individual sole proprietor based in Nigeria.
          By creating an account or using the service, you agree to these terms.
        </p>

        <h2 style={styles.h2}>1. The service</h2>
        <p style={styles.p}>
          Netvine lets you visually map, track, and manage your network marketing downline.
          You can add members, organise them in a tree structure, log interactions, and track progress — all synced to the cloud.
        </p>

        <h2 style={styles.h2}>2. Accounts</h2>
        <p style={styles.p}>
          You need an account to use Netvine. You're responsible for keeping your login credentials secure.
          One account per person — don't share your login or let others access your account.
          You must provide a valid email address and accurate information when signing up.
        </p>

        <h2 style={styles.h2}>3. Free and Pro plans</h2>
        <p style={styles.p}>
          Netvine offers a <strong>Free plan</strong> (up to {FREE_MEMBER_LIMIT} members, no time limit) and a
          paid <strong>Pro plan</strong> (unlimited members). The current Pro pricing is {PLANS.ngn_monthly.display} or {PLANS.ngn_annual.display}.
        </p>
        <p style={styles.p}>
          <strong>Founding member pricing:</strong> early subscribers receive a discounted "founding member" rate
          that stays locked in for as long as the subscription remains active. If you cancel and later resubscribe,
          the rate at the time of resubscription will apply. Regular pricing for new subscribers may increase in the future.
        </p>

        <h2 style={styles.h2}>4. Payments</h2>
        <p style={styles.p}>
          Pro subscriptions are billed through <a href="https://paystack.com" target="_blank" rel="noopener noreferrer" style={styles.link}>Paystack</a>,
          a licensed payment processor. Netvine does not store your card details — Paystack handles all payment information.
          By subscribing, you also agree to Paystack's terms of service.
        </p>
        <p style={styles.p}>
          Subscriptions renew automatically (monthly or annually, depending on your plan) until cancelled.
          You'll be charged at the start of each billing period.
        </p>

        <h2 style={styles.h2}>5. Cancellation and refunds</h2>
        <p style={styles.p}>
          You can cancel your Pro subscription at any time. After cancellation, you keep Pro access until the end of your
          current billing period, then your account reverts to the Free plan. Your data is preserved — you just can't
          add more than {FREE_MEMBER_LIMIT} members until you resubscribe.
        </p>
        <p style={styles.p}>
          Refunds are considered on a case-by-case basis. If you believe you were charged in error,
          contact us at <a href={`mailto:${SUPPORT_EMAIL}`} style={styles.link}>{SUPPORT_EMAIL}</a>.
        </p>

        <h2 style={styles.h2}>6. Your data</h2>
        <p style={styles.p}>
          You own the data you put into Netvine (member names, notes, tracking entries). We don't sell or share
          your data with third parties for marketing purposes. See our <button style={styles.inlineLink} onClick={() => onNavigate('privacy')}>Privacy Policy</button> for full details on how
          we handle your information.
        </p>
        <p style={styles.p}>
          If you delete your account, we will delete all your data from our systems upon request.
          Contact <a href={`mailto:${SUPPORT_EMAIL}`} style={styles.link}>{SUPPORT_EMAIL}</a> to request account deletion.
        </p>

        <h2 style={styles.h2}>7. Acceptable use</h2>
        <p style={styles.p}>
          Don't use Netvine to store illegal content, harass others, or attempt to disrupt the service.
          Don't try to access other users' data or reverse-engineer the platform. We reserve the right to
          suspend accounts that violate these terms.
        </p>

        <h2 style={styles.h2}>8. Availability and liability</h2>
        <p style={styles.p}>
          We aim to keep Netvine available and reliable, but we can't guarantee 100% uptime.
          The service is provided "as is" without warranties of any kind. We're not liable for any
          indirect, incidental, or consequential damages arising from your use of the service.
        </p>
        <p style={styles.p}>
          Our total liability for any claim related to the service is limited to the amount you've paid us
          in the 12 months before the claim.
        </p>

        <h2 style={styles.h2}>9. Changes to these terms</h2>
        <p style={styles.p}>
          We may update these terms from time to time. If we make significant changes, we'll notify you by
          email or through a notice in the app. Continued use after changes take effect means you accept the updated terms.
        </p>

        <h2 style={styles.h2}>10. Contact</h2>
        <p style={styles.p}>
          Questions about these terms? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`} style={styles.link}>{SUPPORT_EMAIL}</a>.
        </p>
      </article>

      <footer style={styles.footer}>
        <img src="/logo-mark.svg" alt="" style={{ height: 28, opacity: 0.4 }} />
        <div style={styles.footerLinks}>
          <button style={styles.footerLink} onClick={() => onNavigate('privacy')}>Privacy Policy</button>
          <span style={styles.footerDot}>&middot;</span>
          <span style={styles.footerActive}>Terms of Service</span>
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
  link: {
    color: C.accent,
    textDecoration: 'none',
    fontWeight: 600,
  },
  inlineLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: C.accent,
    fontSize: 'inherit',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
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
