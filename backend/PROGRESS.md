# OnePlace — Project Progress Report
> Last updated: 2026-04-22

---

## Overview

OnePlace is a community platform that lets creators build paid or free communities with a discussion feed and a built-in course classroom. The project is split into a **Node.js/Express backend** (REST API + PostgreSQL via Prisma) and a **React frontend** (Vite + TanStack Query + Tailwind CSS).

This document covers everything that has been built across both sides of the application, what is still pending, and the technical decisions made along the way.

---

## 1. Backend

### 1.1 Architecture

The backend follows a layered architecture: routes → controllers → services → database. All business logic lives in services; controllers are thin and only handle HTTP concerns. The database is PostgreSQL hosted on Neon, accessed through Prisma ORM.

```
backend/
├── prisma/
│   ├── schema.prisma          # 13 models, 11 enums
│   └── migrations/
└── src/
    ├── config/env.ts          # All environment variables in one place
    ├── database/db.ts         # Prisma client (PrismaPg + pg.Pool)
    ├── controllers/           # HTTP handlers — one file per domain
    ├── routes/                # Express routers — one file per domain
    ├── services/              # Business logic + database queries
    ├── middlewares/
    │   ├── auth.middleware.ts      # JWT authentication (protect, requireRole)
    │   ├── access.middleware.ts    # Community + course access enforcement
    │   └── error.middleware.ts     # Centralised error handler
    ├── jobs/expiry.job.ts     # Background job: subscription expiry
    ├── utils/                 # AppError, token helpers, email helpers
    └── types/                 # Express augmentation (req.user, req.communityMembership)
```

### 1.2 Data Model

| Model | Purpose |
|---|---|
| `User` | Platform accounts — email/password, role, email verification, suspension |
| `Community` | Creator-owned spaces — pricing model, platform plan, visibility |
| `CommunityPricing` | Per-community price configuration (monthly, yearly, one-time, upgrade) |
| `Membership` | User ↔ Community relationship — role, status, tier |
| `Subscription` | Payment record per membership — billing interval, dates, amount, status |
| `Post` | Community feed posts — title, content, type, category, pinned flag |
| `Comment` | Replies on posts |
| `Course` | Courses inside a community — access type, price, thumbnail, display order |
| `CoursePurchase` | Records one-time course purchases (BUY_NOW access type) |
| `Section` | Ordered groups of lessons within a course |
| `Lesson` | Individual lesson — video URL, rich text content, transcript, duration |
| `LessonAttachment` | Files or links attached to a lesson |
| `LessonProgress` | Per-user lesson completion status and video resume position |

### 1.3 API — Completed Endpoints

#### Authentication (`/api/v1/auth`)

| Method | Route | Description |
|---|---|---|
| POST | `/sign-up` | Register with email and password |
| POST | `/sign-in` | Login — issues a JWT stored in an HTTP-only cookie |
| POST | `/sign-out` | Logout — clears the auth cookie |
| POST | `/verify-email` | Confirm email address using a token sent by email |
| POST | `/forgot-password` | Request a password reset link |
| POST | `/reset-password` | Set a new password using a reset token |

#### Communities (`/api/v1/communities`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List all non-private communities |
| GET | `/:id` | Public | Community details and pricing |
| GET | `/:id/my-membership` | Required | Current user's membership in this community |
| POST | `/` | Required | Create a new community |
| PUT | `/:id` | Required | Update community name, description, or visibility |
| DELETE | `/:id` | Required | Delete a community |
| PUT | `/:id/pricing` | Required | Set pricing amounts (monthly, yearly, one-time, upgrade) |
| PUT | `/:id/pricing-model` | Required | Change the pricing model (FREE / FREEMIUM / SUBSCRIPTION / ONE_TIME) |
| POST | `/:id/join` | Required | Join a community — handles all four pricing models |
| POST | `/:id/upgrade` | Required | Upgrade a free-tier member to paid in a FREEMIUM community |
| DELETE | `/:id/leave` | Required | Leave a community and cancel subscription if applicable |
| POST | `/:id/renew` | Required | Renew a subscription |
| GET | `/:id/subscription` | Required | Own membership state and subscription details |
| GET | `/:id/analytics` | Required | Community-level analytics (creator/admin only) |

#### Community Feed (`/api/v1/communities/:communityId/posts`)

Access is limited to active members. All tiers see all posts — there is no tier gating on the feed.

| Method | Route | Description |
|---|---|---|
| GET | `/` | List posts — pinned first, then newest. Filterable by category |
| POST | `/` | Create a post (title, content, type, optional category) |
| GET | `/:postId` | Get a single post |
| DELETE | `/:postId` | Delete a post (author, creator, or admin) |
| GET | `/:postId/comments` | List all comments on a post |
| POST | `/:postId/comments` | Add a comment |
| DELETE | `/:postId/comments/:commentId` | Delete a comment (author, creator, or admin) |

#### Classroom (`/api/v1/communities/:communityId/courses`)

Course access is controlled per course by access type. Creators and admins have unrestricted access to all courses in their community regardless of access type.

**Access types:**

| Type | Behaviour |
|---|---|
| `OPEN` | All active members |
| `BUY_NOW` | Requires a one-time purchase |
| `TIME_UNLOCK` | Unlocks after a set number of days of membership |
| `PRIVATE` | Paid-tier members only (FREEMIUM communities) |
| `LEVEL_UNLOCK` | Reserved for future use |

**Course management:**

| Method | Route | Description |
|---|---|---|
| GET | `/` | List courses. Returns drafts when the requester is a creator/admin; published only for regular members |
| POST | `/` | Create a course |
| GET | `/:courseId` | Full course with sections and lessons. Returns all lessons for creators/admins, published only for members |
| PUT | `/:courseId` | Update course metadata |
| DELETE | `/:courseId` | Delete a course and all its content |
| POST | `/:courseId/purchase` | Purchase a BUY_NOW course |
| GET | `/:courseId/progress` | Returns completion percentage for the current user |

**Section management:**

| Method | Route | Description |
|---|---|---|
| POST | `/:courseId/sections` | Create a section |
| PUT | `/:courseId/sections/:sectionId` | Rename or reorder a section |
| DELETE | `/:courseId/sections/:sectionId` | Delete a section and all its lessons |

**Lesson management:**

| Method | Route | Description |
|---|---|---|
| POST | `/:courseId/sections/:sectionId/lessons` | Create a lesson |
| GET | `.../:lessonId` | Get lesson content and attachments |
| PUT | `.../:lessonId` | Update lesson content |
| DELETE | `.../:lessonId` | Delete a lesson |
| POST | `.../:lessonId/attachments` | Add a file or link attachment |
| DELETE | `.../:lessonId/attachments/:attachmentId` | Remove an attachment |
| POST | `.../:lessonId/complete` | Mark lesson as complete |
| DELETE | `.../:lessonId/complete` | Mark lesson as incomplete |
| PATCH | `.../:lessonId/progress` | Save video resume position |

#### File Uploads (`/api/v1/upload`)

| Method | Route | Description |
|---|---|---|
| POST | `/presign` | Generates a presigned upload URL for direct client-to-storage upload |

Files are never routed through the server. The client receives a presigned URL and uploads directly to S3 or Cloudflare R2. Supported file types include images (JPEG, PNG, WEBP, GIF), videos (MP4, MOV, WEBM), and documents (PDF, ZIP). Size limits are enforced: 10 MB for images, 2 GB for videos, 100 MB for documents.

#### User (`/api/v1/user`)

| Method | Route | Description |
|---|---|---|
| GET | `/me` | Get own profile |
| PUT | `/me` | Update display name or password |
| GET | `/me/communities` | List communities the user is an active member of |

#### Membership (`/api/v1/membership`)

| Method | Route | Description |
|---|---|---|
| GET | `/me` | All own memberships with subscription info |
| GET | `/upcoming` | Subscriptions expiring within 7 days |
| GET | `/community/:communityId` | All members in a community (creator/admin only) |
| GET | `/community/:communityId/export` | Export member list as CSV |
| PUT | `/community/:communityId/members/:userId/ban` | Ban a member |
| PUT | `/community/:communityId/members/:userId/unban` | Reinstate a banned member |
| PUT | `/community/:communityId/members/:userId/role` | Promote or demote a member |
| GET | `/:id` | Get a single membership record |

#### Admin (`/api/v1/admin`)

Restricted to users with the `moderator` platform role.

| Method | Route | Description |
|---|---|---|
| GET | `/users` | List all platform users |
| GET | `/communities` | List all communities |
| PUT | `/users/:id/suspend` | Suspend a user account |
| PUT | `/users/:id/unsuspend` | Reinstate a suspended account |
| GET | `/analytics` | Platform-wide analytics |

#### Analytics

**Community level** (`GET /communities/:id/analytics`):
- Member stats: total, active, by status, by tier, new this month, 6-month growth trend
- Revenue stats: total, this month, last 6 months, broken down by billing interval

**Platform level** (`GET /admin/analytics`):
- User stats: total, verified, suspended, new this month, 6-month growth trend
- Community stats: total, active, new this month, 6-month growth trend
- Revenue stats: total, this month, last 6 months, by billing interval

#### Email Notifications

| Trigger | Email |
|---|---|
| New registration | Email verification link |
| Email verified | Welcome message |
| Forgot password | Password reset link |
| Join / upgrade / renew | Payment confirmation |
| ~3 days before expiry | Subscription renewal reminder |

#### Background Jobs

A subscription expiry job runs on startup and every 60 minutes. It marks memberships as `EXPIRED` when their subscription end date has passed and sends a one-time reminder email approximately 3 days before expiry.

#### Payment Service

A mock payment service is in place with the same interface that a real Stripe integration would use. Swapping in Stripe requires replacing only the service internals — no route or schema changes are needed.

### 1.4 Tests

101 tests — all passing.

| File | Tests |
|---|---|
| `auth.service.test.ts` | 17 |
| `community.service.test.ts` | 28 |
| `user.service.test.ts` | 10 |
| `membership.service.test.ts` | 16 |
| `post.service.test.ts` | 15 |
| `admin.service.test.ts` | 6 |
| `analytics.service.test.ts` | 8 |
| `course.service.test.ts` | Pending |

### 1.5 Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `JWT_SECRET` | JWT signing secret — required in production |
| `JWT_EXPIRES_IN` | Token lifetime (default: `7d`) |
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | `development` or `production` |
| `EMAIL_HOST` | SMTP host |
| `EMAIL_PORT` | SMTP port |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `EMAIL_FROM` | From address for outgoing emails |
| `CLIENT_URL` | Frontend URL used in email links |
| `S3_REGION` | AWS region or `auto` for Cloudflare R2 |
| `S3_BUCKET` | Storage bucket name |
| `S3_ACCESS_KEY_ID` | Access key |
| `S3_SECRET_ACCESS_KEY` | Secret key |
| `S3_ENDPOINT` | Required for Cloudflare R2 (`https://<account-id>.r2.cloudflarestorage.com`) |
| `S3_CDN_URL` | Optional CDN base URL (CloudFront or R2 custom domain) |

---

## 2. Frontend

### 2.1 Architecture

The frontend is a React SPA built with Vite. API state is managed by TanStack Query (caching, background refetching, mutations). Global auth state is held in Zustand. Routing is handled by React Router v7. All UI is built with Tailwind CSS and Radix UI primitives.

```
frontend/src/
├── api/              # One file per domain — all axios calls live here
├── components/
│   ├── shared/       # AuthGuard, PublicNav
│   └── ui/           # Radix UI wrappers (Button, Dialog, Input, etc.)
├── features/
│   └── community/
│       ├── components/   # Layout, modals, guards, panels
│       └── pages/        # One file per route
├── routes/index.tsx  # Full routing tree
├── store/auth.store.ts
└── types/            # TypeScript interfaces for all API responses
```

### 2.2 Features — Completed

#### Authentication (Priority 1)

All auth flows are fully implemented end to end:

- **Register** (`/sign-up`) — email and password form, redirects to a "check your email" confirmation page on success
- **Login** (`/sign-in`) — email and password, redirects to `/communities` on success
- **Email verification** (`/verify-email?token=`) — auto-submits the token on page load
- **Forgot password** (`/forgot-password`) — sends a reset link to the user's email
- **Reset password** (`/reset-password?token=`) — accepts a new password using the token from the email link
- **Logout** — available from the top navigation; clears local state and redirects to sign-in

#### Community Discovery (Priority 2)

- **Explore page** (`/communities`) — public grid of all non-private communities showing name, description, pricing model, and member count
- **Community about page** (`/communities/:id/about`) — public-facing page with community details, stats, pricing breakdown, and join / upgrade actions

#### Community Shell (Priority 3)

- **Community layout** — persistent shell wrapping all community tabs. Includes a top navigation bar with tab links (Community, Classroom, Members, About, Settings for creators) and a collapsible sidebar showing community info, member stats, and join/upgrade buttons. The sidebar is hidden on Classroom routes to give course content more space.
- **Join flow modal** — opens from the sidebar or About page. Adapts to the community's pricing model: FREE and FREEMIUM communities show a single confirm button; SUBSCRIPTION communities show a monthly/yearly plan picker with savings calculation; ONE_TIME communities show the one-time price. On success the user is taken directly to the Community feed.
- **Upgrade modal** — shown to free-tier members in FREEMIUM communities. Displays the one-time upgrade price. On success the user is taken to the Classroom.
- **Access guard** — unauthenticated users are redirected to sign-in. Authenticated users who are not active members of a community are redirected to the About tab instead of the protected tabs.

#### Community Feed (Priority 4)

- **Feed page** (`/communities/:id/community`) — paginated post list with pinned posts first, then newest. Category filter tabs at the top.
- **Post detail** (`/communities/:id/community/posts/:postId`) — full post content with a threaded comment section below
- **Create post modal** — title, body, post type (TEXT / IMAGE / VIDEO), and optional category selector
- **Comments** — inline comment input at the bottom of the post detail page
- **Delete actions** — authors, creators, and admins can delete any post or comment

#### Classroom — Member View (Priority 5)

- **Classroom home** (`/communities/:id/classroom`) — course grid with thumbnail, title, access type badge, and per-user progress bar
- **Course page** (`/communities/:id/classroom/:courseId`) — two-column layout with a section/lesson sidebar on the left and lesson content on the right. Includes a progress bar in the header.
- **Lesson view** — video player area (URL-based embed), rich text content body, collapsible transcript, downloadable attachments list, and a mark-complete button
- **Course locked screen** — shown when a 403 is returned. The message and call-to-action adapt per access type: BUY_NOW shows the price and a purchase button, TIME_UNLOCK shows the unlock date, PRIVATE shows an upgrade prompt.
- **Purchase course modal** — confirms and processes a BUY_NOW course purchase

#### Creator: Community Setup (Priority 6)

- **Create community** (`/communities/new`) — name, description, and platform plan selection
- **General settings** (`/communities/:id/settings/general`) — edit name, description, and visibility
- **Pricing settings** (`/communities/:id/settings/pricing`) — pricing model selector and individual price inputs (monthly, yearly, one-time, upgrade)
- **Member management** (`/communities/:id/settings/members`) — full members table with subscription status, tier, and expiry. Actions: ban, unban, promote to admin, demote to member, export full list as CSV.

#### Creator: Course Builder (Priority 7)

- **Course builder home** (`/communities/:id/classroom/manage`) — table of all courses including drafts, with status (Published / Draft), access type badge, and section count. Create, edit, and delete actions. Only visible and accessible to the community creator and admins.
- **Add / edit course modal** — title, description, access type selector (OPEN / BUY_NOW / TIME_UNLOCK / PRIVATE), conditional price or unlock-days input, thumbnail upload to S3/R2 or paste-a-URL fallback, and a published toggle.
- **Course content editor** (`/communities/:id/classroom/manage/:courseId`) — two-column layout. Left column shows an accordion of sections with their lessons (Live / Draft badge per lesson). Right column shows the lesson editor panel when a lesson is selected.
- **Section modal** — single title input for creating or renaming a section.
- **Lesson editor panel** — video URL, content body (textarea), transcript, duration in minutes, published toggle, and a resource links manager (add / remove named links).

### 2.3 Pending

| Priority | Feature |
|---|---|
| 8 | User profile page — edit display name and password |
| 8 | My communities page — joined communities with membership status and expiry |
| 8 | Subscription management — view status, renew, and leave community |
| 9 | Community analytics page — member growth chart, revenue chart, summary cards |
| 10 | Admin panel — users table, communities table, platform analytics, suspend/unsuspend actions |

---

## 3. What Is Not Started Yet

| Item | Notes |
|---|---|
| Stripe integration | Deferred — mock payment service is in place as a drop-in replacement |
| Coupon / discount system | Depends on Stripe |
| Affiliate program payouts | Depends on Stripe |
| Course service tests | Backend unit tests for course and upload services |
| Rich text lesson editor | Currently a plain textarea; a full editor (e.g. Tiptap) is planned |
| File upload for lesson videos | Currently URL-based only; direct upload via presign is planned |
| Mobile / PWA | Not started |
