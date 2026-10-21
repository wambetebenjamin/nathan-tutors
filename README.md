# Nathan Tutors

**The right tutor. Real results.**

A one-on-one online tutoring marketplace for Kenyan students and parents: browse
verified tutors, book a free 15 minute intro, pay per session with M-Pesa, join the
lesson by video call and read a progress note afterwards.

Built on the uploaded Colourlib tutoring template. Layout, palette, typography,
spacing and components follow the template exactly; the React application, booking
engine, dashboards and API layer are new.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.4.2 (App Router, Turbopack) |
| UI | React 19.2.0, Bootstrap 4 grid and utilities from the template, Tailwind 4 theme layer |
| Type | Raleway via `@fontsource/raleway` (offline, no Google Fonts), template icomoon and brand fonts untouched |
| Motion | framer-motion 12.18.0, GSAP 3.12.7, Lenis 1.3.4 |
| Forms and data | react-hook-form, zod, zustand |
| Auth | next-auth 5.0.0-beta.28, credentials plus optional Google |
| Charts, exports | recharts, jspdf, html2canvas, qrcode |
| Storage | Vercel KV with an in-memory fallback, Vercel Blob for CV uploads |
| Email | nodemailer over SMTP, logs a no-op notice when unconfigured |

Every dependency is pinned to an exact version. `package.json` also carries overrides
for `postcss`, `sharp`, `sprintf-js`, `motion-dom` and `motion-utils` so the tree
resolves cleanly on Vercel.

## Getting started

```bash
nvm use            # Node 24, see .nvmrc
npm ci
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

The site runs without any environment variables. Sign in with the seeded demo
accounts, which use the password `nathan2026`:

| Role | Email |
| --- | --- |
| Student | student@nathan-tutors.co.ke |
| Parent | parent@nathan-tutors.co.ke |
| Tutor | grace@nathan-tutors.co.ke |

Without `AUTH_SECRET` set, sessions fall back to the demo credential store so the flows
can be reviewed locally. Set the secret before deploying.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, subject grid, how it works, featured tutors, stats, parent call to action, testimonials |
| `/tutors` | Directory with query, subject, level, education, language, day and rate filters |
| `/tutors/[username]` | Tutor profile, credentials, bundles, reviews and a live week calendar |
| `/booking` | Six step wizard: tutor, subject and level, date and time, session type, student, contact and payment |
| `/booking-confirmation` | Reference, session summary, QR code, PDF summary, calendar link |
| `/my-sessions` | Upcoming and past sessions, receipts, reviews and progress notes |
| `/tutor/dashboard` | Earnings, sessions, availability editor and progress note writer |
| `/become-a-tutor` | Role overview, hiring steps and the CV application form |
| `/auth/signin`, `/auth/signup` | Credentials, Google and demo accounts |
| `/legal/terms`, `/legal/privacy-policy`, `/legal/cookie-policy` | Policies written for the Kenyan market |
| `not-found`, `error`, `global-error` | Branded 404 and 500 states |

## API

| Route | Method | Notes |
| --- | --- | --- |
| `/api/tutors` | GET | Filterable tutor list |
| `/api/tutors/[username]` | GET | Single profile |
| `/api/tutors/availability` | GET | Open slots for a tutor week |
| `/api/booking/create` | POST | Validates, verifies reCAPTCHA, checks the slot, mails both sides, sets the guest cookie |
| `/api/booking/[ref]` | GET | Returns a booking to its guest or signed in owner |
| `/api/booking/review` | POST | Student review after a completed session |
| `/api/tutor/apply` | POST | Multipart application, CV up to 5 MB, optional Blob upload |
| `/api/tutor/availability` | GET, POST | Tutor's weekly availability |
| `/api/tutor/progress-note` | POST | Progress note for a session |
| `/api/dashboard/tutor` | GET | Aggregated tutor dashboard payload |
| `/api/contact` | POST | Contact form |
| `/api/recaptcha/verify` | POST | Server side score check |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handlers |
| `/api/auth/register` | POST | Creates a student, parent or tutor account |

## Environment variables

Fifteen variables are supported, all documented in `.env.example`:

`NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`,
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `KV_REST_API_URL`,
`KV_REST_API_TOKEN`, `BLOB_READ_WRITE_TOKEN`.

`RECAPTCHA_SECRET_KEY` is read only in server routes. The browser receives the public
site key and nothing else.

## Consent, safety and accessibility

- Cookie banner stores the choice in `localStorage` under `nathan_tutors_consent`, with a
  granular preference dialog and a footer link to reopen it.
- reCAPTCHA v3 runs invisibly on the booking, application, contact and sign up forms. If
  the score is below 0.5 the server replies with `requiresV2` and the form renders an
  explicit v2 checkbox.
- The voice tour waits for the first scroll or click. It never autoplays, uses
  `SpeechSynthesisUtterance` at rate 0.94, pitch 1.1 and language `en-KE`, and can be
  stopped from the same button.
- The WhatsApp button sits bottom right at `z-index: 9998` and links to
  `wa.me/254112272061`.
- Every animation is disabled under `prefers-reduced-motion`, focus styles are visible,
  and forms use real labels.

## Build and verification

```bash
npm ci
npx tsc --noEmit
npm run build
npm audit --audit-level=high
```

`vercel.json` pins the deployment region to `cdg1` and sets five security headers.
`next.config.ts` keeps the default configuration and adds `images.remotePatterns` for
`images.pexels.com`.

## Photography

All images are Pexels free license photographs of East African subjects, stored in
`public/images/`. Attribution is in [image-credits.md](image-credits.md).

## Brand

Nathan Tutors, Nairobi, Kenya. WhatsApp +254 112 272 061,
hello@nathan-tutors.co.ke.
