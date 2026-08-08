# Downline Tracker — SaaS build brief

## What this is
A network marketing downline tracker. The core product already exists as a single React component in `downline-tracker.jsx` in this folder: a zoomable, pannable org chart (circles, connector lines, names, status colors) where each member has a profile page with progress status, current issue, proposed solution, and a dated tracking log.

Right now it saves data with `window.storage` (a Claude artifact API). That must be replaced with a real backend so many users can each have their own account and their own downline.

## Goal
A deployable web app where people sign up, use a free tier, and pay a monthly subscription for the full version.

## Stack
- Vite + React (reuse the existing component as the core of the app)
- Supabase: authentication (email + password, Google optional) and Postgres database
- Paystack for subscription billing (Nigerian merchant account; supports recurring plans and local + international cards)
- Deploy target: Vercel

## Data model (Supabase)
- `profiles`: id (auth uid), email, plan ('free' | 'pro'), paystack_customer_code, subscription_status, created_at
- `members`: id, user_id (owner), parent_id (nullable, null = root), name, progress, current_issue, proposed_solution, joined_date, created_at
- `tracking_entries`: id, member_id, date, text, created_at
- Row Level Security on everything: users can only read/write their own rows.

## Phases
### Phase 1 — working multi-user app
1. Scaffold Vite + React project, move `downline-tracker.jsx` in as the chart component.
2. Supabase project wiring: env vars, client, auth screens (sign up, log in, log out, password reset).
3. Replace `window.storage` persistence with Supabase reads/writes (load the user's tree on login, save on change, keep the optimistic UI).
4. On first login, auto-create the root "Me" node.

### Phase 2 — monetization
1. Free tier limit: 10 members max. Show a friendly upgrade prompt when the limit is hit.
2. Paystack: create a Plan in the Paystack dashboard, integrate checkout (Paystack Popup or redirect), and a webhook (Supabase Edge Function) that updates `profiles.plan` and `subscription_status` on `charge.success` / `subscription.disable`.
3. Gate: 'pro' plan removes the member limit.

### Phase 3 — polish and launch
1. Landing page at `/`: what it does, screenshot of the chart, pricing (Free vs Pro), "Start free" button.
2. Settings page: account email, plan, manage/cancel subscription link.
3. Deploy to Vercel, connect custom domain.

## Product rules
- Keep the existing look and interactions of the chart exactly as they are (colors, layout algorithm, zoom/pan, top action bar, profile pages).
- Mobile-first: most users will be on phones.
- Never lose user data: writes should be debounced but reliable; show the same Saving/Saved indicator.

## Later ideas (do not build yet)
- Reminders/follow-up dates per member, search, export chart as image, team sales volume fields, rank tracking, sharing a read-only chart link.
