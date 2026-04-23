# OnePlace — To-Do List

> Track progress here. Update task status as you go: `[ ]` = todo, `[x]` = done, `[-]` = in progress.

---

## V0 — Proof of concept ✅ COMPLETE

> Goal: make the core loop work end-to-end.
> `Create Community → User Pays → Access Granted → Engagement → Creator Earns`

### Auth
- [x] Register endpoint (email + password)
- [x] Login endpoint + JWT cookie
- [x] Logout endpoint (clear cookie)
- [x] Email verification flow
- [x] Password reset flow
- [x] Auth middleware (protect routes)
- [x] Role middleware (platform: `requireRole`; community-level: inline service checks)

### Community
- [x] Create community endpoint (auto-creates creator membership in same Prisma call)
- [x] Public community page (list + get by id, with pricing config)
- [x] Update / delete community endpoint
- [x] Pricing configuration endpoint (`PUT /:id/pricing` — upserts CommunityPricing)
- [x] Change pricing model (`PUT /:id/pricing-model` — cancels active subs when leaving SUBSCRIPTION)

### Payment & access
- [x] Mock payment service (createSubscription, createPaymentIntent, cancelSubscription)
- [x] Join community — handles FREE, FREEMIUM, SUBSCRIPTION, ONE_TIME pricing models
- [x] Upgrade freemium member (FREE tier → PAID via one-time payment)
- [x] Leave community (cancels subscription if applicable, sets membership CANCELLED)
- [x] Renew subscription (early or expired, preserves remaining days)
- [x] `checkCommunityAccess` middleware (validates membership + subscription state per pricing model)

### Feed
- [x] Post model: title, content, type (TEXT/IMAGE/VIDEO), category, isPinned
- [x] Create / read / delete posts (author + moderator delete)
- [x] Create / read / delete comments (author + moderator delete)
- [x] Feed ordered by pinned first, then newest
- [x] Non-members can only see the About page — feed requires active membership

### Admin panel (basic)
- [x] List all users
- [x] List all communities
- [x] Suspend / unsuspend a user

### Expiry
- [x] Subscription expiry job (hourly cron — marks EXPIRED memberships for SUBSCRIPTION communities)

---

## V1 — Business-ready ✅ COMPLETE (Stripe deferred)

> Goal: make creators actually use it.

### Stripe (deferred — mock interface is drop-in ready)
- [ ] Replace mock payment service with real Stripe SDK calls (`payment.service.ts` internals only — interface stays the same)
- [ ] Stripe checkout session endpoint
- [ ] Stripe webhook handler (payment success / failed)
- [ ] Cancel subscription endpoint (separate from leave — for billing cancellation without leaving)
- [ ] Note: `Subscription.externalId` is the field that will store `stripeSubscriptionId` — column already exists

### Member management
- [x] Ban / unban member from community
- [x] List members with status + subscription info
- [x] Export members as CSV
- [x] Community admin promotion/demotion

### Email notifications
- [x] Welcome email on signup (sent after email verification)
- [x] Payment confirmation email (sent after join, upgrade, and renewal payments)
- [x] Subscription expiry reminder email (sent ~3 days before expiry via expiry job)

### Code quality
- [x] 101 tests passing (auth, community, user, membership, admin, post services)

---

## V2 — Scale (in progress)

> Goal: grow and optimize.

### Analytics
- [x] Community analytics (members, revenue, growth)
- [x] Platform analytics (users, communities, revenue)

### Multi-community
- [x] Multiple communities per creator

### Classroom ✅ COMPLETE
- [x] Course model: title, description, thumbnail, accessType, unlockAfterDays, price, order, isPublished
- [x] Access types: OPEN, BUY_NOW, TIME_UNLOCK, PRIVATE, LEVEL_UNLOCK
- [x] Section model: groups lessons inside a course (e.g. Mindset, Training, Diet & Recovery)
- [x] Lesson model: title, description, videoUrl (embed or direct upload), content (rich text), transcript, duration, order, isPublished
- [x] Lesson attachments: IMAGE, PDF, FILE, LINK (resource links + downloadable files per lesson)
- [x] Lesson progress: completedAt + videoPosition (resume playback)
- [x] Course progress endpoint: returns totalLessons, completedCount, percentage (for progress bar)
- [x] `checkCourseAccess` middleware: enforces access type per course (BUY_NOW checks purchase record, TIME_UNLOCK checks days since join, PRIVATE requires paid tier)
- [x] CoursePurchase model: tracks individual BUY_NOW purchases per user per course
- [x] Mark lesson complete / incomplete
- [x] Save video position (resume)

### File uploads
- [x] Presigned upload endpoint (`POST /api/v1/upload/presign`)
- [x] Frontend uploads directly to S3 / Cloudflare R2 — files never pass through the server
- [x] Supported types: images, videos (mp4/mov/webm), PDF, files
- [x] Used for: course covers, lesson videos, lesson attachments, post images/videos
- [x] CDN URL support (CloudFront or R2 custom domain via `S3_CDN_URL`)

### Pending V2
- [ ] Coupon / discount system (deferred — needs Stripe)
- [ ] Affiliate program (tracking doable now; payouts need Stripe)
- [ ] Mobile PWA support
- [ ] UI/UX polish pass

---

## Notes

- V0 and V1 (non-Stripe) are complete. V2 classroom + file uploads done. 101 tests passing.
- Stripe is the only remaining V1 item. The mock payment service has the right interface — replacing it is internals-only with no route or schema changes needed.
- `Subscription.externalId` is Stripe-ready — it will store `stripeSubscriptionId` when Stripe is integrated.
- Two main pages per community: **Feed** (forum, free for all members) and **Classroom** (courses, access controlled per course).
- File uploads use presigned URLs — configure `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_CDN_URL` in `.env`.
