# OnePlace — Full Project Report

> Generated: 2026-05-01  
> Last Updated: 2026-05-01  
> Author: Bilel Jabrane  
> Branch: main  
> Stack: React 18 + Node.js/Express 5 + PostgreSQL/Prisma + AWS S3/Cloudflare R2

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Directory Structure](#3-directory-structure)
4. [Tech Stack](#4-tech-stack)
5. [Environment Setup](#5-environment-setup)
6. [Database Schema](#6-database-schema)
7. [API Routes Reference](#7-api-routes-reference)
8. [Authentication Flow](#8-authentication-flow)
9. [Access Control System](#9-access-control-system)
10. [Implemented Features](#10-implemented-features)
11. [Frontend Pages & Components](#11-frontend-pages--components)
12. [Frontend API Layer](#12-frontend-api-layer)
13. [File Upload Architecture](#13-file-upload-architecture)
14. [Payment System](#14-payment-system)
15. [Background Jobs](#15-background-jobs)
16. [Middleware Stack](#16-middleware-stack)
17. [Known Issues & Limitations](#17-known-issues--limitations)
18. [TODOs & Future Work](#18-todos--future-work)
19. [Scrum Sprint Summary](#19-scrum-sprint-summary)
20. [UML Diagrams](#20-uml-diagrams)

---

## 1. Project Overview

**OnePlace** is a multi-tenant SaaS platform that allows creators to build private or public communities with integrated education (courses), social feeds, events, and monetization — all in a single product.

### Problem Statement

Creators who want to run both a learning community and a paid membership currently need to stitch together multiple tools (e.g., Discord + Teachable + Patreon). OnePlace consolidates these into one product with:

- A community social feed (posts, comments, pinning)
- A structured course platform (sections, lessons, video, attachments)
- Flexible pricing models (Free, Freemium, Subscription, One-Time)
- Creator analytics and member management
- A calendar & events system
- A gamification system (XP, levels, leaderboards)
- In-app notifications
- A platform-level admin panel

### Design Philosophy

- Multi-tenancy by `communityId` — each community is fully isolated
- Creators own their community; platform admin oversees the whole instance
- Payment is pluggable — mock provider in V0, ready for Stripe in V1
- Files never pass through the server — direct-to-S3/R2 via presigned URLs
- JWT in httpOnly cookies — no localStorage tokens
- Side-effects (notifications, XP) are fire-and-forget — never block the main request

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                        Browser (SPA)                     │
│   React 18 + Vite + TailwindCSS + React Query + Zustand  │
└──────────────────┬──────────────────────┬────────────────┘
                   │ REST (JSON)           │ Presigned PUT
                   ▼                       ▼
┌────────────────────────┐     ┌─────────────────────────┐
│  Express 5 REST API    │     │   AWS S3 / Cloudflare R2 │
│  Node.js + TypeScript  │     │   (media storage / CDN)  │
│  Prisma ORM            │     └─────────────────────────┘
│  JWT cookies           │
│  Nodemailer            │
│  Hourly expiry job     │
└──────────┬─────────────┘
           │ Prisma
           ▼
┌────────────────────────┐
│  PostgreSQL (Neon)     │
│  16 models, 13 enums   │
└────────────────────────┘
```

### Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Database | PostgreSQL + Prisma | Relational integrity for memberships/subscriptions. Migrated from MongoDB (V0 → V1) |
| Auth | JWT in httpOnly cookie | XSS-resistant; no localStorage token exposure |
| File storage | Presigned URL (direct-to-S3) | Server never handles binary data; scales without backend bottleneck |
| Payment | Mock provider (V0) | Defer Stripe until real billing is needed; service layer is unchanged on swap |
| State management | React Query + Zustand | React Query for server state; Zustand only for auth/global UI state |
| Email | Nodemailer + Mailtrap | Dev sandbox with zero config; swap SMTP host for production |
| Routing | React Router v7 | File-based routing pattern with typed params |
| Side-effects | Fire-and-forget async | Notifications and XP awards never block the primary operation |

---

## 3. Directory Structure

```
OnePlace/
├── backend/
│   ├── .env                              # Production environment variables
│   ├── .env.development.local            # Development environment variables
│   ├── .env.production.local             # Production environment variables
│   ├── package.json                      # Backend dependencies and scripts
│   ├── tsconfig.json                     # TypeScript config (nodenext, strict)
│   ├── eslint.config.ts                  # ESLint 9 flat config
│   ├── prisma/
│   │   ├── schema.prisma                 # All 16 models, 13 enums, relations
│   │   └── migrations/                   # Migration history
│   └── src/
│       ├── index.ts                      # Express app bootstrap, middleware, routes
│       ├── config/
│       │   └── env.ts                    # Typed env variable parser/validator
│       ├── database/
│       │   └── db.ts                     # Prisma Client singleton
│       ├── types/
│       │   └── auth.types.ts             # Express Request extension (req.user)
│       ├── utils/
│       │   ├── AppError.ts               # Custom error class with HTTP status codes
│       │   ├── token.utils.ts            # JWT sign/verify helpers
│       │   └── email.utils.ts            # Nodemailer wrapper (sendEmail)
│       ├── jobs/
│       │   └── expiry.job.ts             # Hourly subscription expiry + in-app notifications
│       ├── controllers/
│       │   ├── auth.controller.ts        # signUp, signIn, signOut, verifyEmail, forgotPassword, resetPassword
│       │   ├── user.controller.ts        # getMe, updateMe, getMyCommunities
│       │   ├── community.controller.ts   # community CRUD, pricing, join, upgrade, leave, renew
│       │   ├── post.controller.ts        # posts and comments CRUD
│       │   ├── course.controller.ts      # courses, sections, lessons, attachments, progress
│       │   ├── membership.controller.ts  # member listing, ban/unban, role, CSV export
│       │   ├── admin.controller.ts       # platform user/community listing, suspend/unsuspend
│       │   ├── analytics.controller.ts   # community analytics, platform analytics
│       │   ├── upload.controller.ts      # presign S3/R2 URL
│       │   ├── notification.controller.ts # list, unread count, mark read, mark all read
│       │   ├── event.controller.ts       # list events, create event, delete event
│       │   └── leaderboard.controller.ts # community leaderboard + user stats
│       ├── services/
│       │   ├── auth.service.ts           # Registration, login, email verification, password reset
│       │   ├── user.service.ts           # Profile management, user community list
│       │   ├── community.service.ts      # Community CRUD, pricing, membership operations
│       │   ├── post.service.ts           # Post/comment CRUD + XP + notifications
│       │   ├── course.service.ts         # Course management, access gating, progress + XP
│       │   ├── membership.service.ts     # Ban/unban, role assignment, CSV export
│       │   ├── admin.service.ts          # Platform admin operations
│       │   ├── analytics.service.ts      # Member/revenue aggregate queries
│       │   ├── payment.service.ts        # Mock payment provider (Stripe placeholder)
│       │   ├── notification.service.ts   # createNotification, list, unread count, mark read
│       │   ├── event.service.ts          # listEvents, createEvent, deleteEvent
│       │   └── points.service.ts         # addPoints, getUserStats, getLeaderboard, computeLevel
│       ├── routes/
│       │   ├── auth.routes.ts            # /api/v1/auth/*
│       │   ├── user.routes.ts            # /api/v1/user/*
│       │   ├── community.routes.ts       # /api/v1/communities/* (includes leaderboard + events)
│       │   ├── course.routes.ts          # /api/v1/communities/:id/courses/*
│       │   ├── membership.route.ts       # /api/v1/membership/*
│       │   ├── admin.routes.ts           # /api/v1/admin/*
│       │   ├── upload.routes.ts          # /api/v1/upload/*
│       │   ├── notification.routes.ts    # /api/v1/notifications/*
│       │   └── event.routes.ts           # /api/v1/communities/:id/events/*
│       └── middlewares/
│           ├── auth.middleware.ts        # protect, requireRole, requireCommunityRole
│           ├── access.middleware.ts      # checkCommunityAccess, checkCourseAccess
│           └── error.middleware.ts       # Global error handler (Prisma + AppError mapping)
│
└── frontend/
    ├── package.json                      # Frontend dependencies and scripts
    ├── vite.config.ts                    # Vite config with @ alias
    ├── tailwind.config.ts                # Dark theme (purple primary, amber accent)
    ├── tsconfig.json                     # TypeScript strict config
    ├── .env.example                      # Environment template
    ├── .env.local                        # Local dev environment
    ├── index.html                        # HTML entry point
    └── src/
        ├── main.tsx                      # React app entry, QueryClientProvider, Router
        ├── App.tsx                       # Root component with route definitions
        ├── index.css                     # Tailwind base + global styles
        ├── api/
        │   ├── client.ts                 # Axios instance (base URL, credentials, interceptors)
        │   ├── auth.ts                   # signUp, signIn, signOut, verifyEmail, forgotPassword, resetPassword, me
        │   ├── community.ts              # community CRUD, pricing, join, upgrade, subscribe, analytics
        │   ├── post.ts                   # post/comment CRUD
        │   ├── course.ts                 # course/section/lesson/attachment CRUD, progress
        │   ├── membership.ts             # member management, ban/unban, role, CSV export
        │   ├── user.ts                   # profile operations
        │   ├── admin.ts                  # admin panel API calls
        │   ├── upload.ts                 # presign + direct S3 upload helper
        │   ├── notification.ts           # list, unreadCount, markAsRead, markAllAsRead
        │   ├── event.ts                  # list, create, delete events
        │   └── leaderboard.ts            # get community leaderboard
        ├── types/
        │   ├── auth.ts                   # User, SignUpPayload, SignInPayload, ApiResponse<T>
        │   ├── community.ts              # Community, Membership, Pricing, Analytics types
        │   ├── post.ts                   # Post, Comment types
        │   ├── course.ts                 # Course, Section, Lesson, Attachment, Progress types
        │   ├── membership.ts             # Membership, Member types
        │   ├── admin.ts                  # AdminUser, AdminCommunity, PlatformAnalytics
        │   ├── notification.ts           # Notification, NotificationType
        │   ├── event.ts                  # CommunityEvent, EventAccess, CreateEventPayload
        │   └── leaderboard.ts            # LeaderboardEntry, LevelDistribution, UserStats, LeaderboardData
        ├── components/
        │   ├── shared/
        │   │   ├── PublicNav.tsx         # Navigation bar for public/unauthenticated pages
        │   │   ├── TiptapEditor.tsx      # Rich text editor (TipTap)
        │   │   ├── FileUploader.tsx      # File upload component (drag-drop + presign)
        │   │   └── NotificationBell.tsx  # Bell icon + unread badge + dropdown panel
        │   └── ui/
        │       ├── confirm-modal.tsx     # Generic confirmation dialog
        │       ├── popover.tsx           # Radix Popover wrapper
        │       └── [shadcn components]   # Button, Dialog, Dropdown, Avatar, Badge, etc.
        ├── features/
        │   ├── auth/
        │   │   ├── pages/
        │   │   │   ├── SignUp.tsx
        │   │   │   ├── SignIn.tsx
        │   │   │   ├── VerifyEmail.tsx
        │   │   │   ├── ForgotPassword.tsx
        │   │   │   └── ResetPassword.tsx
        │   │   └── components/
        │   │       └── AuthLayout.tsx    # Centered auth card wrapper
        │   ├── community/
        │   │   ├── pages/
        │   │   │   ├── Discover.tsx          # Browse public communities
        │   │   │   ├── CommunityAbout.tsx    # Full-page about for non-members
        │   │   │   ├── CommunityAboutTab.tsx # About tab inside community
        │   │   │   ├── CreateCommunity.tsx   # Community creation form
        │   │   │   ├── Feed.tsx              # Community social feed
        │   │   │   ├── PostDetail.tsx        # Single post + comments
        │   │   │   ├── Classroom.tsx         # Course listing
        │   │   │   ├── CoursePage.tsx        # Course viewer (sections + lessons)
        │   │   │   ├── CourseEditor.tsx      # Lesson content editor
        │   │   │   ├── CourseBuilder.tsx     # Course management dashboard
        │   │   │   ├── AnalyticsPage.tsx     # Creator analytics
        │   │   │   ├── SettingsGeneral.tsx   # Community settings (name, desc, cover)
        │   │   │   ├── SettingsPricing.tsx   # Pricing model + price configuration
        │   │   │   ├── SettingsMembers.tsx   # Member management (roles, ban, export)
        │   │   │   ├── SubscriptionPage.tsx  # Member's subscription status + renew
        │   │   │   ├── CalendarPage.tsx      # Monthly calendar grid + list view + events
        │   │   │   └── LeaderboardPage.tsx   # XP levels, level grid, 3 leaderboard boards
        │   │   └── components/
        │   │       ├── CommunityLayout.tsx   # Shell with tabs (Community, Classroom, Calendar, Members, Leaderboards, About)
        │   │       ├── CommunityCard.tsx     # Community preview card
        │   │       ├── MemberGuard.tsx       # Redirect non-members to About tab
        │   │       ├── JoinModal.tsx         # Join workflow by pricing model
        │   │       ├── UpgradeModal.tsx      # Freemium FREE → PAID upgrade
        │   │       ├── CreatePostModal.tsx   # Post creation (title, content, type, category)
        │   │       ├── CourseFormModal.tsx   # Add/edit courses
        │   │       ├── SectionModal.tsx      # Add/edit sections
        │   │       ├── LessonPanel.tsx       # Lesson editor + viewer
        │   │       ├── PurchaseCourseModal.tsx # BUY_NOW purchase confirmation
        │   │       ├── AddEventModal.tsx     # Add event form (date, time, duration, timezone, access, cover)
        │   │       └── SettingsLayout.tsx    # Settings page sidebar wrapper
        │   ├── profile/
        │   │   └── pages/
        │   │       ├── ProfilePage.tsx       # User profile + password change
        │   │       └── MyCommunitiesPage.tsx # Joined communities with status/tier/expiry
        │   └── admin/
        │       ├── pages/
        │       │   ├── AdminUsersPage.tsx        # Users table + suspend/unsuspend
        │       │   ├── AdminCommunitiesPage.tsx  # Communities listing
        │       │   └── AdminAnalyticsPage.tsx    # Platform-wide analytics
        │       └── components/
        │           └── AdminLayout.tsx           # Admin sidebar navigation
        ├── store/                            # Zustand stores (auth state, UI)
        ├── routes/
        │   └── index.tsx                     # React Router route definitions
        ├── lib/                              # Utility functions (cn, formatters)
        └── mocks/
            └── communities.mock.ts           # Mock data for development/testing
```

---

## 4. Tech Stack

### Backend

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 18+ |
| Framework | Express | 5.2.1 |
| Language | TypeScript | 5.9.3 |
| ORM | Prisma | 7.4.0 |
| Database | PostgreSQL (Neon) | — |
| Auth | jsonwebtoken + bcryptjs | 9.0.3 / 3.0.3 |
| Cookie parsing | cookie-parser | 1.4.7 |
| CORS | cors | 2.8.6 |
| File storage | @aws-sdk/client-s3 + presigner | 3.x |
| Email | nodemailer | 8.0.5 |
| Testing | vitest | 4.1.4 |
| Linter | eslint + typescript-eslint | 9.x |

### Frontend

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 18.3.1 |
| Build tool | Vite | 4.5.5 |
| Language | TypeScript | 5.7.2 |
| Routing | React Router DOM | 7.5.1 |
| Server state | @tanstack/react-query | 5.62.16 |
| Client state | Zustand | 5.0.3 |
| HTTP client | Axios | 1.8.4 |
| Forms | React Hook Form + Zod | 7.54.2 / 3.24.2 |
| UI components | Radix UI (headless) | various |
| Styling | Tailwind CSS | 3.4.17 |
| Rich text | TipTap | various |
| Toasts | Sonner | 2.0.1 |
| Icons | Lucide React | 0.475.0 |
| Date utilities | date-fns | 4.1.0 |

---

## 5. Environment Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- AWS S3 bucket or Cloudflare R2 bucket
- Mailtrap account (or SMTP server for development)

### Backend Setup

```bash
cd backend
npm install
cp .env.development.local.example .env.development.local
# Fill in variables (see below)
npx prisma db push
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Set VITE_API_URL
npm run dev
```

### Backend Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `EMAIL_HOST` | SMTP host | — |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | — |
| `EMAIL_PASS` | SMTP password | — |
| `EMAIL_FROM` | From address | `noreply@oneplace.app` |
| `CLIENT_URL` | Frontend URL (for email links) | `http://localhost:3000` |
| `S3_REGION` | AWS region or `auto` for R2 | — |
| `S3_BUCKET` | Bucket name | — |
| `S3_ACCESS_KEY_ID` | AWS/R2 access key | — |
| `S3_SECRET_ACCESS_KEY` | AWS/R2 secret | — |
| `S3_ENDPOINT` | R2 endpoint (empty for AWS) | — |
| `S3_CDN_URL` | CDN URL for public files | — |

### Frontend Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

---

## 6. Database Schema

### Entity Relationship Summary

```
User ──< Membership >── Community
              │               │
              │          CommunityPricing (1:1)
              │
         Subscription (per Membership)

Community ──< Post ──< Comment
Community ──< Course ──< Section ──< Lesson ──< LessonAttachment
                                         │
                               LessonProgress (User × Lesson)

User ──< CoursePurchase >── Course
User ──< Notification
User ──< UserPoints >── Community
Community ──< Event
```

### Models

#### User
```prisma
model User {
  id                          String    @id @default(uuid())
  firstname                   String
  lastname                    String
  email                       String    @unique
  password                    String                     // bcrypt hash
  role                        UserRole  @default(user)
  isSuspended                 Boolean   @default(false)
  isVerified                  Boolean   @default(false)
  lastLogin                   DateTime?
  resetPasswordToken          String?
  resetPasswordExpiresAt      DateTime?
  verificationToken           String?
  verificationTokenExpiresAt  DateTime?
  createdAt                   DateTime  @default(now())
  updatedAt                   DateTime  @updatedAt
}
```

#### Community
```prisma
model Community {
  id            String        @id @default(uuid())
  name          String
  description   String?
  coverUrl      String?
  iconUrl       String?
  creatorId     String
  isPrivate     Boolean       @default(false)
  platformPlan  PlatformPlan  @default(BASIC)
  pricingModel  PricingModel  @default(FREE)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}
```

#### CommunityPricing
```prisma
model CommunityPricing {
  id            String    @id @default(uuid())
  communityId   String    @unique
  currency      String    @default("USD")
  monthlyPrice  Decimal?
  yearlyPrice   Decimal?
  oneTimePrice  Decimal?
  upgradePrice  Decimal?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### Membership
```prisma
model Membership {
  id                  String           @id @default(uuid())
  userId              String
  communityId         String
  role                CommunityRole    @default(member)
  status              MembershipStatus @default(ACTIVE)
  pricingModelAtJoin  PricingModel     @default(FREE)
  membershipTier      MembershipTier   @default(FREE)
  joinedAt            DateTime         @default(now())

  @@unique([userId, communityId])
}
```

#### Subscription
```prisma
model Subscription {
  id                String          @id @default(uuid())
  membershipId      String
  externalId        String?                              // Stripe ID placeholder
  billingInterval   BillingInterval @default(MONTHLY)
  subscriptionStart DateTime        @default(now())
  subscriptionEnd   DateTime?                            // null for ONE_TIME
  pricePaid         Decimal
  paymentStatus     PaymentStatus   @default(PENDING)
  createdAt         DateTime        @default(now())
}
```

#### Post
```prisma
model Post {
  id          String    @id @default(uuid())
  communityId String
  authorId    String
  title       String
  content     String
  type        PostType  @default(TEXT)
  category    String?
  isPinned    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### Comment
```prisma
model Comment {
  id        String   @id @default(uuid())
  postId    String
  authorId  String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Course, Section, Lesson, LessonAttachment, LessonProgress, CoursePurchase
```prisma
model Course {
  id              String           @id @default(uuid())
  communityId     String
  title           String
  description     String?
  thumbnail       String?
  accessType      CourseAccessType @default(OPEN)
  unlockAfterDays Int?
  price           Decimal?
  order           Int              @default(0)
  isPublished     Boolean          @default(false)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model Section { id, courseId, title, order, createdAt, updatedAt }
model Lesson  { id, sectionId, title, description, videoUrl, content, transcript, order, duration, isPublished, createdAt, updatedAt }
model LessonAttachment { id, lessonId, name, url, type (AttachmentType), createdAt }
model LessonProgress   { id, userId, lessonId, completedAt, videoPosition; @@unique([userId, lessonId]) }
model CoursePurchase   { id, userId, courseId, pricePaid, createdAt; @@unique([userId, courseId]) }
```

#### Notification *(added Sprint 7)*
```prisma
model Notification {
  id        String           @id @default(uuid())
  userId    String
  type      NotificationType
  title     String
  body      String?
  link      String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@index([userId])
  @@index([userId, isRead])
}
```

#### Event *(added Sprint 8)*
```prisma
model Event {
  id            String      @id @default(uuid())
  communityId   String
  creatorId     String
  title         String
  description   String?
  coverUrl      String?
  location      String?
  startAt       DateTime
  duration      Int?                        // minutes
  timezone      String      @default("UTC")
  isRecurring   Boolean     @default(false)
  accessType    EventAccess @default(ALL_MEMBERS)
  emailReminder Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([communityId])
  @@index([startAt])
}
```

#### UserPoints *(added Sprint 9)*
```prisma
model UserPoints {
  id          String      @id @default(uuid())
  userId      String
  communityId String
  action      PointAction
  points      Int
  createdAt   DateTime    @default(now())

  @@index([userId, communityId])
  @@index([communityId, createdAt])
}
```

### Enums

| Enum | Values |
|---|---|
| `UserRole` | `user`, `moderator` |
| `CommunityRole` | `creator`, `admin`, `member` |
| `MembershipStatus` | `ACTIVE`, `CANCELLED`, `EXPIRED`, `BANNED` |
| `MembershipTier` | `FREE`, `PAID` |
| `PlatformPlan` | `BASIC`, `PRO` |
| `PricingModel` | `FREE`, `SUBSCRIPTION`, `FREEMIUM`, `ONE_TIME` |
| `BillingInterval` | `MONTHLY`, `YEARLY` |
| `PaymentStatus` | `PENDING`, `SUCCESS`, `FAILED` |
| `PostType` | `TEXT`, `IMAGE`, `VIDEO` |
| `AttachmentType` | `IMAGE`, `PDF`, `FILE`, `LINK` |
| `CourseAccessType` | `OPEN`, `BUY_NOW`, `TIME_UNLOCK`, `PRIVATE`, `LEVEL_UNLOCK` |
| `NotificationType` | `NEW_COMMENT`, `NEW_POST`, `MEMBER_JOINED`, `SUBSCRIPTION_EXPIRING`, `SUBSCRIPTION_EXPIRED` |
| `EventAccess` | `ALL_MEMBERS`, `PAID_MEMBERS` |
| `PointAction` | `MEMBERSHIP_JOINED`, `POST_CREATED`, `COMMENT_CREATED`, `LESSON_COMPLETED` |

---

## 7. API Routes Reference

All routes are prefixed with `/api/v1`. Protected routes require a valid JWT cookie (`token`).

### Authentication — `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/sign-up` | — | Register new user |
| POST | `/sign-in` | — | Login; sets JWT cookie |
| POST | `/sign-out` | — | Clear JWT cookie |
| POST | `/verify-email` | — | Verify email with token |
| POST | `/forgot-password` | — | Send password reset email |
| POST | `/reset-password` | — | Set new password with reset token |

### User — `/api/v1/user`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | protect | Get logged-in user profile |
| PUT | `/me` | protect | Update profile (name, password) |
| GET | `/me/communities` | protect | List user's joined communities |

### Communities — `/api/v1/communities`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List public communities |
| POST | `/` | protect | Create community |
| GET | `/:id` | — | Get community details |
| PUT | `/:id` | protect (creator) | Update community info |
| DELETE | `/:id` | protect (creator) | Delete community |
| PUT | `/:id/pricing` | protect (creator) | Configure pricing amounts |
| PUT | `/:id/pricing-model` | protect (creator) | Switch pricing model |
| GET | `/:id/my-membership` | protect | Check user membership |
| POST | `/:id/join` | protect | Join community |
| POST | `/:id/upgrade` | protect | Upgrade freemium tier |
| DELETE | `/:id/leave` | protect | Leave community |
| POST | `/:id/renew` | protect | Renew subscription |
| GET | `/:id/subscription` | protect | Get subscription state |
| GET | `/:id/analytics` | protect (creator/admin) | Community analytics |
| GET | `/:communityId/leaderboard` | protect + member | XP leaderboard + user level stats |

### Posts — Nested under `/api/v1/communities/:communityId`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/posts` | protect + member | List posts |
| POST | `/posts` | protect + member | Create post (+5 XP, notifies admins) |
| GET | `/posts/:postId` | protect + member | Get post |
| DELETE | `/posts/:postId` | protect | Delete post |
| GET | `/posts/:postId/comments` | protect + member | List comments |
| POST | `/posts/:postId/comments` | protect + member | Create comment (+2 XP, notifies post author) |
| DELETE | `/posts/:postId/comments/:commentId` | protect | Delete comment |

### Courses — Nested under `/api/v1/communities/:communityId`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/courses` | protect | List courses |
| POST | `/courses` | protect (creator) | Create course |
| GET | `/courses/:courseId` | protect | Get course with sections/lessons |
| PUT | `/courses/:courseId` | protect (creator) | Update course |
| DELETE | `/courses/:courseId` | protect (creator) | Delete course |
| POST | `/courses/:courseId/purchase` | protect | Buy BUY_NOW course |
| GET | `/courses/:courseId/progress` | protect | Get lesson completion % |
| POST | `/…/lessons/:lessonId/complete` | protect | Mark complete (+10 XP first time only) |
| DELETE | `/…/lessons/:lessonId/complete` | protect | Mark incomplete |
| PATCH | `/…/lessons/:lessonId/progress` | protect | Save video position |

### Events — Nested under `/api/v1/communities/:communityId` *(added Sprint 8)*

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/events?year=&month=` | protect + member | List events for a month |
| POST | `/events` | protect (creator/admin) | Create event |
| DELETE | `/events/:eventId` | protect (creator/admin) | Delete event |

### Notifications — `/api/v1/notifications` *(added Sprint 7)*

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | protect | Get last 30 notifications |
| GET | `/unread-count` | protect | Get unread count |
| PATCH | `/read-all` | protect | Mark all as read |
| PATCH | `/:id/read` | protect | Mark one as read |

### Membership — `/api/v1/membership`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | protect | List my memberships |
| GET | `/community/:communityId` | protect (creator/admin) | List members |
| GET | `/community/:communityId/export` | protect (creator/admin) | Export CSV |
| PUT | `/community/:communityId/members/:userId/ban` | protect (creator/admin) | Ban member |
| PUT | `/community/:communityId/members/:userId/unban` | protect (creator/admin) | Unban |
| PUT | `/community/:communityId/members/:userId/role` | protect (creator/admin) | Set role |

### Admin — `/api/v1/admin` (requires `moderator` role)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users` | protect + moderator | List all users |
| GET | `/communities` | protect + moderator | List all communities |
| PUT | `/users/:id/suspend` | protect + moderator | Suspend user |
| PUT | `/users/:id/unsuspend` | protect + moderator | Unsuspend user |
| GET | `/analytics` | protect + moderator | Platform analytics |

### Upload — `/api/v1/upload`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/presign` | protect | Get presigned S3/R2 PUT URL |

---

## 8. Authentication Flow

### Registration

```
User fills SignUp form
  → POST /auth/sign-up
  → Validate: email unique, password ≥8 chars, required fields
  → bcrypt hash password (12 rounds)
  → Generate verificationToken, valid 24 hours
  → INSERT User { isVerified: false }
  → Send verification email
  → Return SafeUser (no password)
```

### Login

```
POST /auth/sign-in
  → Find user by email → bcrypt.compare
  → Check isVerified (403 if not) → Check isSuspended (403)
  → Generate JWT { userId, role }, expires 7 days
  → Set httpOnly cookie "token"
  → UPDATE lastLogin → Return SafeUser
```

### Protected Route Middleware

```
Request with cookie "token"
  → jwt.verify(token, JWT_SECRET)
  → Fetch User (check not suspended)
  → Attach req.user = { id, role }
```

---

## 9. Access Control System

### Platform Roles

| Role | Access |
|---|---|
| `user` | Normal platform user |
| `moderator` | Platform admin panel, suspend users |

### Community Roles

| Role | Access |
|---|---|
| `creator` | Full control |
| `admin` | Member management, analytics |
| `member` | Feed, classroom, calendar, leaderboards |

### Membership Access Logic

| Pricing Model | Access Condition |
|---|---|
| `FREE` | Membership `ACTIVE` |
| `FREEMIUM` | Membership `ACTIVE` |
| `SUBSCRIPTION` | `ACTIVE` + subscription `SUCCESS` + not expired |
| `ONE_TIME` | `ACTIVE` + subscription `SUCCESS` |

### Course Access Types

| Access Type | Condition |
|---|---|
| `OPEN` | Any active member |
| `BUY_NOW` | CoursePurchase record exists |
| `TIME_UNLOCK` | `joinedAt + unlockAfterDays ≤ now` |
| `PRIVATE` | `membershipTier = PAID` |
| `LEVEL_UNLOCK` | `userLevel ≥ required level` (XP system now live — enforcement pending) |

### Event Access Types

| Access Type | Condition |
|---|---|
| `ALL_MEMBERS` | Any active member |
| `PAID_MEMBERS` | `membershipTier = PAID` |

---

## 10. Implemented Features

### Authentication (Complete)
- User registration with email verification
- Login/logout with httpOnly JWT cookie
- Password reset via email
- Suspended account protection

### Community Management (Complete)
- Create, update, delete communities
- Public/private visibility toggle
- Community discovery page

### Pricing & Monetization (Complete)
- Four pricing models: FREE, FREEMIUM, SUBSCRIPTION, ONE_TIME
- Configure pricing amounts (monthly, yearly, one-time, upgrade)
- Switch pricing model
- Mock payment provider (Stripe-ready interface)

### Membership System (Complete)
- Join, leave, upgrade, renew
- Hourly subscription expiry job
- 3-day expiry email reminders

### Social Feed (Complete)
- Posts (TEXT, IMAGE, VIDEO) with categories
- Post pinning (pinned posts shown first)
- Comments
- Delete permissions (author / creator / admin)

### Course Platform (Complete)
- Courses with 5 access types (OPEN, BUY_NOW, TIME_UNLOCK, PRIVATE, LEVEL_UNLOCK)
- Sections and lessons (video, TipTap rich text, transcript, attachments)
- Lesson completion tracking and progress %
- BUY_NOW individual course purchases
- Video position persistence

### Calendar & Events (Complete — Sprint 8)
- Monthly calendar grid (Mon–Sun, today highlighted)
- List view toggle
- Color-coded event pills per day cell
- Add event modal: title (30 char limit), date, time, duration, timezone, recurring toggle, location, description (300 char limit), cover image upload, access type, email reminder checkbox
- Delete events (creator/admin)
- Events filtered per month via query params
- Access types: ALL_MEMBERS, PAID_MEMBERS

### In-App Notifications (Complete — Sprint 7)
- Bell icon in community header with real-time unread badge (30s poll)
- Notification dropdown with last 30 notifications
- Mark single / mark all as read
- Type-specific icons (comment, post, member join, expiry warning, expired)
- Click to navigate to relevant page

**Notification triggers:**

| Event | Recipient | Type |
|---|---|---|
| New comment on your post | Post author | `NEW_COMMENT` |
| New post in community | Creator + admins | `NEW_POST` |
| Someone joins your community | Community creator | `MEMBER_JOINED` |
| Subscription expiring in 3 days | Member | `SUBSCRIPTION_EXPIRING` |
| Subscription expired | Member | `SUBSCRIPTION_EXPIRED` |

### Gamification — XP & Leaderboards (Complete — Sprint 9)
- XP earned per action (fire-and-forget, never blocks request)
- 9 levels with progressive XP thresholds
- Leaderboard page with user level card (avatar, level badge, XP, points to next level)
- 9-level grid showing lock/unlock state per level with feature labels and % of members
- Three leaderboard boards: 7-day, 30-day, all-time (top 20 per board)
- Gold/silver/bronze rank medals
- Auto-refreshes every 60 seconds

**XP table:**

| Action | XP |
|---|---|
| Join community | +5 |
| Create post | +5 |
| Create comment | +2 |
| Complete lesson (first time only) | +10 |

**Level thresholds:**

| Level | Min XP | Feature Unlock |
|---|---|---|
| 1 | 0 | — |
| 2 | 50 | Post to feed |
| 3 | 150 | — |
| 4 | 300 | — |
| 5 | 500 | Access locked courses |
| 6 | 750 | — |
| 7 | 1,100 | — |
| 8 | 1,600 | — |
| 9 | 2,200 | Chat with members |

### Member Management (Complete)
- List members with subscription info
- Ban/unban, role promotion/demotion
- CSV export

### Analytics (Complete)
- Community: member growth (6-month), revenue trend
- Platform: total users, communities, revenue (admin panel)

### File Uploads (Complete)
- Direct browser-to-S3/R2 via presigned URLs
- Images (10 MB), videos (2 GB), PDFs + archives (100 MB)

### User Profile (Complete)
- Update name, change password
- View joined communities with status/tier/expiry

### Admin Panel (Complete)
- User list, suspend/unsuspend
- Community list
- Platform analytics

---

## 11. Frontend Pages & Components

### Route Structure

```
/                              → Discover (public communities)
/sign-up|sign-in|...           → Auth pages
/communities/new               → CreateCommunity
/communities/:id               → CommunityLayout (shell)
  /community                   → Feed
  /community/posts/:postId     → PostDetail
  /classroom                   → Classroom
  /classroom/:courseId         → CoursePage
  /classroom/manage            → CourseBuilder
  /calendar                    → CalendarPage         ← Sprint 8
  /members                     → Members
  /leaderboards                → LeaderboardPage      ← Sprint 9
  /about                       → CommunityAboutTab
  /analytics                   → AnalyticsPage
  /settings/general|pricing|members → Settings pages
  /subscription                → SubscriptionPage
/profile                       → ProfilePage
/profile/communities           → MyCommunitiesPage
/admin                         → AdminUsersPage
/admin/communities             → AdminCommunitiesPage
/admin/analytics               → AdminAnalyticsPage
```

### Navigation Tab Order (CommunityLayout)

```
Community | Classroom | Calendar | Members | Leaderboards | About | [Analytics] | [Settings]
```
Analytics and Settings are only visible to creator/admin.

### Key Components

**`NotificationBell.tsx`** — Popover with bell icon + unread badge. Polls `GET /notifications/unread-count` every 30s. On open, fetches full list. Clicking a notification marks it read and navigates to `notification.link`. "Mark all read" button in header.

**`CalendarPage.tsx`** — Monthly grid with 7-column day layout. Events rendered as color-coded pills (up to 3 per cell, "+N more" overflow). Delete on hover for creator/admin. Month navigation, Today button, list/grid view toggle.

**`AddEventModal.tsx`** — Full event creation form matching Skool-style design. Title (char counter), date/time/duration/timezone grid, recurring checkbox, location select, description (char counter), cover image upload with S3 presign, access radio buttons, email reminder checkbox.

**`LeaderboardPage.tsx`** — User card with avatar, level badge, XP total, points to next level. 9-level grid split in two columns — unlocked levels show number, locked show padlock icon, current level highlighted amber. Three leaderboard columns (7d/30d/all-time) with rank medals.

---

## 12. Frontend API Layer

### API Modules

**`notification.ts`** *(Sprint 7)*
```ts
list()             → GET /notifications
unreadCount()      → GET /notifications/unread-count
markAsRead(id)     → PATCH /notifications/:id/read
markAllAsRead()    → PATCH /notifications/read-all
```

**`event.ts`** *(Sprint 8)*
```ts
list(communityId, year, month)  → GET /communities/:id/events?year&month
create(communityId, payload)    → POST /communities/:id/events
delete(communityId, eventId)    → DELETE /communities/:id/events/:eventId
```

**`leaderboard.ts`** *(Sprint 9)*
```ts
get(communityId)  → GET /communities/:id/leaderboard
```

---

## 13. File Upload Architecture

```
Browser                   Backend                    S3/R2
  │── POST /upload/presign ──▶│                          │
  │◀── { uploadUrl, fileUrl }─│                          │
  │────────── PUT fileBytes ─────────────────────────────▶│
  │◀─────────── 200 OK ───────────────────────────────────│
```

| Type | MIME | Max Size |
|---|---|---|
| Image | image/jpeg, image/png, image/webp, image/gif | 10 MB |
| Video | video/mp4, video/quicktime, video/webm | 2 GB |
| PDF | application/pdf | 100 MB |
| Archive | application/zip, application/octet-stream | 100 MB |

**Upload folders:** `courses`, `lessons`, `attachments`, `posts`, `communities`

---

## 14. Payment System

Mock provider (V0) — drop-in Stripe replacement when ready.

```ts
createSubscription(communityId, userId, interval)  → { subscriptionId, status }
createPaymentIntent(communityId, userId, amount)   → { paymentIntentId, status }
cancelSubscription(subscriptionId)                 → { status }
```

---

## 15. Background Jobs

### Subscription Expiry Job (`expiry.job.ts`)

Runs hourly on startup.

1. Mark `ACTIVE` memberships `EXPIRED` when `subscriptionEnd < now`
2. Send expiry reminder **email** + **in-app notification** for subscriptions expiring in ~3 days
3. Send `SUBSCRIPTION_EXPIRED` in-app notification for newly expired memberships

---

## 16. Middleware Stack

```
cors → express.json → cookie-parser
  → protect (JWT)
  → requireRole / requireCommunityRole
  → checkCommunityAccess
  → checkCourseAccess
  → controller
→ errorMiddleware
```

---

## 17. Known Issues & Limitations

| Issue | Severity | Notes |
|---|---|---|
| `LEVEL_UNLOCK` course gating not enforced | Medium | XP/level system is live but `checkCourseAccess` still falls through to OPEN for this type |
| Payment is mock only | High | All transactions use fake IDs — must integrate Stripe before launch |
| Video position tracking stored but not used in UI | Low | `saveVideoPosition` endpoint and DB column exist; no resume-on-open logic in player |
| No post pinning UI toggle | Low | `isPinned` field exists and pinned posts appear first, but no button in the feed UI |
| No email change flow | Low | Users can change name and password but not their email address |
| No refresh token mechanism | Medium | JWT expires in 7 days; users must re-login. No silent refresh |
| No pagination | Medium | Posts, comments, member lists, and notifications all fetch all records in one query |
| No rate limiting | High | Auth endpoints have no brute-force protection |
| Event email reminders not implemented | Low | `emailReminder` flag is stored but the email-sending job is not wired up |
| Leaderboard `LEVEL_UNLOCK` enforcement | Medium | Level thresholds defined in frontend config only; backend `checkCourseAccess` needs update |

---

## 18. TODOs & Future Work

### Priority 1 — Must-have before launch

- [ ] Integrate Stripe (replace `payment.service.ts`)
- [ ] Add rate limiting to auth endpoints (`express-rate-limit`)
- [ ] Add refresh token / silent token renewal
- [ ] Paginate posts, comments, and member lists
- [ ] Enforce `LEVEL_UNLOCK` in `checkCourseAccess` using `points.service.ts`

### Priority 2 — Feature completeness

- [ ] Event email reminder job (send email 1 day before event start)
- [ ] Post pinning UI toggle in feed
- [ ] Video resume-on-open (load `videoPosition` and seek player)
- [ ] Email change flow with re-verification
- [ ] Real HTML email templates (currently plaintext)

### Priority 3 — Quality of life

- [ ] File size + MIME validation via S3 `Content-Length-Range` condition
- [ ] Unit tests for all service files
- [ ] End-to-end tests (Playwright)
- [ ] Notification email for `NEW_COMMENT` and `NEW_POST` (currently in-app only)
- [ ] SEO / Open Graph meta for community pages
- [ ] Mobile responsive audit

### Architectural Backlog

- [ ] Replace mock payment with Stripe Checkout + webhook handler
- [ ] Database connection pooling (PgBouncer or Neon pooler)
- [ ] Structured logging (Winston or Pino)
- [ ] CDN caching headers for uploaded files

---

## 19. Scrum Sprint Summary

### Sprint 1 — Foundation
- Project scaffolding (Vite, Express, Prisma)
- PostgreSQL schema + authentication (register, login, logout, verify, reset)
- JWT cookie sessions + Nodemailer email service

### Sprint 2 — Community Core
- Community CRUD + pricing model system (FREE, FREEMIUM, SUBSCRIPTION, ONE_TIME)
- Membership system (join, leave, upgrade) + subscription records
- Community discovery page + non-member about page

### Sprint 3 — Social Feed
- Posts (TEXT, IMAGE, VIDEO) with categories and pinning
- Comments + delete permissions (author / creator / admin)

### Sprint 4 — Course Platform
- Course CRUD (5 access types) + sections, lessons, attachments
- TipTap rich text + video support + lesson completion tracking
- BUY_NOW purchases + course progress percentage + course builder dashboard

### Sprint 5 — Creator Tools
- Community settings (general, pricing, members)
- Member management (ban/unban, roles, CSV export)
- Analytics dashboard + file uploads (presigned S3/R2)
- Subscription renewal + hourly expiry background job

### Sprint 6 — Platform Admin
- Admin panel (users, communities, platform analytics)
- User suspension/unsuspension
- MongoDB → PostgreSQL migration
- Platform-level `moderator` role

### Sprint 7 — Notifications
- `Notification` model + `NotificationType` enum (5 types)
- `notification.service.ts` — create, list, mark read
- `GET /notifications`, `GET /notifications/unread-count`, `PATCH /read-all`, `PATCH /:id/read`
- Triggers: new comment → post author, new post → creator/admins, member joined → creator, subscription expiring/expired → member (in-app + email)
- Frontend: `NotificationBell` in community header — unread badge, dropdown panel, mark read on click

### Sprint 8 — Calendar & Events
- `Event` model + `EventAccess` enum (ALL_MEMBERS, PAID_MEMBERS)
- `event.service.ts` — list by month, create, delete
- `GET /events?year&month`, `POST /events`, `DELETE /events/:id`
- Frontend: `CalendarPage` (monthly grid + list view), `AddEventModal` (full form matching Skool design)
- "Calendar" tab added after "Classroom" in navigation

### Sprint 9 — Gamification
- `UserPoints` model + `PointAction` enum (4 actions)
- `points.service.ts` — addPoints, getUserStats, computeLevel (9 levels), getLeaderboard (7d/30d/all-time)
- XP hooks: +5 join, +5 post, +2 comment, +10 lesson complete (first time only)
- `GET /:communityId/leaderboard` — returns user stats + level distribution + all three boards
- Frontend: `LeaderboardPage` — user card with avatar + level badge + XP, 9-level grid with lock/unlock + feature labels + member %, three leaderboard columns with rank medals
- "Leaderboards" tab added after "Members" in navigation

### Current Status

The platform is feature-complete for V0+ with notifications, calendar, and gamification. **16 database models, 13 enums, 9 navigation tabs.**

**Next milestone:** V1 — Stripe integration + `LEVEL_UNLOCK` enforcement + pagination + rate limiting.

---

---

## 20. UML Diagrams

> Source: [UML_DIAGRAMS.md](UML_DIAGRAMS.md) — render with PlantUML or any compatible tool.

### Use Case Diagrams

#### UC-01 — Global Platform Overview

![UC-01 — Global Platform Overview](diagrams/uc-01-global-platform-overview.png)

---

#### UC-02 — Authentication

![UC-02 — Authentication](diagrams/uc-02-authentication.png)

---

#### UC-03 — Community Management

![UC-03 — Community Management](diagrams/uc-03-community-management.png)

---

#### UC-04 — Membership & Subscription

![UC-04 — Membership & Subscription](diagrams/uc-04-membership-subscription.png)

---

#### UC-05 — Feed

![UC-05 — Feed](diagrams/uc-05-feed.png)

---

#### UC-06 — Classroom

![UC-06 — Classroom](diagrams/uc-06-classroom.png)

---

#### UC-07 — Member Management

![UC-07 — Member Management](diagrams/uc-07-member-management.png)

---

#### UC-08 — Platform Administration

![UC-08 — Platform Administration](diagrams/uc-08-platform-administration.png)

---

### Class Diagram

#### Full Domain Model

![Class Diagram — Full Domain Model](diagrams/class-full-domain-model.png)

---

### Sequence Diagrams

#### SD-01 — Sign Up & Email Verification

![SD-01 — Sign Up & Email Verification](diagrams/sd-01-sign-up-email-verification.png)

---

#### SD-02 — Password Reset Flow

![SD-02 — Password Reset Flow](diagrams/sd-02-password-reset-flow.png)

---

#### SD-03 — Join a SUBSCRIPTION Community

![SD-03 — Join a SUBSCRIPTION Community](diagrams/sd-03-join-subscription-community.png)

---

#### SD-04 — Join a FREEMIUM Community + Upgrade

![SD-04 — Join a FREEMIUM Community + Upgrade](diagrams/sd-04-join-freemium-upgrade.png)

---

#### SD-05 — Subscription Expiry & Renewal

![SD-05 — Subscription Expiry & Renewal](diagrams/sd-05-subscription-expiry-renewal.png)

---

#### SD-06 — Access a Lesson (middleware chain)

![SD-06 — Access a Lesson](diagrams/sd-06-access-lesson.png)

---

#### SD-07 — Presigned File Upload

![SD-07 — Presigned File Upload](diagrams/sd-07-presigned-file-upload.png)

---

#### SD-08 — Create Post & Comment

![SD-08 — Create Post & Comment](diagrams/sd-08-create-post-comment.png)

---

### Activity Diagrams

#### AD-01 — User Registration & Verification

![AD-01 — User Registration & Verification](diagrams/ad-01-user-registration-verification.png)

---

#### AD-02 — Community Join Decision

![AD-02 — Community Join Decision](diagrams/ad-02-community-join-decision.png)

---

#### AD-03 — Course Access Authorization

![AD-03 — Course Access Authorization](diagrams/ad-03-course-access-authorization.png)

---

#### AD-04 — Subscription Expiry Job

![AD-04 — Subscription Expiry Job](diagrams/ad-04-subscription-expiry-job.png)

---

#### AD-05 — Presigned Upload Process

![AD-05 — Presigned Upload Process](diagrams/ad-05-presigned-upload-process.png)

---

*Report last updated: 2026-05-01.*
