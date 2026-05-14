# OnePlace — Todo List

---

## 1. File Upload
**Status:** Not started

Files and images can't be uploaded anywhere in the app right now. The S3/R2 config exists in the backend env but the upload flow is incomplete or broken.

### Scope
- Post attachments (images, videos, files in CreatePostModal)
- Lesson attachments in CourseEditor (LessonPanel)
- Community cover & icon upload (community settings)
- User avatar upload (profile/account settings)

### Stack decision needed
- Backend already has `@aws-sdk/client-s3` + `S3_*` env vars configured — likely targeting Cloudflare R2 (S3-compatible)
- Need to wire up `upload.service.ts` to return presigned URLs
- Frontend uploads directly to R2 (presigned PUT), backend just generates the URL

---

## 2. Calls (1:1 and Group)
**Status:** Not started

Real-time video/audio calls between creator and members, and group calls for the whole community.

### Scope
- 1:1 call: creator ↔ single member
- Group call: creator broadcasts to all members (or any member joins)
- Call scheduling / link sharing (tie into the existing Events system)
- In-app call UI (join/leave, mute, camera toggle)

### Stack decision needed
- **Daily.co** — simplest embed, free tier generous, good for MVP
- **Livekit** — open-source, self-hostable, more control
- **Agora** — battle-tested, good free tier, more complex SDK
- Recommendation: Daily.co for speed, Livekit if self-hosting matters

---

## 3. Third-Party Mailer Integration
**Status:** Partial (Nodemailer with SMTP configured, but no real provider wired)

The backend has `nodemailer` + `EMAIL_*` env vars. It works with raw SMTP but needs a proper deliverability provider.

### Scope
- Transactional emails: verification, password reset, expiry reminders (already coded, just needs real SMTP)
- Marketing/broadcast emails: new course published, community announcements
- Email templates: proper HTML design, not plain text

### Stack decision needed
- **Resend** — modern, great DX, generous free tier (3k emails/month), recommended
- **SendGrid** — industry standard, more complex
- **Postmark** — best deliverability for transactional
- Recommendation: Resend for transactional (drop-in with Nodemailer), SendGrid for marketing blasts

---

## 4. Payment Gateway
**Status:** Not started

The pricing models (SUBSCRIPTION, ONE_TIME, BUY_NOW courses) are fully modelled in the DB and the backend has placeholder endpoints, but no real payment processor is connected.

### Scope
- Community subscriptions (monthly/yearly)
- One-time community access payments
- Course purchases (BUY_NOW access type)
- Webhooks for payment confirmation → activate membership
- Billing portal (cancel, upgrade, invoice history)

### Stack decision needed
- **Stripe** — standard choice, excellent docs, handles subscriptions + one-time + webhooks
- **Paddle** — handles VAT/tax automatically (good for EU), simpler but less flexible
- Recommendation: Stripe — the existing schema maps cleanly to Stripe Customers + Subscriptions + PaymentIntents

---

*Last updated: 2026-05-05*
