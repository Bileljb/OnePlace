# OnePlace — UML Diagrams

> `[ ]` pending · `[x]` done

---

## Use Case Diagrams

| # | Status | Title | Description | Actors |
|---|---|---|---|---|
| UC-01 | [ ] | Global Platform Overview | All platform capabilities grouped by actor type | Guest, Member, Creator, Community Admin, Platform Moderator |
| UC-02 | [ ] | Authentication | Register, verify email, login, logout, forgot/reset password | Guest, Member |
| UC-03 | [ ] | Community Management | Create, update, delete community; configure pricing and plans | Creator, Community Admin |
| UC-04 | [ ] | Membership & Subscription | Join, upgrade, renew, leave; view own memberships | Member, Creator |
| UC-05 | [ ] | Feed | Create/delete posts and comments; filter by category; pin posts | Member, Creator, Community Admin |
| UC-06 | [ ] | Classroom | Browse courses, access lessons, track progress, purchase courses | Member, Creator, Community Admin |
| UC-07 | [ ] | Member Management | List members, ban/unban, promote/demote, export CSV | Creator, Community Admin |
| UC-08 | [ ] | Platform Administration | Suspend/unsuspend users and communities, view platform analytics | Platform Moderator |

---

## Class Diagram

| # | Status | Title | Description | Entities |
|---|---|---|---|---|
| CD-01 | [x] | Full Domain Model | All 13 Prisma models, their fields, enums, and associations | User, Community, CommunityPricing, Membership, Subscription, Post, Comment, Course, CoursePurchase, Section, Lesson, LessonAttachment, LessonProgress + 11 enums |

---

## Sequence Diagrams

| # | Status | Title | Description | Actors / Components |
|---|---|---|---|---|
| SD-01 | [ ] | Sign Up & Email Verification | From registration to verified account and welcome email | Guest, Auth Controller, Auth Service, Email Service, DB |
| SD-02 | [ ] | Password Reset Flow | From forgot-password request to new password saved | Member, Auth Controller, Auth Service, Email Service, DB |
| SD-03 | [ ] | Join a SUBSCRIPTION Community | Member joins → payment → membership created → confirmation email | Member, Community Controller, Membership Service, Payment Service, Email Service, DB |
| SD-04 | [ ] | Join a FREEMIUM Community + Upgrade | Member joins free tier → hits locked content → upgrades to paid | Member, Community Controller, Access Middleware, Membership Service, DB |
| SD-05 | [ ] | Subscription Expiry & Renewal | Job marks expired memberships → reminder sent → member renews | Expiry Job, Membership Service, Email Service, Member, DB |
| SD-06 | [ ] | Access a Lesson (middleware chain) | Auth check → community access → course access → lesson served or 403 | Member, Auth Middleware, Access Middleware, Course Controller, DB |
| SD-07 | [ ] | Presigned File Upload | Client requests URL → uploads directly to S3/R2 → saves CDN URL | Member, Upload Controller, Upload Service, S3/R2 |
| SD-08 | [ ] | Create Post & Comment | Member creates post → another member views feed and comments | Member, Post Controller, Post Service, DB |

---

## Activity Diagrams

| # | Status | Title | Description | Actors / Components |
|---|---|---|---|---|
| AD-01 | [ ] | User Registration & Verification | Decision flow from form submit through token validation to verified state | Guest, System |
| AD-02 | [ ] | Community Join Decision | Branching across all 4 pricing models to determine membership outcome | Member, System |
| AD-03 | [ ] | Course Access Authorization | Decision tree for all 5 access types leading to grant or 403 | Member, System |
| AD-04 | [ ] | Subscription Expiry Job | Hourly process: check memberships → mark expired → send reminders | System |
| AD-05 | [ ] | Presigned Upload Process | File selected → presign → PUT to S3/R2 → CDN URL persisted | Member, System, S3/R2 |
