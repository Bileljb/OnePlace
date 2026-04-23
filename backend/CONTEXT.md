# OnePlace — Project Context for Claude Code

> ## Before doing anything — read this file, then analyse the codebase
>
> 1. Read this entire file first.
> 2. Then run the following to understand the full current state of the project:
>    - Explore the folder structure (`src/`)
>    - Read all existing route files
>    - Read all existing controller and service files
>    - Read the Prisma schema (`prisma/schema.prisma`)
>    - Read any middleware files
> 3. Only after both steps, begin working.
>
> Do not assume anything not confirmed by this file or the codebase.
> Do not suggest alternatives to the stack or schema unless explicitly asked.

---

## 1. What is OnePlace?

A platform where creators build paid private communities and members pay to access and engage.

**One-line pitch:** All-in-one platform for creators to monetize and manage their community — no duct-taping tools together.

**Core loop (non-negotiable anchor):**
```
Create Community → User Pays → Access Granted → Engagement → Creator Earns
```
Every feature must serve this loop.

---

## 2. Problem being solved

- Creators use too many fragmented tools (Discord + Stripe + Notion + Linktree…)
- No automation between payment and access
- Hard to manage who paid vs who didn't
- Poor UX for members
- Lack of localized solutions in the target region

---

## 3. Stack (decided, do not change)

| Layer | Tech | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev, SPA, no SSR needed at this stage |
| Backend | Node.js + Express | Familiar, lightweight, flexible |
| Language | TypeScript (relaxed) | Types where useful, `any` allowed, not strict mode |
| Database | PostgreSQL (Neon) | Relational data fits this domain perfectly |
| ORM | Prisma | Clean schema, type-safe queries |
| Payments | Stripe | Industry standard, good webhook support |
| Auth | Custom JWT | Full control, fits the role system |

---

## 4. Roles

### Platform-level (`User.role`)
- `user` — default for all registered users
- `moderator` — platform-level moderation (scope TBD, see open questions)

### Community-level (`Membership.role`)
- `creator` — owns the community
- `admin` — manages members within a community
- `member` — regular paying member

---

## 5. Current schema (PostgreSQL + Prisma)

```sql
-- Enums
CREATE TYPE "UserRole" AS ENUM ('user', 'moderator');
CREATE TYPE "CommunityRole" AS ENUM ('creator', 'admin', 'member');
CREATE TYPE "MembershipStatus" AS ENUM ('active', 'cancelled', 'expired', 'banned');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'success', 'failed');

-- User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "lastLogin" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "resetPasswordToken" TEXT,
    "resetPasswordExpiresAt" TIMESTAMP(3),
    "verificationToken" TEXT,
    "verificationTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Community
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- Membership
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "role" "CommunityRole" NOT NULL DEFAULT 'member',
    "status" "MembershipStatus" NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- Subscription
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "subscriptionStart" TIMESTAMP(3) NOT NULL,
    "subscriptionEnd" TIMESTAMP(3) NOT NULL,
    "pricePaid" DECIMAL(65,30) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- Indexes & Foreign Keys
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Membership_userId_communityId_key" ON "Membership"("userId", "communityId");
ALTER TABLE "Community" ADD CONSTRAINT "Community_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 6. Models not yet in schema (build when needed)

### Post
```
id, communityId, authorId, content, type (text | image | video), createdAt, updatedAt
```

### Comment
```
id, postId, authorId, content, createdAt, updatedAt
```

Add these to the Prisma schema before building the feed feature.

---

## 7. Access control rule (critical — enforce everywhere)

A user can access a community's private feed and content **only if ALL three conditions are true:**

```
Membership.status === 'active'
AND Subscription.paymentStatus === 'success'
AND Subscription.subscriptionEnd > now()
```

This logic must live in a **single reusable middleware or service function** (e.g. `checkCommunityAccess`).
Never duplicate this check across routes. Every protected community route must call it.

---

## 8. API routes

All routes are prefixed with `/api/v1/`. Always use this prefix — never `/api/`.

| Route | Responsibility | Status |
|---|---|---|
| `/api/v1/auth` | Register, login, verify email, reset password | 🔨 In progress |
| `/api/v1/user` | User profile, settings | 🔨 In progress |
| `/api/v1/membership` | Membership management | 🔨 In progress |
| `/api/v1/communities` | Create, view, update communities | ⏳ Pending |
| `/api/v1/posts` | Community feed — create, read, delete posts | ⏳ Pending |
| `/api/v1/payments` | Stripe checkout session creation | ⏳ Pending |
| `/api/v1/subscriptions` | Access control, lifecycle (expiry, cancel) | ⏳ Pending |
| `/api/v1/admin` | Platform-level user and payment management | ⏳ Pending |

All routes are RESTful and role-protected.

---

## 9. Architecture rules

- **Controllers** — thin. Only handle HTTP request/response. No business logic.
- **Services** — the brain. All business logic lives here.
- **Models** — data only. Prisma schemas and types.
- **Middlewares** — auth verification, role checks, access control.
- **Utils** — pure helper functions (token generation, date checks, etc.)
- **Types** — TypeScript interfaces for requests, service inputs, and roles.

```
src/
├── models/
├── routes/
├── controllers/
├── services/
├── middlewares/
├── utils/
└── types/
```

---

## 10. Auth mechanism (confirmed)

- JWT stored in **httpOnly cookies** — not in Authorization headers / Bearer tokens
- `cookie-parser` is already set up in `server.ts`
- All auth middleware must read the token from `req.cookies`, not `req.headers.authorization`

---

## 11. Error handling pattern (confirmed)

- Errors are handled centrally via `errorMiddleware` (already registered in `server.ts`)
- Controllers must **never** do `res.status(500).json(...)` directly for unexpected errors
- Always pass errors to the next middleware: `next(err)`
- Example:
```typescript
try {
  const result = await someService.doSomething();
  res.status(200).json(result);
} catch (err) {
  next(err);
}
```

---

## 12. Server setup (confirmed — do not modify)

- Graceful shutdown already handled: SIGTERM, unhandledRejection, uncaughtException
- DB connects inside the `listen` callback
- DB disconnects on all shutdown paths
- Do not touch `server.ts` unless explicitly asked

---

## 13. Versioning scope

### V0 — Proof of concept (current focus)
- Auth (register / login)
- Roles (admin, creator, member)
- Creator creates one community
- Public community page
- Mock or real payment
- Subscription system
- Private feed (posts + comments)
- Basic admin panel

### V1 — Business-ready
- Real Stripe integration + webhooks
- Subscription lifecycle (expiry, cancel)
- Member management (ban, list, export)
- Email notifications
- Onboarding UX

### V2 — Scale
- Multiple communities per creator
- Analytics dashboard
- Coupons
- Better UI/UX
- Affiliate program

> Only build V0 features unless explicitly told otherwise.

---

## 14. Build order

1. **Auth system** ← start here
2. Community CRUD
3. Payment + subscription flow
4. Private feed (posts + comments)
5. Admin panel

---

## 15. Open questions (do not make assumptions — ask when relevant)

- **`moderator` role in `UserRole`** — unclear what a platform-level moderator can do that a community `admin` cannot. Clarify before building any moderator-specific logic.
- **`stripeSubscriptionId` missing from `Subscription` table** — when Stripe sends a webhook, you need to reconcile it with the DB. This field must be added before implementing real Stripe integration.
- **Free communities** — `Community.price` defaults to `0`. Decide whether a free community still requires a `Subscription` record or if membership is granted directly.
- **Creator membership** — when a creator creates a community, do they automatically get a `Membership` record for their own community? Likely yes, but confirm.
