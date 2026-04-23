# OnePlace — Frontend To-Do

> `[ ]` = todo · `[-]` = in progress · `[x]` = done
> Build top to bottom — nothing below a priority is usable until the one above it is done.

---

## Priority 1 — Auth

- [x] Register page (`/sign-up`) — email + password form → `POST /auth/sign-up` → redirect to "check your email"
- [x] Login page (`/sign-in`) — email + password → `POST /auth/sign-in` → redirect to `/communities`
- [x] Email verification page (`/verify-email?token=`) — auto-calls `POST /auth/verify-email` on mount
- [x] Forgot password page (`/forgot-password`) — email input → `POST /auth/forgot-password`
- [x] Reset password page (`/reset-password?token=`) — new password → `POST /auth/reset-password`
- [x] Logout button (navbar) — `POST /auth/sign-out`, clear local state, redirect to `/sign-in`

---

## Priority 2 — Community Discovery (public)

- [x] Explore page (`/communities`) — grid of public communities, name + description + pricing model + member count → `GET /communities`
- [x] Community about page (`/communities/:id/about`) — now lives inside the shell as the About tab; design done, join button done

---

## Priority 3 — Community Shell

- [x] Community layout — top nav tabs: Community · Classroom · Members · About; sidebar with community info
- [x] Join flow modal — handles FREE (instant), FREEMIUM (instant), SUBSCRIPTION (payment), ONE_TIME (payment) → `POST /communities/:id/join`
- [x] Upgrade modal — shown to FREE-tier members in FREEMIUM communities → `POST /communities/:id/upgrade`
- [x] Auth guard — unauthenticated → `/sign-in`; non-member → About page

---

## Priority 4 — Feed

- [x] Feed page (`/communities/:id/community`) — posts list, pinned first then newest, category filter tabs → `GET /communities/:communityId/posts`
- [x] Post detail page (`/communities/:id/community/posts/:postId`) — full post + comments thread → `GET /posts/:postId` + `GET /posts/:postId/comments`
- [x] Create post modal — title, content, type (TEXT/IMAGE/VIDEO), category picker → `POST /communities/:communityId/posts`
- [x] Create comment — inline input at bottom of post detail → `POST /posts/:postId/comments`
- [x] Delete post / comment — author, creator, and admin can delete → `DELETE` endpoints

---

## Priority 5 — Classroom

- [x] Classroom home (`/communities/:id/classroom`) — course grid with thumbnail, title, access type badge, progress bar → `GET /communities/:communityId/courses`
- [x] Course page (`/communities/:id/classroom/:courseId`) — left sidebar (sections + lessons), main area (active lesson), progress bar header → `GET /courses/:courseId`
- [x] Lesson view (inside course page) — video player, rich text content, transcript toggle, attachments list, mark complete button → `GET .../lessons/:lessonId` + `POST .../complete` + `PATCH .../progress`
- [x] Course locked screen — overlay on course page for 403 responses; message + CTA per access type (BUY_NOW shows price, TIME_UNLOCK shows unlock date, PRIVATE shows upgrade prompt)
- [x] Purchase course modal — confirm + pay for BUY_NOW courses → `POST /courses/:courseId/purchase`

---

## Priority 6 — Creator: Community Setup

- [x] Create community page (`/communities/new`) — name, description, platform plan → `POST /communities`
- [x] Community settings page (`/communities/:id/settings`) — edit name, description, visibility → `PUT /communities/:id`
- [x] Pricing settings (`/communities/:id/settings/pricing`) — pricing model selector + price inputs → `PUT /communities/:id/pricing` + `PUT /communities/:id/pricing-model`
- [x] Member management page (`/communities/:id/settings/members`) — members table with status/tier/subscription, ban/unban/promote/demote actions, export CSV button → membership endpoints

---

## Priority 7 — Creator: Course Builder

- [x] Course builder home (`/communities/:id/classroom/manage`) — all courses (draft + published), create button → `GET /courses`
- [x] Add / edit course modal — name, description, access type, price, unlock days, thumbnail upload (presign + S3), published toggle → `POST/PUT /courses`
- [x] Course content editor (`/communities/:id/classroom/manage/:courseId`) — section + lesson list with add / rename / delete
- [x] Add section modal — single name input → `POST /courses/:courseId/sections`
- [x] Lesson editor (full panel) — video URL, content textarea, transcript, duration, resource links, published toggle → `POST/PUT .../lessons` + `POST .../attachments`

---

## Priority 8 — User Account

- [x] Profile page (`/profile`) — display name, email, edit name + change password → `GET /user/me` + `PUT /user/me`
- [x] My communities page (`/profile/communities`) — joined communities with membership status, tier, expiry → `GET /user/me/communities`
- [x] Subscription management (`/communities/:id/subscription`) — current state, renew button, leave community button → `GET /communities/:id/subscription` + `POST /renew` + `DELETE /leave`

---

## Priority 9 — Analytics

- [x] Community analytics page (`/communities/:id/analytics`) — members growth chart, revenue chart, stats cards (total members, revenue this month) → `GET /communities/:id/analytics`

---

## Priority 10 — Admin Panel

- [x] Admin layout (`/admin`) — sidebar nav, `moderator` role guard
- [x] Users page (`/admin/users`) — users table with suspend/unsuspend actions → `GET /admin/users`
- [x] Communities page (`/admin/communities`) — communities table → `GET /admin/communities`
- [x] Platform analytics page (`/admin/analytics`) — users/communities/revenue charts → `GET /admin/analytics`

---

## Shared Components

- [x] Video player — supports embed URLs (YouTube/Vimeo/Loom/Wistia) + direct upload URLs
- [x] Rich text renderer — renders stored HTML/JSON lesson content
- [ ] File uploader — drag-and-drop or select → presign → PUT to S3/R2 → return CDN URL
- [x] Progress bar — used on course cards and course page header
- [x] Access type badge — OPEN / BUY_NOW / TIME_UNLOCK / PRIVATE
- [x] Pricing model badge — FREE / FREEMIUM / SUBSCRIPTION / ONE_TIME
- [ ] Toast notifications — success, error, info
- [ ] Confirmation modal — delete post, delete course, leave community, ban member

---

## Notes

- Non-members can only see the About page — all other community pages redirect there if not an active member
- Video upload: `POST /upload/presign` → PUT directly to S3/R2 with the returned `uploadUrl` → save `fileUrl` to lesson
- Members and Leaderboards tabs are not in scope yet
