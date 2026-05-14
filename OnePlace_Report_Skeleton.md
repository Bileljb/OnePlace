# OnePlace
## A Skool-Inspired Paid Community Platform for Creators

> **End-of-Studies Project Report**
> Applied Bachelor's Degree in Computer Science
>
> Submitted by: `Bilel Jabrane` | `[Author 2 Full Name]`
> Supervisor: `[Supervisor Name, Title]`
> Institution: `[University / Institution Name]`
> Academic Year: `2025/2026`

---

## Project Summary Sheet

> 📋 **TABLE PLACEHOLDER — Project Summary Sheet**

| Field | Details |
|---|---|
| Project Title | OnePlace — Paid Community Platform for Creators |
| Authors | Bilel Jabrane / [Author 2 Full Name] |
| Supervisor | [Supervisor Name, Title] |
| Institution | [University / Institution Name] |
| Academic Year | 2025/2026 |
| Project Type | Independent graduation project (no host company) |
| Duration | October 2025 → May 2026 |
| Design Phase | 21 days |
| Development Phase | 140 days |
| Technical Prerequisites | TypeScript, Node.js, React, PostgreSQL |
| Tools Used | VS Code + Claude Code, Postman, Draw.io, Prisma Studio |
| Methodology | Scrum |
| Key Behavioural Skills Acquired | Stress management, Adaptability, Time management, Autonomous work ethic |
| Key Technical Skills Acquired | React + Vite, Node.js + Express + TypeScript, PostgreSQL + Prisma |

---

## Dedication

> ✏ *Dedication text — write your personal dedication to family, friends, and teammates.*

---

## Acknowledgements

> ✏ *Acknowledge your academic supervisor, jury members, professors, family, and anyone else who supported this project.*

---

## Table of Contents

> ✏ *`[ Word / your editor will generate the Table of Contents automatically ]`*

---

## List of Tables

> ✏ *Update table numbers once all content is filled in.*

- Table 1 — Overview of similar community platforms
- Table 2 — Comparison between OnePlace and existing platforms
- Table 3 — Comparison between classic and agile methodologies (overview)
- Table 4 — Comparison between classic and agile methodologies (detailed)
- Table 5 — Comparison between Scrum and XP
- Table 6 — Hardware specifications of development machines
- Table 7 — Product Backlog
- Table 8 — Sprint 1 Backlog
- Table 9 — Use-case: Sign Up
- Table 10 — Use-case: Log In
- Table 11 — Use-case: Creator Adds a Member Manually
- Table 12 — Use-case: Reset Password
- Table 13 — Sprint 2 Backlog
- Table 14 — Use-case: Join a Community
- Table 15 — Use-case: Create a Post
- Table 16 — Use-case: Access Premium Content
- Table 17 — Use-case: Browse the Community Feed
- Table 18 — Sprint 3 Backlog
- Table 19 — Use-case: Manage Members
- Table 20 — Use-case: Manage Subscription
- Table 21 — Sprint 4 Backlog
- Table 22 — Use-case: Search Communities
- Table 23 — Use-case: Delete a Community
- Table 24 — Use-case: Edit Community Settings
- Table 25 — Use-case: Super Admin — List All Communities

---

## List of Figures

> ✏ *Update figure numbers once all screenshots are inserted.*

- Figure 1 — Scrum Process
- Figure 2 — MVC / Layered Architecture Diagram
- Figure 3 — Overall System Architecture Diagram
- Figure 4 — Backlog Hierarchy Diagram
- Figure 5 — Global Use-Case Diagram
- Figure 6 — Sprint Planning Overview
- Figure 7 — Sprint 1 Use-Case Diagram
- Figure 8 — Sprint 1 Overview
- Figure 9 — Wireframe: Registration Page
- Figure 10 — Wireframe: Login Page
- Figure 11 — Wireframe: Creator Dashboard / User Management
- Figure 12 — Sequence Diagram: Log In
- Figure 13 — Sequence Diagram: Sign Up
- Figure 14 — Sequence Diagram: Reset Password
- Figure 15 — Sprint 2 Use-Case Diagram
- Figure 16 — Sprint 2 Overview
- Figure 17 — Wireframe: Community Home Feed
- Figure 18 — Wireframe: Create / Edit Post
- Figure 19 — Wireframe: Browse Community (Member View)
- Figure 20 — Sequence Diagram: Join a Community
- Figure 21 — Sequence Diagram: Create a Post
- Figure 22 — Sequence Diagram: Access Premium Content
- Figure 23 — Sprint 3 Use-Case Diagram
- Figure 24 — Class Diagram (Sprint 3)
- Figure 25 — Wireframe: Creator Dashboard — Summary
- Figure 26 — Wireframe: Member List
- Figure 27 — Wireframe: Community Settings
- Figure 28 — Wireframe: Subscription & Payments
- Figure 29 — Wireframe: Member Profile
- Figure 30 — Wireframe: Pricing Configuration
- Figure 31 — Wireframe: Analytics
- Figure 32 — Wireframe: Notifications (Creator View)
- Figure 33 — Wireframe: Notifications (Member View)
- Figure 34 — Sequence Diagram: Manage Members
- Figure 35 — Sequence Diagram: Cancel Subscription
- Figure 36 — Sprint 4 Use-Case Diagram
- Figure 37 — Class Diagram (Sprint 4)
- Figure 38 — Wireframe: Discover Communities
- Figure 39 — Wireframe: Search Results
- Figure 40 — Wireframe: Public Landing Page
- Figure 41 — Sequence Diagram: Search Communities
- Figure 42 — Sequence Diagram: Delete a Community
- Figure 43 — Sequence Diagram: Edit Community Settings
- Figure 44 — Landing Page
- Figure 45 — Login Page
- Figure 46 — Registration Page
- Figure 47 — Creator Dashboard — User Management
- Figure 48 — Community Creation Form
- Figure 49 — Community Home Feed (Creator View)
- Figure 50 — Community Home Feed (Member View — Free Post)
- Figure 51 — Create Post Form
- Figure 52 — Premium Post Gating (locked for non-premium member)
- Figure 53 — Join Community Flow — Free Model
- Figure 54 — Join Community Flow — Subscription Model
- Figure 55 — Post Detail Page
- Figure 56 — User Profile Page
- Figure 57 — Creator Dashboard — Summary & Analytics
- Figure 58 — Member List Page
- Figure 59 — Community Settings Page
- Figure 60 — Pricing Configuration
- Figure 61 — Member Profile Page
- Figure 62 — Subscription & Payment History
- Figure 63 — Notifications Centre
- Figure 64 — Discover Communities Page
- Figure 65 — Search Results Page
- Figure 66 — Super Admin — All Communities
- Figure 67 — Activity Diagram: Sign Up (AD-01)
- Figure 68 — Activity Diagram: Join a Community (AD-02)
- Figure 69 — Activity Diagram: Create a Post (AD-03)
- Figure 70 — Activity Diagram: Manage Members (AD-04)
- Figure 71 — Activity Diagram: Community Discovery (AD-05)

---

## General Introduction

The creator economy has grown exponentially over the last decade. Content creators, educators, independent coaches, and community builders increasingly seek sustainable ways to monetise their audience beyond advertising and sponsorships. Platforms such as Patreon, Skool, Circle, and Mighty Networks have demonstrated that people are genuinely willing to pay for access to exclusive, high-quality communities built around shared interests or learning goals.

Despite the growth of this market, existing solutions each fall short in their own way: some lack the simplicity that early-stage creators need, others impose high platform fees or revenue cuts, and many fail to deliver a truly integrated experience covering community management, content gating, course delivery, and payments all in one place. Creators are left juggling Discord for community, Gumroad for payments, Notion for content, and email lists for communication — all disconnected.

In this context, OnePlace was born as a personal initiative — a graduation project conceived and developed entirely by the student team with no host company. OnePlace is a Skool-inspired paid community platform that allows creators to build, manage, and monetise private communities by choosing from four pricing models: Free, Subscription, Freemium, and One-time payment. Members discover communities, join based on the chosen model, consume free and premium content, attend events, and progress through courses — all from a single unified platform.

To carry out this project, we adopted the Scrum agile methodology, which allowed us to deliver value incrementally across four sprints organised into two releases. The technical stack — React + Vite on the frontend, Node.js + Express + TypeScript on the backend, and PostgreSQL via Prisma ORM hosted on Neon — was chosen for its robustness, type safety, and alignment with industry standards.

This report is organised as follows:

- **Chapter 1** — Project Framework: context, analysis of existing solutions, proposed solution, methodology, and technical environment.
- **Chapter 2** — Requirements Analysis & Design: actors, requirements, product backlog, use-case diagrams, wireframes, textual use-case descriptions, and sequence diagrams for all four sprints.
- **Chapter 3** — Implementation: the final interfaces across both releases.
- **General Conclusion** — contributions and future perspectives.

---

# Chapter 1: Project Framework

## Introduction

In this chapter we place OnePlace in its broader context. We start by explaining the origin of the idea and the problem it solves, then analyse existing platforms to identify their shortcomings. We present our proposed solution, and close with the methodology and technical environment we chose for development.

---

## I. Project Origin & Motivation

Unlike a traditional internship project assigned by a company, OnePlace is an original idea conceived by the student team. The motivation came from observing the fragmented landscape content creators face: they typically juggle Discord for community management, Gumroad or Stripe for payments, Notion for content organisation, and email marketing tools for member communication — all disconnected and requiring significant operational overhead to maintain.

We wanted to build a single platform where a creator can launch a paid community, publish content with granular access control, gate premium material behind a membership tier, and grow a member base — all from one unified dashboard. The closest inspiration was Skool (skool.com), but we aimed to build something more flexible in terms of pricing models, simpler to understand for new creators, and entirely under our own control as an open platform.

---

## II. Project Context

This project is carried out as part of the End-of-Studies requirement for the Applied Bachelor's Degree in Computer Science. It was entirely self-initiated — there is no host company. The two authors conceived the idea, defined the product scope, and built the platform from scratch during the final semester of the 2025/2026 academic year.

OnePlace V0 focuses on the core creator-to-member loop: a creator signs up, creates a community, chooses a pricing model, and members can join, browse posts, access premium content based on their membership status, attend scheduled events, and progress through structured courses. A key architectural decision made midway through development was migrating from MongoDB (initial choice) to PostgreSQL with Prisma ORM, which provided stronger relational integrity for the complex membership and payment relationships at the heart of the platform.

---

## III. Analysis of Existing Solutions

### 1. Description of the Current Situation

Today, creators who want to build a paid community must assemble multiple tools. A typical setup might include: a Discord server for community chat, a payment processor (Stripe or Gumroad) for billing, a CMS (Notion or WordPress) for content, and an email service (Mailchimp) for member updates. This fragmentation leads to a poor member experience — members must manage accounts on multiple platforms — and high operational overhead for the creator who must keep all these tools synchronised.

### 2. Critique of Existing Solutions

Based on our analysis of the existing landscape, we identified the following pain points:

- No single platform combines community feed, structured courses, event calendar, and flexible payments cohesively in one product.
- Skool is close to what creators need but targets primarily English-speaking markets and offers only a single monthly subscription pricing model per community.
- Circle and Mighty Networks are feature-rich but complex and expensive for early-stage or solo creators.
- Discord and Slack are free and well-suited to community chat but have no native monetisation, content gating, or course delivery.
- Patreon supports patron-based monetisation but lacks a real community feed, course module, or member management layer.

### 3. Proposed Solution

OnePlace addresses these shortcomings by providing an all-in-one platform where:

- Creators can launch a community in minutes with a chosen pricing model (Free, Subscription, Freemium, or One-time payment).
- Members get a single place to discover communities, join, and access content — with premium content gated via an `isPremium` flag on each post.
- File uploads (cover images, icons, post attachments) are handled via Cloudflare R2 presigned PUT URLs so files never pass through the application server.
- A transactional email system (Nodemailer + Resend SMTP) delivers welcome emails, password reset links, membership confirmations, and subscription expiry warnings automatically.
- Video events are supported via Daily.co: when a creator sets an event location to "OnePlace Call," a video room is automatically created and a "Join Call" button appears for members.
- The platform plan per community (Basic / Pro enum stub) is stored but not yet enforced in V0, paving the way for feature gating in future versions.

### 4. Study of Similar Platforms

#### 4.1. Similar Platforms

The table below presents the main community platforms similar to or competing with OnePlace.

> 📋 **TABLE PLACEHOLDER — Overview of Similar Community Platforms**

| Platform | Description | Pricing Model | Monetisation |
|---|---|---|---|
| Skool | Gamified community and course platform for creators, with leaderboards and group discussions | $99/month (creator) — free for members | Member subscriptions, one-time course payments |
| Circle | All-in-one community platform with spaces, live streams, courses, and events | $49–$199/month (creator) | Paid memberships, subscriptions, one-time access |
| Mighty Networks | Community-driven platform integrating courses, events, and live video | $33–$99/month (creator) | Memberships, subscriptions, one-time purchases |
| Patreon | Creator patronage platform supporting tiered membership for fans | Free (8–12% revenue fee) | Tiered patron subscriptions |
| Discord | Real-time chat, voice, and community platform | Free + Nitro $9.99/month | Server boosts, paid role subscriptions (limited) |

*Table 1 — Overview of Similar Community Platforms*

#### 4.2. Comparison Between Platforms

The following comparison table highlights the features offered by each platform versus OnePlace.

> 📋 **TABLE PLACEHOLDER — Comparison: OnePlace vs Existing Platforms**

| Feature | OnePlace | Skool | Circle | Mighty Networks | Patreon |
|---|---|---|---|---|---|
| Community Feed | ✅ | ✅ | ✅ | ✅ | ❌ |
| Premium Content Gating | ✅ (post-level isPremium flag) | ✅ | ✅ | ✅ | ✅ (tier-based) |
| Multiple Pricing Models | ✅ (Free / Subscription / Freemium / One-time) | ❌ (subscription only) | ✅ | ✅ | ✅ (tiers only) |
| Integrated Payments | ✅ (mock in V0, Stripe in V1) | ✅ | ✅ | ✅ | ✅ |
| Member Management | ✅ | ✅ | ✅ | ✅ | ❌ |

*Table 2 — Comparison: OnePlace vs Existing Platforms*

---

## IV. Adopted Methodology

### 1. Design Methodology

For modelling and design, we used UML (Unified Modelling Language). UML is a standardised visual language composed of diagrams that give different views of a system: use-case diagrams to capture requirements from the actor's perspective, sequence diagrams to model dynamic interactions between system components, activity diagrams to represent workflows, and class diagrams to represent the data model. We produced these diagrams at each sprint to guide implementation and keep design aligned with the evolving backlog.

### 2. Work Methodology

To organise our work effectively and maintain focus throughout a self-directed project, we needed to choose a project management methodology. We evaluated classic (waterfall) and agile approaches before making our choice.

#### 2.1. Comparison Between Classic and Agile Approaches

The table below summarises the key differences between classic and agile project management.

> 📋 **TABLE PLACEHOLDER — Comparison: Classic vs Agile Methodologies**

| Project Element | Classic Methods | Agile Methods |
|---|---|---|
| Planning | Exhaustive upfront planning before any implementation begins | Iterative planning adapted at the start of each sprint |
| Documentation | Heavy, comprehensive documentation required at each phase | Minimal, just-enough documentation; working software is prioritised |
| Quality Control | Testing performed at the end of the project lifecycle | Continuous integration and testing throughout every iteration |
| Response to Change | High resistance; changes require costly renegotiation | Embraces change; backlog is reprioritised between sprints |
| Delivery | Single big-bang delivery at project end | Incremental releases delivering value at each sprint |
| Goal | Follow the plan as defined at the start | Maximise delivered value through continuous adaptation |

*Table 3 — Comparison: Classic vs Agile Methodologies (Overview)*

> 📋 **TABLE PLACEHOLDER — Comparison: Classic vs Agile Methodologies (Detailed)**

| Project Element | Classic Methods | Agile Methods |
|---|---|---|
| Planning | Requirements are fully frozen before design starts; any change requires a formal change request | A prioritised product backlog is maintained; scope is adjusted between sprints based on feedback and learning |
| Documentation | Detailed specifications, design documents, and test plans are mandatory deliverables | Only documentation that directly supports development and communication is produced; diagrams are created sprint by sprint |
| Quality Control | A dedicated testing phase follows development; bugs discovered late are expensive to fix | Each sprint produces a potentially shippable increment; defects are caught and fixed within the same sprint |
| Response to Change | Changes after baseline are formally resisted and incur cost and schedule impact | Change is expected and accommodated; new stories can be added to the backlog at any time |
| Delivery | The client sees a working product only at the end of the full development cycle | Stakeholders receive a working product increment at the end of every sprint |
| Goal | Deliver the system exactly as specified in the initial requirements document | Continuously deliver the highest-value features, adapting to evolving needs |

*Table 4 — Comparison: Classic vs Agile Methodologies (Detailed)*

#### 2.2. Agile Methodology

Agile project management is an iterative and collaborative approach that can accommodate initial requirements as well as evolving needs throughout the project lifecycle. The Agile Manifesto rests on four core values:

- Individuals and interactions over processes and tools.
- Working software over comprehensive documentation.
- Customer collaboration over contract negotiation.
- Responding to change over following a plan.

#### 2.3. Comparative Study Between Agile Frameworks

We compared Scrum and Extreme Programming (XP) to identify the most suitable framework for OnePlace.

> 📋 **TABLE PLACEHOLDER — Comparison: Scrum vs XP**

| Criteria | Scrum | Extreme Programming (XP) |
|---|---|---|
| Planning | Sprint planning session at the start of each 2–4 week sprint; sprint goal is fixed | Release planning followed by short iteration planning (1–2 weeks); scope is more fluid |
| Effort Estimation | Story points using Fibonacci scale (1, 2, 3, 5, 8, 13, 20) | Ideal days (how long a task would take with no interruptions) |
| Scope Change | No scope changes allowed once a sprint has started | Changes are permitted between iterations as long as the overall release plan is respected |
| Roles | Three defined roles: Product Owner, Scrum Master, Development Team | No prescribed roles; whole-team responsibility and pair programming are emphasized |
| Boards / Artifacts | Scrum board, product backlog, sprint backlog, burndown chart, definition of done | Story cards, planning game, continuous integration server, on-site customer |
| Key Characteristics | A framework for managing and controlling iterative, incremental software development; process-focused | A set of engineering practices (TDD, pair programming, CI, refactoring, simple design) aimed at improving software quality; technique-focused |

*Table 5 — Comparison: Scrum vs XP*

#### 2.4. Adopted Framework: Scrum

We chose the Scrum framework for the development of OnePlace because of its simplicity, transparency, and well-defined ceremonies. Scrum divides the project into short, time-boxed iterations called sprints (one to four weeks), at the end of each of which a potentially shippable product increment is delivered. This was particularly well suited to our self-directed context, where we needed regular checkpoints to validate our design decisions before committing to deeper implementation.

Key advantages for OnePlace: greater flexibility and reactivity to evolving product decisions; fast adaptation to change through short iterations (we migrated from MongoDB to PostgreSQL between sprints without disrupting the overall plan); a clear structure (Product Owner, Scrum Master, Dev Team) that maps cleanly to a two-person student team; and the ability to reprioritise the backlog between sprints as design decisions evolved. The Fibonacci complexity scale gave us a shared vocabulary for estimating user stories and managing realistic sprint capacity.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 1 — Scrum Process*

---

## V. Work Environment

### 1. Hardware Environment

OnePlace was developed using two laptops. The table below summarises their specifications.

> 📋 **TABLE PLACEHOLDER — Hardware Specifications**

| Spec | Bilel Jabrane | [Author 2 Full Name] |
|---|---|---|
| Machine | [fill in laptop model] | [fill in laptop model] |
| RAM | 16 GB | [fill in] |
| CPU | [fill in CPU model] | [fill in] |
| SSD | 512 GB | [fill in] |
| OS | Windows 11 Pro | [fill in] |

*Table 6 — Hardware Specifications of Development Machines*

### 2. Software Environment

#### Visual Studio Code

Visual Studio Code is a lightweight but powerful source-code editor available on Windows, macOS, and Linux. With built-in TypeScript and Node.js support, integrated Git source control, and the Claude Code extension integrated directly into the editor, it served as our primary IDE throughout the project. Extensions for Tailwind CSS IntelliSense, Prisma schema formatting, and ESLint further accelerated development.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure X — VS Code with Claude Code extension*

#### Postman

Postman is an API collaboration platform used to design, build, and test REST APIs. We used it throughout development to test every Express route — verifying request/response shapes, authentication headers, and error responses — before connecting the frontend. Collections were organised per feature module (Auth, Communities, Posts, Members).

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure X — Postman API testing*

#### Draw.io

Draw.io is a free diagramming application used to create UML diagrams, flowcharts, and architecture schemas. All use-case diagrams, sequence diagrams, activity diagrams, and class diagrams in this report were produced with Draw.io.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure X — Draw.io diagram editor*

### 3. Languages

#### TypeScript

TypeScript is an open-source, strongly-typed superset of JavaScript developed by Microsoft. It adds static type checking, interfaces, generics, and modern language features on top of JavaScript. We used TypeScript across the entire stack — both in the React + Vite frontend and the Node.js + Express backend — to catch bugs at compile time, improve code maintainability, and enable reliable refactoring as the codebase grew across four sprints.

#### HTML5 & Tailwind CSS

HTML5 provides the semantic structure of the web pages, while Tailwind CSS — a utility-first CSS framework — was used for styling all React components. Tailwind's design-token system (colours, spacing, border-radius) enforced visual consistency across the platform and enabled rapid UI development without leaving JSX. The dark/light theme is managed through CSS custom properties and Tailwind's class-based theming.

### 4. Frameworks

#### React + Vite (Frontend)

React is a declarative, component-based JavaScript library for building user interfaces, maintained by Meta. Vite is a fast modern build tool that significantly reduces development server startup time via native ES modules. Together they form the frontend foundation of OnePlace. We additionally used TanStack Query (React Query) for server-state caching and synchronisation, React Router v6 for client-side routing, and shadcn/ui for pre-built accessible UI components.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure X — React + Vite project structure*

#### Node.js + Express (Backend)

Node.js is an event-driven JavaScript runtime built on Chrome's V8 engine, designed for scalable network applications. Express is a minimal, unopinionated web framework for Node.js. We chose this combination for its large ecosystem, first-class TypeScript compatibility, and the team's prior familiarity with it. Business logic is cleanly separated from routing via a controller → service → Prisma layered architecture.

### 5. Runtime Environment

#### Node.js

Node.js serves as the backend runtime for OnePlace. All API routes, business logic, file upload presigning, email dispatch, and database interactions run inside a Node.js process managed by Express and deployed as a single modular monolith.

#### Neon (Serverless PostgreSQL)

Neon is a serverless PostgreSQL provider that offers branching, automatic scaling, and a generous free tier — ideal for a graduation project with variable traffic. All OnePlace data (users, communities, memberships, posts, comments, events, courses, lessons, payments, notifications, points) is stored in a Neon PostgreSQL database accessed via Prisma ORM. Prisma migrations keep the schema fully versioned and reproducible across environments.

### 6. Architecture

#### 6.1. Backend Architecture

OnePlace uses a modular monolith architecture on the backend. Business logic is cleanly separated from routing: thin Express controllers receive HTTP requests, validate inputs, and delegate to service files that contain all business logic. Errors are propagated uniformly via `next(err)` to a centralised error-handling middleware that maps `AppError` instances to appropriate HTTP status codes. This structure keeps controllers readable and services independently unit-testable.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 2 — Backend MVC / Layered Architecture Diagram*

#### 6.2. Overall System Architecture

The overall architecture of OnePlace is a classic three-tier web application: a React + Vite SPA communicates with a Node.js + Express REST API over HTTPS, which reads from and writes to a PostgreSQL database hosted on Neon via the Prisma ORM. Authentication is handled with custom JWT tokens signed with a secret and stored in httpOnly, Secure, SameSite=Strict cookies — preventing XSS token theft. File uploads bypass the server entirely: the frontend requests a presigned PUT URL from Cloudflare R2 via the backend, then uploads directly from the browser. Transactional emails are delivered via Nodemailer using Resend as the SMTP provider.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 3 — Overall System Architecture Diagram*

## Conclusion

In this chapter we introduced the OnePlace project — its origin as an independent student initiative, the problem it solves for content creators, and the landscape of existing platforms it aims to improve upon. We also presented the Scrum methodology and the technical stack (React + Vite, Node.js + Express + TypeScript, PostgreSQL + Prisma + Neon, JWT auth, Cloudflare R2, Nodemailer + Resend) that underpin the entire development. The next chapter dives into the detailed requirements analysis and design across four sprints.

---

# Chapter 2: Requirements Analysis & Design

## I. Requirements Analysis

### 1. Identification of Actors

The system involves four main actors:

- **Visitor** — a non-authenticated user who can browse public community listings and view community landing pages, but cannot join, post, or access content.
- **Member** — an authenticated user who has joined one or more communities. Access to premium content depends on their membership tier (FREE vs PAID) within a given community.
- **Creator (Community Admin)** — the user who created the community. Has full control over settings, posts, members, pricing model, events, courses, and moderation.
- **Super Admin (Platform)** — a platform-level administrator identified by a `SUPER_ADMIN` role flag, with visibility and management control over all communities on the platform.

### 2. Functional Requirements

**Creator:**
- Create and configure a community (name, description, cover image, icon, pricing model: Free / Subscription / Freemium / One-time).
- Publish posts (free or premium via `isPremium` flag), supporting TEXT, IMAGE, VIDEO, and POLL types.
- Create and manage courses with structured lessons (Classroom module).
- Create events with optional Daily.co video call room auto-creation.
- Manage members: view list, add manually by email, remove or ban.
- View analytics: member count, post count, membership distribution.
- Configure pricing model and price amount for the community.

**Member:**
- Register and log in to the platform.
- Browse and discover communities on the public discovery page.
- Join a community (flow depends on pricing model: instant for Free, mock payment for Subscription/One-time, free tier with optional upgrade for Freemium).
- Read free posts; access premium posts only if membership tier grants premium access.
- Comment on posts and receive notifications on new activity.
- Progress through courses (Classroom) and earn XP points.
- View the community event calendar and join video calls.
- Manage their subscription (cancel, view billing history).
- Update their profile (avatar, bio).

**Visitor:**
- Browse the public community discovery page.
- View a community's public landing page (About tab) before joining.
- Search communities by keyword.

**Super Admin:**
- List and inspect all communities on the platform.
- Delete or suspend a community.

### 3. Non-Functional Requirements

- **Security:** JWT tokens in httpOnly cookies; `authenticate` middleware on all protected routes; bcrypt password hashing (cost factor 10); Cloudflare R2 presigned URLs expire after 5 minutes; CORS restricted to the frontend origin.
- **Performance:** API responses under 300 ms for common CRUD operations; TanStack Query caching reduces redundant network requests on the frontend; 400 ms debounce on search inputs prevents request flooding.
- **Maintainability:** Thin controllers, business logic isolated in service files, consistent `next(err)` error handling, TypeScript throughout, Prisma migrations for schema versioning.
- **Scalability:** Stateless REST API (no server-side session); Neon serverless PostgreSQL scales automatically; Cloudflare R2 handles file storage without server involvement.
- **Reliability:** Graceful error handling with meaningful HTTP status codes via `AppError`; Prisma cascade deletes maintain referential integrity; transactional emails confirm all key membership lifecycle events.
- **Usability:** Clean, minimal UI using Tailwind CSS; sticky navigation header with breadcrumb back to community list; mobile-responsive layout; accessible components via shadcn/ui.

---

## II. Product Backlog

### 1. Relationship Between Theme, Feature, and User Story

The product backlog is organised hierarchically: Themes group related product areas → Features describe a specific capability → User Stories express the requirement from an actor's point of view → Sub-tasks are the concrete implementation work items estimated in hours within each sprint backlog.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 4 — Backlog Hierarchy Diagram*

### 2. Product Backlog Stories

The table below summarises the full product backlog. Complexity uses the Fibonacci scale: 1=trivial, 2=easy, 3=simple, 5–8=medium, 13=hard, 20=very hard.

> 📋 **TABLE PLACEHOLDER — Product Backlog**

| Theme | Feature | User Story | Priority | Complexity |
|---|---|---|---|---|
| Authentication | Registration | As a visitor, I want to create an account so I can access the platform | High | 3 |
| Authentication | Login | As a user, I want to log in with my email and password | High | 2 |
| Authentication | Password Reset | As a user, I want to reset my forgotten password via an email link | High | 3 |
| Authentication | Logout | As a user, I want to log out and have my session cleared | High | 1 |
| Authentication | Manual Member Add | As a creator, I want to add an existing user to my community by email | Medium | 3 |
| Community Management | Community Creation | As a creator, I want to create a community with a name, description, and pricing model | High | 5 |
| Community Management | Media Upload | As a creator, I want to upload a cover image and icon for my community | Medium | 5 |
| Community Management | Community Settings | As a creator, I want to edit my community settings at any time | High | 3 |
| Community Management | Community Deletion | As a creator, I want to permanently delete my community | Medium | 3 |
| Community Management | Analytics | As a creator, I want to view member count, post count, and membership distribution | Medium | 5 |
| Membership & Join | Free Join | As a member, I want to join a free community immediately without payment | High | 2 |
| Membership & Join | Subscription Join | As a member, I want to join a subscription-based community by completing a payment | High | 5 |
| Membership & Join | Freemium Join | As a member, I want to join a freemium community for free and optionally upgrade to premium | High | 5 |
| Membership & Join | One-time Join | As a member, I want to join a community with a single one-time payment | Medium | 5 |
| Membership & Join | Cancel Subscription | As a member, I want to cancel my active subscription | High | 3 |
| Feed & Posts | Create Post | As a creator or member, I want to publish a post (text, image, video, or poll) | High | 5 |
| Feed & Posts | Premium Gating | As a creator, I want to mark a post as premium so only premium members can read it | High | 2 |
| Feed & Posts | Pin Post | As a creator, I want to pin a post to keep it at the top of the feed | Medium | 2 |
| Feed & Posts | Browse Feed | As a member, I want to browse the community feed with posts ordered by recency | High | 3 |
| Feed & Posts | Search Posts | As a member, I want to search posts by keyword within a community | Medium | 3 |
| Feed & Posts | Comment on Post | As a member, I want to comment on a post and read other comments | High | 3 |
| Member Management | Member List | As a creator, I want to view all members with their tier and join date | High | 3 |
| Member Management | Remove Member | As a creator, I want to remove or ban a member from my community | High | 3 |
| Discovery & Search | Browse Communities | As a visitor or member, I want to browse all public communities in a grid | High | 3 |
| Discovery & Search | Search Communities | As a visitor or member, I want to search communities by keyword | High | 3 |
| Classroom | Course & Lessons | As a creator, I want to create a course with chapters and lessons; as a member I want to track progress | Medium | 13 |
| Platform Administration | Super Admin Dashboard | As a super admin, I want to list all communities and manage the platform | Medium | 5 |

*Table 7 — Product Backlog*

### 3. Global Use-Case Diagram

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 5 — Global Use-Case Diagram*

### 4. Sprint Planning

The project is divided into two releases and four sprints. Release 1 (Sprints 1–2) covers authentication, community creation, and the core post/membership flow. Release 2 (Sprints 3–4) covers advanced member management, subscriptions, analytics, notifications, classroom, leaderboard, calendar, and community discovery.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 6 — Sprint Planning Overview*

---

## RELEASE 1

### Sprint 1

Sprint 1 focuses on the identity module: user registration, login, logout, password reset via email, and the ability for a creator to add users manually to their community.

#### 1.1. Sprint Backlog

##### 1.1.1. Stories to Implement

> 📋 **TABLE PLACEHOLDER — Sprint 1 Backlog**

| ID | User Story | Task | Hours |
|---|---|---|---|
| US-01 | As a visitor, I want to create an account | Design User schema in Prisma; implement POST /auth/register with bcrypt hashing; build registration form with validation | 10 |
| US-02 | As a user, I want to log in | Implement POST /auth/login; generate JWT, set httpOnly cookie; build login form | 6 |
| US-03 | As a user, I want to reset my password via email | Generate reset token; send HTML email via Nodemailer + Resend; implement PUT /auth/reset-password; build forgot/reset forms | 8 |
| US-04 | As a user, I want to log out | Implement POST /auth/logout clearing the cookie; wire up sign-out button in UI | 2 |
| US-09 | As a creator, I want to add a member manually by email | Implement POST /communities/:id/members/invite; look up user by email; create Membership record; send confirmation email | 5 |

*Table 8 — Sprint 1 Backlog*

**Total Sprint 1: 31 hours**

#### 1.2. Use-Case Diagram

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 7 — Sprint 1 Use-Case Diagram*

#### 1.3. Sprint Overview

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 8 — Sprint 1 Overview*

#### 1.4. Wireframes

**Registration page** — allows a new user to create an account on OnePlace.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 9 — Wireframe: Registration Page*

**Login page** — allows a registered user to authenticate and access the platform.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 10 — Wireframe: Login Page*

**Creator Dashboard — User Management** — allows a creator to add, remove, and view users.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 11 — Wireframe: Creator Dashboard / User Management*

#### 1.5. Textual Use-Case Descriptions

##### 1.5.1. Use-Case: Sign Up

> 📋 **TABLE PLACEHOLDER — Use-case: "Sign Up"**

| Field | Description |
|---|---|
| Title | Sign Up |
| Actor(s) | Visitor |
| Goal | Create a new account on the platform by providing personal details, in order to access communities as a member or creator |
| Pre-condition | The visitor is not authenticated. They are on the /sign-up page. |
| Post-condition | A new User record is created in the database. The user is authenticated (JWT httpOnly cookie set) and redirected to /communities. A welcome email is sent. |
| Nominal Scenario | 1. Visitor navigates to /sign-up. 2. Visitor enters first name, last name, email address, and password. 3. System validates all fields: non-empty, valid email format, password ≥ 8 characters. 4. System checks that the email is not already registered. 5. System hashes the password using bcrypt (cost factor 10). 6. System creates the User record in the database. 7. System generates a JWT token and stores it in an httpOnly cookie. 8. System dispatches a welcome email. 9. User is redirected to /communities. |
| Alternative Scenario | The visitor already has an account — they click the "Log in" link on the registration page and are redirected to /sign-in. |
| Exception Scenario | The email address is already registered → system returns HTTP 409 Conflict and displays the inline error "An account with this email already exists." |

*Table 9 — Use-case: Sign Up*

##### 1.5.2. Use-Case: Log In

> 📋 **TABLE PLACEHOLDER — Use-case: "Log In"**

| Field | Description |
|---|---|
| Title | Log In |
| Actor(s) | Member / Creator / Super Admin |
| Goal | Authenticate on the platform using an email address and password to gain access to protected resources |
| Pre-condition | The user has a registered account. They are on the /sign-in page and are not currently authenticated. |
| Post-condition | The user is authenticated. A JWT token is stored in an httpOnly cookie. The user is redirected to /communities. |
| Nominal Scenario | 1. User navigates to /sign-in. 2. User enters their registered email address and password. 3. System retrieves the User record by email. 4. System verifies the submitted password against the stored bcrypt hash using bcrypt.compare(). 5. System generates a signed JWT token containing the user ID and role. 6. System stores the JWT in an httpOnly, Secure, SameSite=Strict cookie. 7. User is redirected to /communities. |
| Alternative Scenario | The user has forgotten their password — they click "Forgot password?" and are redirected to the /forgot-password page to initiate the reset flow. |
| Exception Scenario | The password does not match the stored hash → system returns HTTP 401 Unauthorized and displays "Invalid credentials." The user may retry up to the browser session limit. |

*Table 10 — Use-case: Log In*

##### 1.5.3. Use-Case: Creator Adds a Member Manually

> 📋 **TABLE PLACEHOLDER — Use-case: "Creator Adds a Member Manually"**

| Field | Description |
|---|---|
| Title | Creator Adds a Member Manually |
| Actor(s) | Creator (Community Admin) |
| Goal | Add an existing platform user to a community without requiring them to go through the standard join flow |
| Pre-condition | The creator is authenticated and is the creator of the target community. The target user already has a registered account on the platform. |
| Post-condition | A Membership record is created with status = ACTIVE and role = MEMBER for the target user in the community. A notification email is sent to the new member. |
| Nominal Scenario | 1. Creator navigates to the Members section of their community dashboard. 2. Creator clicks "Add Member" and enters the user's email address in the input field. 3. System looks up the User record by email. 4. System checks that the user is not already a member. 5. System creates a Membership record (communityId, userId, status=ACTIVE, role=MEMBER). 6. System dispatches a membership confirmation email to the new member. 7. The new member appears immediately in the member list. |
| Alternative Scenario | The target user is already a member of the community → system displays an inline warning "This user is already a member" and no duplicate membership is created. |
| Exception Scenario | No user found with the submitted email address → system returns HTTP 404 and displays "No account found with this email address." |

*Table 11 — Use-case: Creator Adds a Member Manually*

##### 1.5.4. Use-Case: Reset Password

> 📋 **TABLE PLACEHOLDER — Use-case: "Reset Password"**

| Field | Description |
|---|---|
| Title | Reset Password |
| Actor(s) | Member / Creator |
| Goal | Regain access to the account by resetting a forgotten password via a secure email link |
| Pre-condition | The user has a registered account. They do not know their current password. They are on the /forgot-password page. |
| Post-condition | The user's password is updated in the database with the new bcrypt hash. The reset token is invalidated. The user can log in with the new password. |
| Nominal Scenario | 1. User navigates to /forgot-password and enters their registered email address. 2. System generates a cryptographically secure reset token and stores it (hashed) in the database with a 1-hour expiry. 3. System dispatches an email containing a reset link (/reset-password?token=…). 4. User clicks the link and is taken to the /reset-password page. 5. User enters and confirms their new password. 6. System retrieves and verifies the token (not expired, matches stored hash). 7. System hashes the new password and updates the User record. 8. System deletes the reset token record. 9. User is redirected to /sign-in. |
| Alternative Scenario | The user remembers their password before completing the reset — they navigate back to /sign-in and log in normally. The unused token expires after 1 hour. |
| Exception Scenario | The reset link has expired or the token has already been used → system returns HTTP 400 Bad Request and displays "This reset link has expired or is invalid. Please request a new one." |

*Table 12 — Use-case: Reset Password*

#### 1.6. Sequence Diagrams

##### 1.6.1. Sequence Diagram: Log In

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 12 — Sequence Diagram: Log In*

##### 1.6.2. Sequence Diagram: Sign Up

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 13 — Sequence Diagram: Sign Up*

##### 1.6.3. Sequence Diagram: Reset Password

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 14 — Sequence Diagram: Reset Password*

---

### Sprint 2

Sprint 2 delivers the community management module and the content layer: creating and configuring a community, choosing a pricing model, uploading cover and icon images via Cloudflare R2, publishing posts (free and premium), and the member join flow across all pricing models.

#### 2.1. Sprint Backlog

##### 2.1.1. Stories to Implement

> 📋 **TABLE PLACEHOLDER — Sprint 2 Backlog**

| ID | User Story | Task | Hours |
|---|---|---|---|
| US-05 | As a creator, I want to create a community | Design Community schema in Prisma; implement POST /communities; build community creation form with name, description, and pricing model selector | 8 |
| US-06 | As a creator, I want to upload a cover image and icon | Implement GET /upload/presign; integrate Cloudflare R2 presigned PUT URLs; build image upload component with preview | 10 |
| US-07 | As a creator, I want to edit community settings | Implement PATCH /communities/:id; build Settings page (General, Pricing tabs) | 6 |
| US-10/11/12/13 | As a member, I want to join a community (all pricing models) | Implement POST /communities/:id/join; handle FREE (instant), SUBSCRIPTION/ONE_TIME (mock payment), FREEMIUM (free tier + upgrade modal) flows; build JoinModal and UpgradeModal | 12 |
| US-15 | As a creator, I want to create a post | Implement POST /communities/:id/posts; support TEXT, IMAGE, VIDEO, POLL types; build CreatePostModal with isPremium toggle | 7 |
| US-16 | As a creator, I want to mark a post as premium | Add isPremium field to Post model; wire toggle in create post form; enforce gating on post detail page | 3 |
| US-17 | As a creator, I want to pin a post | Add isPinned to Post model; implement PATCH /communities/:id/posts/:postId/pin; order feed by (isPinned DESC, createdAt DESC) | 2 |
| US-18 | As a member, I want to browse the community feed | Implement GET /communities/:id/posts; build Feed page with category tabs | 4 |

*Table 13 — Sprint 2 Backlog*

**Total Sprint 2: 52 hours**

#### 2.2. Use-Case Diagram

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 15 — Sprint 2 Use-Case Diagram*

#### 2.3. Sprint Overview

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 16 — Sprint 2 Overview*

#### 2.4. Wireframes

**Community Home Feed** — shows posts in a community, differentiating free and premium content.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 17 — Wireframe: Community Home Feed*

**Create / Edit Post** — allows a creator to write a post and toggle the `isPremium` flag.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 18 — Wireframe: Create / Edit Post*

**Browse Community (Member View)** — displays the community to a member or visitor, with premium content locked if not a premium member.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 19 — Wireframe: Browse Community (Member View)*

#### 2.5. Textual Use-Case Descriptions

##### 2.5.1. Use-Case: Join a Community

> 📋 **TABLE PLACEHOLDER — Use-case: "Join a Community"**

| Field | Description |
|---|---|
| Title | Join a Community |
| Actor(s) | Member |
| Goal | Join a community and gain appropriate access based on the community's pricing model |
| Pre-condition | The user is authenticated. They are not yet a member of the target community. They are viewing the community page or JoinModal. |
| Post-condition | A Membership record is created with the appropriate tier (FREE or PAID) and status (ACTIVE). A membership confirmation email is sent. |
| Nominal Scenario | (FREE model) 1. Member clicks "Join" on a free community. 2. System creates a Membership (tier=FREE, status=ACTIVE) immediately. 3. Member gains access to all free posts. (SUBSCRIPTION model) 1. Member clicks "Join." 2. JoinModal displays the monthly price. 3. Member proceeds through the mock payment flow. 4. System creates a Membership (tier=PAID, status=ACTIVE) and a Payment record. 5. A confirmation email is sent. |
| Alternative Scenario | (FREEMIUM model) Member joins with a free tier immediately; an UpgradeModal appears later if they attempt to access premium content, inviting them to upgrade to PAID tier. |
| Exception Scenario | Mock payment fails (simulated error) → system returns HTTP 402 and displays "Payment could not be processed. Please try again." No membership is created. |

*Table 14 — Use-case: Join a Community*

##### 2.5.2. Use-Case: Create a Post

> 📋 **TABLE PLACEHOLDER — Use-case: "Create a Post"**

| Field | Description |
|---|---|
| Title | Create a Post |
| Actor(s) | Creator / Member (with posting rights) |
| Goal | Publish a new post in the community feed to share content with members |
| Pre-condition | The user is authenticated and is an active member of the community. |
| Post-condition | A new Post record is created in the database and appears in the community feed. Active members with notification preferences receive a NEW_POST notification. |
| Nominal Scenario | 1. User clicks "New Post" in the feed. 2. CreatePostModal opens. 3. User selects a post type (TEXT, IMAGE, VIDEO, or POLL). 4. User enters a title and content (or poll options for POLL type). 5. Creator optionally toggles the `isPremium` flag. 6. User clicks "Publish." 7. System calls POST /communities/:id/posts. 8. Post record is saved with the correct type, isPremium value, and authorId. 9. Post appears at the top of the feed (below any pinned posts). 10. Notifications are dispatched to community members. |
| Alternative Scenario | User cancels — the CreatePostModal closes and no post is created. Draft content is not persisted. |
| Exception Scenario | Title or content field is empty → client-side validation prevents form submission and displays an inline error "Title and content are required." |

*Table 15 — Use-case: Create a Post*

##### 2.5.3. Use-Case: Access Premium Content

> 📋 **TABLE PLACEHOLDER — Use-case: "Access Premium Content"**

| Field | Description |
|---|---|
| Title | Access Premium Content |
| Actor(s) | Member |
| Goal | Read the full content of a post marked as isPremium = true |
| Pre-condition | The user is authenticated and is an active member of the community. The target post has isPremium = true. |
| Post-condition | If the member holds a premium membership tier, the full post content is rendered. Otherwise, a paywall or upgrade prompt is displayed. |
| Nominal Scenario | 1. Premium member (tier=PAID) clicks on a post with isPremium=true. 2. Post detail page calls GET /communities/:id/posts/:postId. 3. Backend verifies the member's tier. 4. Full post content and comments are returned. 5. Member reads the post. |
| Alternative Scenario | Member is on the FREE tier of a FREEMIUM community — the post content is blurred/hidden and the UpgradeModal appears with an upgrade prompt. |
| Exception Scenario | A non-member attempts to access a premium post directly via URL → backend returns HTTP 403 Forbidden and the frontend redirects the user to the community landing page. |

*Table 16 — Use-case: Access Premium Content*

##### 2.5.4. Use-Case: Browse the Community Feed

> 📋 **TABLE PLACEHOLDER — Use-case: "Browse the Community Feed"**

| Field | Description |
|---|---|
| Title | Browse the Community Feed |
| Actor(s) | Member / Creator |
| Goal | View all posts in a community, with pinned posts at the top, and optionally filter by category or search by keyword |
| Pre-condition | The user is authenticated and is an active member of the community. |
| Post-condition | Posts are displayed ordered by (isPinned DESC, createdAt DESC). The user can filter and search without a full page reload. |
| Nominal Scenario | 1. User navigates to /communities/:id/community. 2. Frontend calls GET /communities/:id/posts via TanStack Query. 3. Feed renders pinned posts first, then remaining posts sorted by createdAt DESC. 4. Category tabs appear dynamically if posts belong to multiple categories. 5. User optionally clicks a category tab to filter the visible posts. 6. User optionally types in the search input — after a 400 ms debounce the query is appended as ?q=keyword and the feed updates. |
| Alternative Scenario | No posts exist yet → an empty state card is displayed: "No posts yet. Be the first to post something." |
| Exception Scenario | Network error while fetching posts → TanStack Query retries up to 3 times; if all fail, an error toast "Failed to load posts" is shown and the user can manually refresh. |

*Table 17 — Use-case: Browse the Community Feed*

#### 2.6. Sequence Diagrams

##### 2.6.1. Sequence Diagram: Join a Community

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 20 — Sequence Diagram: Join a Community*

##### 2.6.2. Sequence Diagram: Create a Post

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 21 — Sequence Diagram: Create a Post*

##### 2.6.3. Sequence Diagram: Access Premium Content

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 22 — Sequence Diagram: Access Premium Content*

---

## RELEASE 2

### Sprint 3

Sprint 3 builds on the core flows by adding advanced member management, subscription cancellation, creator analytics, member profile pages, a notification system with five event types, and in-post search across the feed.

#### 3.1. Sprint Backlog

##### 3.1.1. Stories to Implement

> 📋 **TABLE PLACEHOLDER — Sprint 3 Backlog**

| ID | User Story | Task | Hours |
|---|---|---|---|
| US-08 | As a creator, I want to delete my community | Implement DELETE /communities/:id with Prisma cascade; build Danger Zone in Settings with confirm modal | 4 |
| US-19 | As a member, I want to search posts by keyword | Add ?q= param to GET /communities/:id/posts with Prisma case-insensitive OR filter; build debounced search input in Feed | 5 |
| US-20 | As a member, I want to comment on a post | Design Comment schema; implement POST/GET /communities/:id/posts/:postId/comments; build comment list and form on PostDetail page | 8 |
| US-21 | As a member, premium content is gated | Enforce isPremium check in post service; render locked state for non-premium members; wire UpgradeModal | 6 |
| US-22 | As a creator, I want to view my member list | Implement GET /communities/:id/members with tier and role; build Members page with status badges | 5 |
| US-23 | As a creator, I want to remove a member | Implement DELETE /communities/:id/members/:userId; build remove button with confirm modal | 4 |
| US-24 | As a creator, I want to view analytics | Implement GET /communities/:id/analytics aggregating member count, post count, membership tiers; build Analytics page | 8 |
| US-N | Notification system | Design Notification schema (5 types); trigger notifications on NEW_POST, NEW_COMMENT, MEMBER_JOINED, SUBSCRIPTION_EXPIRING, SUBSCRIPTION_EXPIRED; build notification bell and Notifications page | 8 |
| US-14 | As a member, I want to cancel my subscription | Implement PATCH /memberships/:id/cancel; build cancel button in My Communities; send cancellation email | 4 |
| US-P | Member profile page | Build /profile page with avatar upload, bio, community list, and activity; implement PATCH /users/me | 4 |

*Table 18 — Sprint 3 Backlog*

**Total Sprint 3: 56 hours**

#### 3.2. Use-Case Diagram

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 23 — Sprint 3 Use-Case Diagram*

#### 3.3. Class Diagram

The class diagram below reflects the data model at the end of Sprint 3, covering the Community, User, Membership, Post, Comment, Payment, and Notification entities as modelled in the Prisma schema.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 24 — Class Diagram (Sprint 3)*

#### 3.4. Wireframes

##### 3.4.1. Wireframe: Creator Dashboard — Summary

Displays key metrics for the creator: total members, active subscriptions, post count, and membership tier distribution.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 25 — Wireframe: Creator Dashboard — Summary*

##### 3.4.2. Wireframe: Member List

Shows all community members with their tier (FREE/PAID), join date, role, and available actions (remove).

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 26 — Wireframe: Member List*

##### 3.4.3. Wireframe: Community Settings

Allows the creator to edit community name, description, cover image, icon (via Cloudflare R2 upload), pricing model, and price amount across General and Pricing tabs. A Danger Zone section allows community deletion.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 27 — Wireframe: Community Settings*

##### 3.4.4. Wireframe: Subscription & Payments

Displays a member's active subscriptions, membership status, and a cancel-subscription button with payment history.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 28 — Wireframe: Subscription & Payments*

##### 3.4.5. Wireframe: Member Profile

Shows a member's personal information (avatar, bio), the communities they have joined, and a summary of their activity (posts created, comments written, XP points earned).

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 29 — Wireframe: Member Profile*

##### 3.4.6. Wireframe: Pricing Configuration

Allows the creator to select or change the community's pricing model (Free, Subscription, Freemium, One-time) and set the price amount. Displayed within the Settings → Pricing tab.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 30 — Wireframe: Pricing Configuration*

##### 3.4.7. Wireframe: Analytics

Displays summary cards showing total members, post count, and membership tier breakdown (Free vs Paid members) for the community creator's dashboard.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 31 — Wireframe: Analytics*

##### 3.4.8. Wireframes: Notifications

Shows the notification centre accessible via the bell icon in the navigation header, listing all unread and recent notifications with type-specific icons and timestamps.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 32 — Wireframe: Notifications (Creator View)*

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 33 — Wireframe: Notifications (Member View)*

#### 3.5. Textual Use-Case Descriptions

##### 3.5.1. Use-Case: Manage Members

> 📋 **TABLE PLACEHOLDER — Use-case: "Manage Members"**

| Field | Description |
|---|---|
| Title | Manage Members |
| Actor(s) | Creator (Community Admin) |
| Goal | View the list of community members and remove a member when necessary |
| Pre-condition | The creator is authenticated and is the creator or admin of the community. |
| Post-condition | If a removal is confirmed, the Membership record is deleted and the member loses access to the community. |
| Nominal Scenario | 1. Creator navigates to the Members tab of their community. 2. System calls GET /communities/:id/members and returns all members with their tier (FREE/PAID), role, and join date. 3. Creator reviews the list. 4. Creator clicks the "Remove" button next to a member. 5. A ConfirmModal appears: "Remove this member? They will lose access to the community." 6. Creator confirms. 7. System calls DELETE /communities/:id/members/:userId. 8. The Membership record is deleted. 9. The member disappears from the list immediately (TanStack Query cache invalidated). |
| Alternative Scenario | Creator clicks on a member's name to navigate to their profile page and view activity details without taking any moderation action. |
| Exception Scenario | Creator attempts to remove themselves (the community creator) → system returns HTTP 403 and displays "You cannot remove yourself as the community creator." |

*Table 19 — Use-case: Manage Members*

##### 3.5.2. Use-Case: Manage Subscription

> 📋 **TABLE PLACEHOLDER — Use-case: "Manage Subscription"**

| Field | Description |
|---|---|
| Title | Manage Subscription |
| Actor(s) | Member |
| Goal | View the details of an active subscription and cancel it if desired |
| Pre-condition | The member is authenticated and holds an active SUBSCRIPTION or ONE_TIME membership in a community. |
| Post-condition | The membership status is updated to CANCELLED. The member retains access until the end of the current billing period. A cancellation confirmation email is sent. |
| Nominal Scenario | 1. Member navigates to /profile → My Communities. 2. Member sees a list of their active memberships with tier, price, and status. 3. Member clicks "Cancel subscription" on an active subscription. 4. A ConfirmModal appears: "Cancel your subscription? You will retain access until the end of the current period." 5. Member confirms. 6. System calls PATCH /memberships/:id/cancel. 7. Membership status is updated to CANCELLED in the database. 8. A cancellation email is dispatched. 9. The subscription is shown as "Cancelled" in the UI. |
| Alternative Scenario | Member decides not to cancel — they close the modal without confirming. No changes are made. |
| Exception Scenario | The subscription has already been cancelled (e.g., the page was stale) → system returns HTTP 400 and displays "This subscription is already cancelled." |

*Table 20 — Use-case: Manage Subscription*

#### 3.6. Sequence Diagrams

##### 3.6.1. Sequence Diagram: Manage Members

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 34 — Sequence Diagram: Manage Members*

##### 3.6.2. Sequence Diagram: Cancel Subscription

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 35 — Sequence Diagram: Cancel Subscription*

---

### Sprint 4

Sprint 4 completes the platform with the Classroom module (courses and lessons with progress tracking), a community leaderboard, a community event calendar with Daily.co video integration, community discovery and search for visitors and members, and the Super Admin dashboard.

#### 4.1. Sprint Backlog

##### 4.1.1. Stories to Implement

> 📋 **TABLE PLACEHOLDER — Sprint 4 Backlog**

| ID | User Story | Task | Hours |
|---|---|---|---|
| US-25 | As a visitor or member, I want to browse all public communities | Implement GET /communities with optional ?q= filter; build Communities discovery page with grid layout | 6 |
| US-26 | As a visitor, I want to search communities by keyword | Add debounced search input on the discovery page; backend case-insensitive search on name + description | 4 |
| US-27 | As a super admin, I want to list all communities | Implement GET /admin/communities behind SUPER_ADMIN role guard; build Admin dashboard page | 6 |
| US-CL | As a creator, I want to create courses with lessons | Design Course, Lesson, LessonProgress schemas; implement course CRUD + lesson CRUD endpoints; build CourseEditor, CoursePage, LessonPanel UI | 16 |
| US-LB | As a member, I want to see a leaderboard | Design Point schema; trigger XP events on posts, comments, course completions; build Leaderboard page | 6 |
| US-CAL | As a member, I want to view community events | Design Event schema; implement event CRUD; integrate Daily.co auto room creation; build Calendar page with AddEventModal | 6 |

*Table 21 — Sprint 4 Backlog*

**Total Sprint 4: 44 hours**

#### 4.2. Use-Case Diagram

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 36 — Sprint 4 Use-Case Diagram*

#### 4.3. Class Diagram

The final class diagram reflects the complete Prisma schema at the end of Sprint 4, including all entity relationships: User, Community, Membership, Post, Comment, Course, Lesson, LessonProgress, Event, Payment, Notification, and Point.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 37 — Class Diagram (Sprint 4)*

#### 4.4. Wireframes

**Discover Communities** — displays a grid of public communities with a search input and pricing model filter badges.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 38 — Wireframe: Discover Communities*

**Search Results** — shows filtered community results matching a keyword, with empty state when no results are found.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 39 — Wireframe: Search Results*

**Public Landing Page** — the main marketing page of OnePlace describing the platform value proposition for visitors who are not yet registered.

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 40 — Wireframe: Public Landing Page*

#### 4.5. Textual Use-Case Descriptions

##### 4.5.1. Use-Case: Search Communities

> 📋 **TABLE PLACEHOLDER — Use-case: "Search Communities"**

| Field | Description |
|---|---|
| Title | Search Communities |
| Actor(s) | Visitor / Member |
| Goal | Find communities matching a search keyword on the platform discovery page |
| Pre-condition | The user is on the /communities discovery page. The search input is visible. |
| Post-condition | Communities whose name or description match the keyword are displayed in the results grid. |
| Nominal Scenario | 1. User types a keyword in the search input on the /communities page. 2. After a 400 ms debounce, the frontend appends ?q=keyword to GET /communities. 3. Backend performs a case-insensitive OR search on the community name and description fields using Prisma `contains` with `mode: insensitive`. 4. Matching communities are returned and rendered in the discovery grid. 5. Pricing model filter badges remain applicable on top of search results. |
| Alternative Scenario | The user clears the search input — the debounce fires with an empty string and the full community list is restored. |
| Exception Scenario | No communities match the keyword → the grid is replaced by the empty state: "No communities found. Try a different search term." |

*Table 22 — Use-case: Search Communities*

##### 4.5.2. Use-Case: Delete a Community

> 📋 **TABLE PLACEHOLDER — Use-case: "Delete a Community"**

| Field | Description |
|---|---|
| Title | Delete a Community |
| Actor(s) | Creator |
| Goal | Permanently delete a community and all associated data from the platform |
| Pre-condition | The creator is authenticated and is the creator of the target community. They are on the Community Settings page. |
| Post-condition | The community and all related records (memberships, posts, comments, payments, events, courses, notifications) are permanently deleted via Prisma cascade. The creator is redirected to /communities. |
| Nominal Scenario | 1. Creator navigates to Settings → General → Danger Zone. 2. Creator clicks "Delete Community." 3. A ConfirmModal appears requiring the creator to type the community name to confirm. 4. Creator types the name and clicks "Delete permanently." 5. System calls DELETE /communities/:id. 6. Prisma cascade delete removes all related records. 7. Creator is redirected to /communities. |
| Alternative Scenario | Creator decides not to delete — they close the modal or fail to type the correct community name. The delete button remains disabled. |
| Exception Scenario | A network failure occurs during the delete call → HTTP 500, the community is not deleted, and an error toast "Failed to delete community. Please try again." is shown. |

*Table 23 — Use-case: Delete a Community*

##### 4.5.3. Use-Case: Edit Community Settings

> 📋 **TABLE PLACEHOLDER — Use-case: "Edit Community Settings"**

| Field | Description |
|---|---|
| Title | Edit Community Settings |
| Actor(s) | Creator |
| Goal | Update the community's name, description, cover image, icon, or pricing configuration |
| Pre-condition | The creator is authenticated and is the creator of the community. They are on the Settings page. |
| Post-condition | The Community record is updated in the database. Changes are immediately reflected in the community header and sidebar. |
| Nominal Scenario | 1. Creator navigates to Community Settings → General tab. 2. Creator edits the community name and/or description. 3. Optionally, creator uploads a new cover image or icon: the frontend requests a presigned PUT URL from GET /upload/presign, uploads the file directly to Cloudflare R2, and receives the public URL. 4. Creator clicks "Save changes." 5. System calls PATCH /communities/:id with updated fields. 6. TanStack Query cache is invalidated and the updated community data is reflected across all pages using it. |
| Alternative Scenario | Creator navigates to the Pricing tab to change the pricing model (e.g., from FREE to SUBSCRIPTION) and set a new price amount, then saves. |
| Exception Scenario | A file upload to Cloudflare R2 fails (presigned URL request error or upload timeout) → an error toast is shown, the old image is retained, and the creator can retry the upload. |

*Table 24 — Use-case: Edit Community Settings*

##### 4.5.4. Use-Case: Super Admin — List All Communities

> 📋 **TABLE PLACEHOLDER — Use-case: "Super Admin — List All Communities"**

| Field | Description |
|---|---|
| Title | Super Admin — List All Communities |
| Actor(s) | Super Admin |
| Goal | View a comprehensive list of all communities on the platform with key metadata for platform governance |
| Pre-condition | The user is authenticated and their User record has the `isAdmin = true` flag in the database. |
| Post-condition | All communities are returned regardless of their privacy status, and the super admin can take management actions. |
| Nominal Scenario | 1. Super Admin navigates to /admin. 2. The `authenticate` middleware verifies the JWT. 3. The `requireAdmin` middleware checks `user.isAdmin === true`. 4. System calls GET /admin/communities. 5. All communities are returned with name, member count, pricing model, creator details, and creation date. 6. The admin dashboard renders the complete community list. 7. Admin can view details or take moderation actions. |
| Alternative Scenario | Admin clicks on a community name to navigate to that community's page and inspect its content and members in detail. |
| Exception Scenario | A non-admin user navigates to /admin → the `requireAdmin` middleware returns HTTP 403 Forbidden and the frontend redirects the user to /communities. |

*Table 25 — Use-case: Super Admin — List All Communities*

#### 4.6. Sequence Diagrams

##### 4.6.1. Sequence Diagram: Search Communities

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 41 — Sequence Diagram: Search Communities*

##### 4.6.2. Sequence Diagram: Delete a Community

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 42 — Sequence Diagram: Delete a Community*

##### 4.6.3. Sequence Diagram: Edit Community Settings

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 43 — Sequence Diagram: Edit Community Settings*

---

## III. Activity Diagrams

The following activity diagrams model the key workflows of the OnePlace platform, complementing the sequence diagrams by showing the decision points and parallel flows from a process perspective.

##### Activity Diagram: Sign Up (AD-01)

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 67 — Activity Diagram: Sign Up (AD-01)*

##### Activity Diagram: Join a Community (AD-02)

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 68 — Activity Diagram: Join a Community (AD-02)*

##### Activity Diagram: Create a Post (AD-03)

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 69 — Activity Diagram: Create a Post (AD-03)*

##### Activity Diagram: Manage Members (AD-04)

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 70 — Activity Diagram: Manage Members (AD-04)*

##### Activity Diagram: Community Discovery (AD-05)

> 📷 **SCREENSHOT PLACEHOLDER**
> *Figure 71 — Activity Diagram: Community Discovery (AD-05)*

---

## Conclusion

This chapter presented the full requirements analysis and design of OnePlace across four sprints and two releases. We identified the four system actors (Visitor, Member, Creator, Super Admin), listed functional and non-functional requirements, and built a product backlog of 27 user stories organised by theme. For each sprint we produced a sprint backlog with hourly estimates, a use-case diagram, wireframes, textual use-case descriptions with nominal/alternative/exception scenarios, and sequence diagrams. Activity diagrams were added to model the key process flows. The next chapter presents the resulting implementation.

---

# Chapter 3: Implementation

## Introduction

In this chapter we present the final implemented interfaces of OnePlace, organised by release. For each screen we provide a brief description of the feature it delivers and the key design decisions made during implementation. The full platform was built using React + Vite + TypeScript on the frontend and Node.js + Express + TypeScript on the backend, with PostgreSQL via Prisma ORM on Neon as the data store.

---

## Application Screens

### 1. Release 1

Release 1 delivers the authentication layer and the core community and post creation flow. The screens below demonstrate the complete user journey from registration through to content publication.

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 44 — Landing Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 45 — Login Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 46 — Registration Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 47 — Creator Dashboard — User Management*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 48 — Community Creation Form*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 49 — Community Home Feed (Creator View)*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 50 — Community Home Feed (Member View — Free Post)*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 51 — Create Post Form*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 52 — Premium Post Gating (locked for non-premium member)*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 53 — Join Community Flow — Free Model*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 54 — Join Community Flow — Subscription Model*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 55 — Post Detail Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 56 — User Profile Page*

### 2. Release 2

Release 2 adds member management, subscription handling, analytics, notifications, the Classroom module, community events calendar, leaderboard, and the community discovery and Super Admin features.

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 57 — Creator Dashboard — Summary & Analytics*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 58 — Member List Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 59 — Community Settings Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 60 — Pricing Configuration*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 61 — Member Profile Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 62 — Subscription & Payment History*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 63 — Notifications Centre*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 64 — Discover Communities Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 65 — Search Results Page*

> 📷 **SCREENSHOT PLACEHOLDER** — *Figure 66 — Super Admin — All Communities*

## Conclusion

This chapter demonstrated the implementation of OnePlace through the screens delivered across Release 1 and Release 2. The platform covers the full creator-to-member loop: community creation with four pricing models, content publishing with premium gating via the `isPremium` flag, membership management, structured courses with lesson progress tracking, a community event calendar with Daily.co video integration, an XP-based leaderboard, transactional email notifications, and community discovery with keyword search.

---

# General Conclusion

This report documents our End-of-Studies project: OnePlace, a Skool-inspired paid community platform for content creators. The project was entirely self-initiated — no company was involved. From the initial idea to a working V0, we designed and built the platform over one semester using the Scrum methodology, delivering value incrementally across four sprints and two releases.

OnePlace V0 delivers the complete creator-to-member loop: a creator signs up, creates a community with one of four pricing models (Free, Subscription, Freemium, or One-time payment), uploads a cover image and icon to Cloudflare R2, publishes free and premium posts, creates structured courses with lesson progress tracking, schedules events with optional Daily.co video rooms, and manages their members — while members discover communities, join based on the pricing model, consume content according to their membership tier, comment on posts, progress through courses to earn XP points visible on a leaderboard, and receive automated email notifications at every key lifecycle event.

A significant technical decision made midway through development was migrating the database layer from MongoDB (the initial choice) to PostgreSQL with Prisma ORM hosted on Neon. This migration was motivated by the complex relational nature of the membership, payment, and permission data at the heart of the platform. The Prisma schema, with its cascade delete rules and relational integrity, proved far better suited to OnePlace's data model than a document store. This decision was executed between sprints without disrupting the overall delivery plan — a testament to the value of Scrum's iterative structure.

This project gave us the opportunity to apply knowledge acquired throughout our degree and develop new expertise in full-stack TypeScript development (React + Vite, Node.js + Express, PostgreSQL + Prisma + Neon), JWT-based authentication, file upload architecture with presigned URLs, transactional email delivery, video call integration, agile project management, and end-to-end product design from idea to working software.

Looking ahead, several improvements are planned for V1: Stripe integration to replace the mock payment service; enforcement of the Basic / Pro community plan tiers with feature gating; real-time notifications via WebSockets; a mobile application; advanced creator analytics with time-series charts; and internationalisation (French/English) to broaden the platform's reach.

We hope that this report and the OnePlace platform demonstrate both our technical capabilities and our ability to take an original idea from concept to a complete, production-ready product.

---

# References & Webography

> ✏ *Fill in your references. Examples:*

- `[1]` React — https://react.dev `[Accessed: May 2026]`
- `[2]` Vite — https://vitejs.dev `[Accessed: May 2026]`
- `[3]` Node.js — https://nodejs.org `[Accessed: May 2026]`
- `[4]` Express — https://expressjs.com `[Accessed: May 2026]`
- `[5]` Prisma ORM — https://www.prisma.io `[Accessed: May 2026]`
- `[6]` Neon — https://neon.tech `[Accessed: May 2026]`
- `[7]` TypeScript — https://www.typescriptlang.org `[Accessed: May 2026]`
- `[8]` Tailwind CSS — https://tailwindcss.com `[Accessed: May 2026]`
- `[9]` Scrum Guide — https://www.scrum.org/resources/scrum-guide `[Accessed: May 2026]`
- `[10]` UML — https://www.uml.org `[Accessed: May 2026]`
- `[11]` JSON Web Tokens — https://jwt.io `[Accessed: May 2026]`
- `[12]` Skool — https://www.skool.com `[Accessed: May 2026]`
- `[13]` TanStack Query — https://tanstack.com/query `[Accessed: May 2026]`
- `[14]` Cloudflare R2 — https://developers.cloudflare.com/r2 `[Accessed: May 2026]`
- `[15]` Daily.co — https://www.daily.co `[Accessed: May 2026]`
- `[16]` Resend — https://resend.com `[Accessed: May 2026]`

---

# Summary

## Abstract (English)

This report presents OnePlace, a Skool-inspired paid community platform for content creators, developed as an End-of-Studies project. OnePlace enables creators to launch and manage private communities with four configurable pricing models (Free, Subscription, Freemium, One-time payment), publish free and premium posts gated by a post-level `isPremium` flag, create structured courses with lesson progress tracking, schedule community events with integrated Daily.co video rooms, and manage their members with a full moderation toolkit. The platform was built using React + Vite on the frontend, Node.js + Express + TypeScript on the backend, and PostgreSQL (via Prisma ORM on Neon) as the database, with JWT-based authentication stored in httpOnly cookies, file uploads via Cloudflare R2 presigned URLs, and transactional emails delivered through Nodemailer and Resend SMTP. Development followed the Scrum agile methodology across two releases and four sprints. A key architectural decision was migrating from MongoDB to PostgreSQL mid-project to better support the relational complexity of the membership and payment domain.

**Keywords:** community platform, creator economy, paid community, React, Node.js, TypeScript, PostgreSQL, Prisma, Scrum, Cloudflare R2.

## Résumé (Français)

Ce rapport présente OnePlace, une plateforme communautaire payante inspirée de Skool, destinée aux créateurs de contenu et développée dans le cadre d'un projet de fin d'études. OnePlace permet aux créateurs de lancer et gérer des communautés privées avec quatre modèles tarifaires configurables (Gratuit, Abonnement, Freemium, Paiement unique), de publier des posts gratuits et premium grâce à un flag `isPremium` au niveau du post, de créer des cours structurés avec suivi de progression par leçon, de planifier des événements communautaires avec intégration de salles vidéo Daily.co, et de gérer leurs membres avec un ensemble complet d'outils de modération. La plateforme a été construite avec React + Vite côté frontend, Node.js + Express + TypeScript côté backend, et PostgreSQL (via Prisma ORM sur Neon) comme base de données, avec une authentification JWT stockée dans des cookies httpOnly, des uploads de fichiers via des URLs présignées Cloudflare R2, et des emails transactionnels envoyés via Nodemailer et Resend SMTP. Le développement a suivi la méthodologie agile Scrum sur deux releases et quatre sprints. Une décision architecturale clé a été la migration de MongoDB vers PostgreSQL en cours de projet, afin de mieux gérer la complexité relationnelle du domaine des adhésions et des paiements.

**Mots-clés :** plateforme communautaire, économie des créateurs, communauté payante, React, Node.js, TypeScript, PostgreSQL, Prisma, Scrum, Cloudflare R2.
