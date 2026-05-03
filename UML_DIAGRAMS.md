# OnePlace — UML Diagrams

> `[ ]` pending · `[x]` done

---

## Use Case Diagrams


### UC-01 — Global Platform Overview

@startuml Global Platform Overview
left to right direction
skinparam packageStyle rectangle

actor Guest
actor Member
actor Creator
actor "Community Admin" as CAdmin
actor "Platform Moderator" as PMod

rectangle "OnePlace Platform" {
  usecase "Browse Communities" as UC_Browse
  usecase "Register" as UC_Register
  usecase "Login" as UC_Login

  usecase "Join Community" as UC_Join
  usecase "View Feed" as UC_Feed
  usecase "View Courses" as UC_Courses
  usecase "Track Progress" as UC_Progress
  usecase "Create Post" as UC_Post
  usecase "Comment" as UC_Comment
  usecase "Manage Profile" as UC_Profile

  usecase "Create Community" as UC_CreateCom
  usecase "Configure Pricing" as UC_Pricing
  usecase "Manage Members" as UC_Members
  usecase "Publish Courses" as UC_PublishCourse
  usecase "View Community Analytics" as UC_Analytics

  usecase "Moderate Posts" as UC_ModPosts
  usecase "Ban Members" as UC_Ban
  usecase "Manage Settings" as UC_Settings

  usecase "Suspend Users" as UC_SuspendUser
  usecase "Suspend Communities" as UC_SuspendCom
  usecase "View Platform Analytics" as UC_PlatformAnalytics
}

Guest --> UC_Browse
Guest --> UC_Register
Guest --> UC_Login

Member --|> Guest
Member --> UC_Join
Member --> UC_Feed
Member --> UC_Courses
Member --> UC_Progress
Member --> UC_Post
Member --> UC_Comment
Member --> UC_Profile

Creator --|> Member
Creator --> UC_CreateCom
Creator --> UC_Pricing
Creator --> UC_Members
Creator --> UC_PublishCourse
Creator --> UC_Analytics

CAdmin --|> Member
CAdmin --> UC_ModPosts
CAdmin --> UC_Ban
CAdmin --> UC_Settings

PMod --> UC_SuspendUser
PMod --> UC_SuspendCom
PMod --> UC_PlatformAnalytics
@enduml

---

### UC-02 — Authentication

@startuml Authentication
left to right direction

actor Guest
actor Member

rectangle "Authentication" {
  usecase "Register" as UC_Register
  usecase "Verify Email" as UC_Verify
  usecase "Login" as UC_Login
  usecase "Logout" as UC_Logout
  usecase "Forgot Password" as UC_Forgot
  usecase "Reset Password" as UC_Reset
}

Guest --> UC_Register
Guest --> UC_Login
Guest --> UC_Forgot

UC_Register ..> UC_Verify : <<include>>
UC_Forgot ..> UC_Reset : <<include>>

Member --|> Guest
Member --> UC_Logout
@enduml

---

### UC-03 — Community Management

@startuml Community Management
left to right direction

actor Creator
actor "Community Admin" as CAdmin

rectangle "Community Management" {
  usecase "Create Community" as UC_Create
  usecase "Update Community Info" as UC_Update
  usecase "Delete Community" as UC_Delete
  usecase "Configure Pricing Model" as UC_Pricing
  usecase "Set Subscription Price" as UC_SubPrice
  usecase "Set One-Time Price" as UC_OTPrice
  usecase "Set Freemium Upgrade Price" as UC_FreePrice
  usecase "Upgrade Platform Plan" as UC_PlanUpgrade
  usecase "Change Cover / Icon" as UC_Media
}

Creator --> UC_Create
Creator --> UC_Update
Creator --> UC_Delete
Creator --> UC_Pricing
Creator --> UC_PlanUpgrade
Creator --> UC_Media

CAdmin --> UC_Update
CAdmin --> UC_Media

UC_Pricing ..> UC_SubPrice : <<extend>>
UC_Pricing ..> UC_OTPrice : <<extend>>
UC_Pricing ..> UC_FreePrice : <<extend>>
@enduml

---

### UC-04 — Membership & Subscription

@startuml Membership and Subscription
left to right direction

actor Member
actor Creator

rectangle "Membership & Subscription" {
  usecase "Join Free Community" as UC_JoinFree
  usecase "Join Subscription Community" as UC_JoinSub
  usecase "Join One-Time Community" as UC_JoinOT
  usecase "Join Freemium Community" as UC_JoinFreemium
  usecase "Upgrade to Paid Tier" as UC_Upgrade
  usecase "Renew Subscription" as UC_Renew
  usecase "Leave Community" as UC_Leave
  usecase "View My Memberships" as UC_ViewMem
  usecase "Process Payment" as UC_Payment
}

Member --> UC_JoinFree
Member --> UC_JoinSub
Member --> UC_JoinOT
Member --> UC_JoinFreemium
Member --> UC_Upgrade
Member --> UC_Renew
Member --> UC_Leave
Member --> UC_ViewMem

Creator --> UC_ViewMem

UC_JoinSub ..> UC_Payment : <<include>>
UC_JoinOT ..> UC_Payment : <<include>>
UC_Upgrade ..> UC_Payment : <<include>>
UC_Renew ..> UC_Payment : <<include>>
@enduml

---

### UC-05 — Feed

@startuml Feed
left to right direction

actor Member
actor Creator
actor "Community Admin" as CAdmin

rectangle "Feed" {
  usecase "View Feed" as UC_View
  usecase "Filter by Category" as UC_Filter
  usecase "Create Post" as UC_CreatePost
  usecase "Delete Own Post" as UC_DeletePost
  usecase "Create Comment" as UC_Comment
  usecase "Delete Own Comment" as UC_DeleteComment
  usecase "Pin Post" as UC_Pin
  usecase "Delete Any Post" as UC_DeleteAny
  usecase "Delete Any Comment" as UC_DeleteAnyC
}

Member --> UC_View
Member --> UC_Filter
Member --> UC_CreatePost
Member --> UC_DeletePost
Member --> UC_Comment
Member --> UC_DeleteComment

Creator --|> Member
Creator --> UC_Pin
Creator --> UC_DeleteAny
Creator --> UC_DeleteAnyC

CAdmin --|> Member
CAdmin --> UC_Pin
CAdmin --> UC_DeleteAny
CAdmin --> UC_DeleteAnyC
@enduml

---

### UC-06 — Classroom

@startuml Classroom
left to right direction

actor Member
actor Creator
actor "Community Admin" as CAdmin

rectangle "Classroom" {
  usecase "Browse Courses" as UC_Browse
  usecase "Access Lesson" as UC_Lesson
  usecase "Track Progress" as UC_Progress
  usecase "Purchase Course" as UC_Purchase
  usecase "Create Course" as UC_Create
  usecase "Add Section" as UC_Section
  usecase "Add Lesson" as UC_AddLesson
  usecase "Upload Video / Attachment" as UC_Upload
  usecase "Publish Course" as UC_Publish
  usecase "Set Course Access Type" as UC_Access
}

Member --> UC_Browse
Member --> UC_Lesson
Member --> UC_Progress
Member --> UC_Purchase

Creator --|> Member
Creator --> UC_Create
Creator --> UC_Section
Creator --> UC_AddLesson
Creator --> UC_Upload
Creator --> UC_Publish
Creator --> UC_Access

CAdmin --|> Member
CAdmin --> UC_Create
CAdmin --> UC_Section
CAdmin --> UC_AddLesson
CAdmin --> UC_Upload

UC_Create ..> UC_Section : <<include>>
UC_Section ..> UC_AddLesson : <<include>>
UC_AddLesson ..> UC_Upload : <<extend>>
@enduml

---

### UC-07 — Member Management

@startuml Member Management
left to right direction

actor Creator
actor "Community Admin" as CAdmin

rectangle "Member Management" {
  usecase "List Members" as UC_List
  usecase "Search Members" as UC_Search
  usecase "View Member Profile" as UC_View
  usecase "Ban Member" as UC_Ban
  usecase "Unban Member" as UC_Unban
  usecase "Promote to Admin" as UC_Promote
  usecase "Demote Admin" as UC_Demote
  usecase "Export Members CSV" as UC_Export
}

Creator --> UC_List
Creator --> UC_Search
Creator --> UC_View
Creator --> UC_Ban
Creator --> UC_Unban
Creator --> UC_Promote
Creator --> UC_Demote
Creator --> UC_Export

CAdmin --> UC_List
CAdmin --> UC_Search
CAdmin --> UC_View
CAdmin --> UC_Ban
CAdmin --> UC_Unban
@enduml

---

### UC-08 — Platform Administration

@startuml Platform Administration
left to right direction

actor "Platform Moderator" as PMod

rectangle "Platform Administration" {
  usecase "View All Users" as UC_Users
  usecase "Suspend User" as UC_SuspendUser
  usecase "Unsuspend User" as UC_UnsuspendUser
  usecase "View All Communities" as UC_Communities
  usecase "Suspend Community" as UC_SuspendCom
  usecase "Unsuspend Community" as UC_UnsuspendCom
  usecase "View Platform Analytics" as UC_Analytics
  usecase "View All Memberships" as UC_Memberships
}

PMod --> UC_Users
PMod --> UC_SuspendUser
PMod --> UC_UnsuspendUser
PMod --> UC_Communities
PMod --> UC_SuspendCom
PMod --> UC_UnsuspendCom
PMod --> UC_Analytics
PMod --> UC_Memberships
@enduml

---

## Class Diagram


@startuml Full Domain Model
skinparam classAttributeIconSize 0
skinparam class {
  BackgroundColor #FFFFFF
  BorderColor #555555
  HeaderBackgroundColor #E2ECF8
  FontSize 11
}
skinparam package {
  BackgroundColor #F8F8F8
  BorderColor #999999
  FontSize 12
  FontStyle bold
}
skinparam ArrowColor #444444
hide circle

' ==================== IDENTITY ====================
package "Identity" {
  class User {
    firstname : String
    lastname : String
    email : String
    password : String
    role : user | moderator
    isSuspended : Boolean
    isVerified : Boolean
    lastLogin : DateTime?
  }
}

' ==================== COMMUNITY ====================
package "Community" {
  class Community {
    name : String
    description : String?
    coverUrl : String?
    iconUrl : String?
    isPrivate : Boolean
    platformPlan : BASIC | PRO
    pricingModel : FREE | SUBSCRIPTION | FREEMIUM | ONE_TIME
  }

  class CommunityPricing {
    currency : String
    monthlyPrice : Decimal?
    yearlyPrice : Decimal?
    oneTimePrice : Decimal?
    upgradePrice : Decimal?
  }

  class Membership {
    role : creator | admin | member
    status : ACTIVE | CANCELLED | EXPIRED | BANNED
    membershipTier : FREE | PAID
    pricingModelAtJoin : PricingModel
    joinedAt : DateTime
  }

  class Subscription {
    billingInterval : MONTHLY | YEARLY | null
    subscriptionStart : DateTime
    subscriptionEnd : DateTime?
    pricePaid : Decimal
    paymentStatus : PENDING | SUCCESS | FAILED
    externalId : String?
  }
}

' ==================== SOCIAL ====================
package "Social" {
  class Post {
    title : String
    content : String
    type : TEXT | IMAGE | VIDEO
    category : String?
    isPinned : Boolean
  }

  class Comment {
    content : String
  }
}

' ==================== CLASSROOM ====================
package "Classroom" {
  class Course {
    title : String
    description : String?
    thumbnail : String?
    accessType : OPEN | BUY_NOW | TIME_UNLOCK | PRIVATE | LEVEL_UNLOCK
    unlockAfterDays : Int?
    price : Decimal?
    order : Int
    isPublished : Boolean
  }

  class CoursePurchase {
    pricePaid : Decimal
  }

  class Section {
    title : String
    order : Int
  }

  class Lesson {
    title : String
    videoUrl : String?
    content : String?
    transcript : String?
    order : Int
    duration : Int?
    isPublished : Boolean
  }

  class LessonAttachment {
    name : String
    url : String
    type : IMAGE | PDF | FILE | LINK
  }

  class LessonProgress {
    completedAt : DateTime?
    videoPosition : Int?
  }
}

' ==================== ENGAGEMENT ====================
package "Engagement" {
  class Event {
    title : String
    location : String?
    startAt : DateTime
    duration : Int?
    timezone : String
    isRecurring : Boolean
    accessType : ALL_MEMBERS | PAID_MEMBERS
    emailReminder : Boolean
  }

  class Notification {
    type : NEW_COMMENT | NEW_POST | MEMBER_JOINED | SUBSCRIPTION_EXPIRING | SUBSCRIPTION_EXPIRED
    title : String
    body : String?
    link : String?
    isRead : Boolean
  }

  class UserPoints {
    action : MEMBERSHIP_JOINED | POST_CREATED | COMMENT_CREATED | LESSON_COMPLETED
    points : Int
  }
}

' ==================== RELATIONSHIPS ====================

' Identity -> Community
User "1" *-- "0..*" Community     : creates
User "1" *-- "0..*" Membership    : has
User "1" *-- "0..*" Notification  : receives
User "1" *-- "0..*" UserPoints    : earns

' Identity -> Social
User "1" *-- "0..*" Post          : authors
User "1" *-- "0..*" Comment       : authors

' Identity -> Classroom
User "1" *-- "0..*" CoursePurchase : makes
User "1" *-- "0..*" LessonProgress : tracks

' Identity -> Engagement
User "1" *-- "0..*" Event         : creates

' Community internals
Community "1" *-- "0..1" CommunityPricing : has
Community "1" *-- "0..*" Membership       : has
Membership "1" *-- "0..*" Subscription    : has

' Community -> Social
Community "1" *-- "0..*" Post     : contains

' Community -> Classroom
Community "1" *-- "0..*" Course   : has

' Community -> Engagement
Community "1" *-- "0..*" Event    : hosts
Community "1" *-- "0..*" UserPoints : tracks

' Social internals
Post "1" *-- "0..*" Comment : has

' Classroom internals
Course    "1" *-- "0..*" Section         : contains
Course    "1" *-- "0..*" CoursePurchase  : sold via
Section   "1" *-- "0..*" Lesson         : contains
Lesson    "1" *-- "0..*" LessonAttachment : has
Lesson    "1" *-- "0..*" LessonProgress  : tracked by
@enduml

---

## Sequence Diagrams

### SD-01 — Sign Up & Email Verification

@startuml Sign Up and Email Verification
actor Guest
participant "Auth Controller" as AC
participant "Auth Service" as AS
participant "Email Service" as ES
database DB

Guest -> AC : POST /auth/register\n{ firstname, lastname, email, password }
AC -> AS : register(data)
AS -> DB : User.findUnique(email)
DB --> AS : null (not taken)
AS -> AS : hash password\ngenerate verificationToken (24h TTL)
AS -> DB : User.create({ isVerified: false, verificationToken })
DB --> AS : User
AS -> ES : sendVerificationEmail(user, token)
ES --> AS : ok
AS --> AC : { message: "Verification email sent" }
AC --> Guest : 201 Created

Guest -> Guest : clicks link in email
Guest -> AC : GET /auth/verify-email?token=...
AC -> AS : verifyEmail(token)
AS -> DB : User.findFirst({ verificationToken: token })
DB --> AS : User
AS -> AS : check token expiry
alt token expired
  AS --> AC : 400 Bad Request "Token expired"
  AC --> Guest : 400
else token valid
  AS -> DB : User.update({ isVerified: true, verificationToken: null })
  DB --> AS : UpdatedUser
  AS -> ES : sendWelcomeEmail(user)
  ES --> AS : ok
  AS --> AC : { message: "Email verified" }
  AC --> Guest : 200 OK
end
@enduml

---

### SD-02 — Password Reset Flow

@startuml Password Reset Flow
actor Member
participant "Auth Controller" as AC
participant "Auth Service" as AS
participant "Email Service" as ES
database DB

Member -> AC : POST /auth/forgot-password\n{ email }
AC -> AS : forgotPassword(email)
AS -> DB : User.findUnique(email)
DB --> AS : User
AS -> AS : generate resetPasswordToken\nset expiresAt = now + 1h
AS -> DB : User.update({ resetPasswordToken, resetPasswordExpiresAt })
DB --> AS : ok
AS -> ES : sendPasswordResetEmail(user, token)
ES --> AS : ok
AS --> AC : { message: "Reset email sent" }
AC --> Member : 200 OK

Member -> Member : clicks link in email
Member -> AC : POST /auth/reset-password\n{ token, newPassword }
AC -> AS : resetPassword(token, newPassword)
AS -> DB : User.findFirst({ resetPasswordToken: token })
DB --> AS : User
AS -> AS : check token expiry
alt token expired
  AS --> AC : 400 "Token expired"
  AC --> Member : 400
else token valid
  AS -> AS : hash new password
  AS -> DB : User.update({ password, resetPasswordToken: null,\nresetPasswordExpiresAt: null })
  DB --> AS : ok
  AS --> AC : { message: "Password updated" }
  AC --> Member : 200 OK
end
@enduml

---

### SD-03 — Join a SUBSCRIPTION Community

@startuml Join a SUBSCRIPTION Community
actor Member
participant "Community Controller" as CC
participant "Membership Service" as MS
participant "Payment Service" as PS
participant "Email Service" as ES
database DB

Member -> CC : POST /communities/:id/join\n{ billingInterval: MONTHLY }
CC -> MS : joinCommunity(userId, communityId, opts)
MS -> DB : Community.findUnique(communityId) + CommunityPricing
DB --> MS : Community (pricingModel: SUBSCRIPTION)
MS -> DB : Membership.findFirst(userId, communityId)
DB --> MS : null (not yet member)
MS -> PS : createPaymentIntent(price, currency)
PS --> MS : { externalId, clientSecret }
MS -> DB : Membership.create({ userId, communityId,\nrole: member, membershipTier: PAID })
DB --> MS : Membership
MS -> DB : Subscription.create({ membershipId, externalId,\nbillingInterval, pricePaid, paymentStatus: PENDING })
DB --> MS : Subscription
MS -> PS : confirmPayment(externalId)
PS --> MS : { status: SUCCESS }
MS -> DB : Subscription.update({ paymentStatus: SUCCESS,\nsubscriptionEnd: now + 1 month })
DB --> MS : ok
MS -> ES : sendMembershipConfirmation(user, community)
ES --> MS : ok
MS --> CC : { membership, subscription }
CC --> Member : 201 Created
@enduml

---

### SD-04 — Join a FREEMIUM Community + Upgrade

@startuml Join a FREEMIUM Community and Upgrade
actor Member
participant "Community Controller" as CC
participant "Access Middleware" as AM
participant "Membership Service" as MS
database DB

== Join Free Tier ==
Member -> CC : POST /communities/:id/join
CC -> MS : joinCommunity(userId, communityId)
MS -> DB : Community.findUnique (pricingModel: FREEMIUM)
DB --> MS : Community
MS -> DB : Membership.create({ membershipTier: FREE, status: ACTIVE })
DB --> MS : Membership
MS --> CC : { membership }
CC --> Member : 201 Created (free tier)

== Member hits locked content ==
Member -> AM : GET /communities/:id/courses/:courseId
AM -> DB : Membership.findFirst(userId, communityId)
DB --> AM : Membership (tier: FREE)
AM -> AM : course requires PAID tier
AM --> Member : 403 Forbidden { reason: "Upgrade required" }

== Upgrade to Paid Tier ==
Member -> CC : POST /communities/:id/upgrade { payment details }
CC -> MS : upgradeMembership(userId, communityId, paymentData)
MS -> DB : Membership.findFirst(userId, communityId)
DB --> MS : Membership (tier: FREE)
MS -> DB : Subscription.create({ pricePaid: upgradePrice,\npaymentStatus: SUCCESS })
DB --> MS : Subscription
MS -> DB : Membership.update({ membershipTier: PAID })
DB --> MS : ok
MS --> CC : { membership }
CC --> Member : 200 OK (PAID tier)
@enduml

---

### SD-05 — Subscription Expiry & Renewal

@startuml Subscription Expiry and Renewal
participant "Expiry Job\n(hourly cron)" as Job
participant "Membership Service" as MS
participant "Email Service" as ES
actor Member
database DB

== Detect and mark expired ==
Job -> MS : checkExpiredSubscriptions()
MS -> DB : Subscription.findMany(\n  subscriptionEnd <= now\n  paymentStatus = SUCCESS\n  membership.status = ACTIVE)
DB --> MS : [expiredSubscriptions]
loop for each expired subscription
  MS -> DB : Membership.update({ status: EXPIRED, membershipTier: FREE })
  MS -> ES : sendExpiryNotification(user, community)
  ES --> MS : ok
end
MS --> Job : { expired: N }

== Upcoming renewal reminders ==
Job -> MS : checkUpcomingExpirations()
MS -> DB : Subscription.findMany(\n  subscriptionEnd BETWEEN now AND now+3days\n  paymentStatus = SUCCESS\n  membership.status = ACTIVE)
DB --> MS : [upcomingExpirations]
loop for each upcoming expiration
  MS -> ES : sendRenewalReminder(user, community, expiresAt)
  ES --> MS : ok
end

== Member renews ==
Member -> MS : POST /memberships/:id/renew { billingInterval }
MS -> DB : Membership.findUnique + last Subscription
DB --> MS : Membership + Subscription
MS -> DB : Subscription.create({ pricePaid,\n  subscriptionEnd: now + interval,\n  paymentStatus: SUCCESS })
DB --> MS : Subscription
MS -> DB : Membership.update({ status: ACTIVE, membershipTier: PAID })
DB --> MS : ok
MS --> Member : 201 Renewed
@enduml

---

### SD-06 — Access a Lesson (middleware chain)

@startuml Access a Lesson
actor Member
participant "Auth Middleware" as AM
participant "Access Middleware" as ACM
participant "Course Controller" as CC
database DB

Member -> AM : GET /communities/:cId/courses/:courseId/lessons/:lessonId

AM -> AM : verify JWT
alt invalid or missing token
  AM --> Member : 401 Unauthorized
else valid token
  AM -> AM : attach user to request
  AM -> ACM : next()
end

ACM -> DB : Membership.findFirst(userId, communityId)
DB --> ACM : Membership
alt no active membership
  ACM --> Member : 403 "Not a member"
else active membership
  ACM -> DB : Course.findUnique(courseId)
  DB --> ACM : Course { accessType }

  alt OPEN
    ACM -> CC : next()
  else PRIVATE
    alt role = creator or admin
      ACM -> CC : next()
    else
      ACM --> Member : 403 "Private course"
    end
  else TIME_UNLOCK
    ACM -> ACM : joinedAt + unlockAfterDays <= today?
    alt unlocked
      ACM -> CC : next()
    else
      ACM --> Member : 403 "Not yet unlocked"
    end
  else BUY_NOW
    ACM -> DB : CoursePurchase.findFirst(userId, courseId)
    DB --> ACM : purchase or null
    alt purchased
      ACM -> CC : next()
    else
      ACM --> Member : 403 "Purchase required"
    end
  else LEVEL_UNLOCK
    ACM -> DB : UserPoints.aggregate(userId, communityId)
    DB --> ACM : totalPoints
    alt sufficient points
      ACM -> CC : next()
    else
      ACM --> Member : 403 "Insufficient points"
    end
  end
end

CC -> DB : Lesson.findUnique(lessonId) + attachments
DB --> CC : Lesson
CC -> DB : LessonProgress.upsert(userId, lessonId)
DB --> CC : ok
CC --> Member : 200 OK { lesson }
@enduml

---

### SD-07 — Presigned File Upload

@startuml Presigned File Upload
actor Member
participant "Upload Controller" as UC
participant "Upload Service" as US
participant "S3 / R2" as S3

Member -> UC : POST /upload/presign\n{ filename, contentType, folder }
UC -> US : generatePresignedUrl(filename, contentType, folder)
US -> US : build unique key (uuid + filename)
US -> S3 : createPresignedPutUrl(key, contentType, ttl: 300s)
S3 --> US : presignedUrl
US --> UC : { presignedUrl, key, cdnUrl }
UC --> Member : 200 OK { presignedUrl, key, cdnUrl }

Member -> S3 : PUT presignedUrl (binary, Content-Type header)
S3 --> Member : 200 OK

note over Member
  Client now holds the cdnUrl.
  It saves it to the relevant entity
  (course thumbnail, lesson video, etc.)
end note

Member -> UC : PATCH /courses/:id { thumbnail: cdnUrl }
UC --> Member : 200 OK (entity updated)
@enduml

---

### SD-08 — Create Post & Comment

@startuml Create Post and Comment
actor "Member A" as MA
actor "Member B" as MB
participant "Post Controller" as PC
participant "Post Service" as PS
database DB

== Create Post ==
MA -> PC : POST /communities/:id/posts\n{ title, content, type, category }
PC -> PS : createPost(authorId, communityId, data)
PS -> DB : Membership.findFirst(userId, communityId)
DB --> PS : Membership (ACTIVE)
PS -> DB : Post.create({ communityId, authorId,\ntitle, content, type, category })
DB --> PS : Post
PS --> PC : Post
PC --> MA : 201 Created { post }

== View Feed ==
MB -> PC : GET /communities/:id/posts?category=general
PC -> PS : getPosts(communityId, { category })
PS -> DB : Post.findMany({ communityId, category,\norderBy: createdAt desc })
DB --> PS : [posts]
PS --> PC : [posts]
PC --> MB : 200 OK { posts }

== Create Comment ==
MB -> PC : POST /communities/:id/posts/:postId/comments\n{ content }
PC -> PS : createComment(authorId, postId, content)
PS -> DB : Post.findUnique(postId)
DB --> PS : Post
PS -> DB : Comment.create({ postId, authorId, content })
DB --> PS : Comment
PS --> PC : Comment
PC --> MB : 201 Created { comment }
@enduml

---

## Activity Diagrams


### AD-01 — User Registration & Verification

@startuml User Registration and Verification
|Guest|
start
:Submit registration form\n(firstname, lastname, email, password);

|System|
:Validate input fields;

if (Validation passes?) then (yes)
  :Check if email already exists in DB;
  if (Email taken?) then (yes)
    |Guest|
    :Show "Email already in use" error;
    stop
  else (no)
    |System|
    :Hash password;
    :Generate verificationToken (24h TTL);
    :Create User { isVerified: false };
    :Send verification email;
    |Guest|
    :See "Check your email" message;
    :Click link in email;
    |System|
    :Look up User by verificationToken;
    if (Token found?) then (yes)
      if (Token expired?) then (yes)
        |Guest|
        :Show "Link expired - resend?";
        stop
      else (no)
        |System|
        :User.update { isVerified: true,\n verificationToken: null };
        :Send welcome email;
        |Guest|
        :Redirect to login;
        stop
      end if
    else (no)
      |Guest|
      :Show "Invalid link" error;
      stop
    end if
  end if
else (no)
  |Guest|
  :Show validation errors;
  stop
end if
@enduml

---

### AD-02 — Community Join Decision

@startuml Community Join Decision
|Member|
start
:Click "Join Community";

|System|
:Fetch Community + pricingModel;
:Check for existing Membership;

if (Already a member?) then (yes)
  |Member|
  :Show "Already joined";
  stop
else (no)
  |System|
  if (pricingModel = FREE?) then (yes)
    :Create Membership { tier: FREE, status: ACTIVE };
    |Member|
    :Full access granted;
    stop
  else if (pricingModel = ONE_TIME?) then (yes)
    |Member|
    :Enter payment details;
    :Submit payment;
    |System|
    :Process payment;
    if (Payment successful?) then (yes)
      :Create Membership { tier: PAID };
      :Create Subscription { paymentStatus: SUCCESS };
      |Member|
      :Full access granted;
      stop
    else (no)
      |Member|
      :Show payment error;
      stop
    end if
  else if (pricingModel = SUBSCRIPTION?) then (yes)
    |Member|
    :Choose billing interval (MONTHLY / YEARLY);
    :Enter payment details;
    :Submit payment;
    |System|
    :Process payment;
    if (Payment successful?) then (yes)
      :Create Membership { tier: PAID };
      :Create Subscription { subscriptionEnd set };
      |Member|
      :Full access granted;
      stop
    else (no)
      |Member|
      :Show payment error;
      stop
    end if
  else (pricingModel = FREEMIUM)
    |System|
    :Create Membership { tier: FREE };
    |Member|
    :Access free-tier content;
    :Hit gated content?;
    if (Wants to upgrade?) then (yes)
      |Member|
      :Submit upgrade payment;
      |System|
      :Process payment;
      if (Payment successful?) then (yes)
        :Create Subscription { pricePaid: upgradePrice };
        :Membership.update { tier: PAID };
        |Member|
        :Full access granted;
        stop
      else (no)
        |Member|
        :Show payment error;
        stop
      end if
    else (no)
      |Member|
      :Stay on free tier;
      stop
    end if
  end if
end if
@enduml

---

### AD-03 — Course Access Authorization

@startuml Course Access Authorization
|Member|
start
:Request lesson URL;

|System|
:Verify JWT token;

if (Token valid?) then (yes)
  :Fetch Membership (userId, communityId);
  if (Active membership exists?) then (yes)
    :Fetch Course { accessType };
    if (accessType = OPEN?) then (yes)
      |Member|
      :Access granted;
      stop
    else if (accessType = PRIVATE?) then (yes)
      |System|
      if (role = creator or admin?) then (yes)
        |Member|
        :Access granted;
        stop
      else (no)
        |Member|
        :403 - Private course;
        stop
      end if
    else if (accessType = TIME_UNLOCK?) then (yes)
      |System|
      :Calculate unlock date\n(joinedAt + unlockAfterDays);
      if (unlock date <= today?) then (yes)
        |Member|
        :Access granted;
        stop
      else (no)
        |Member|
        :403 - Not yet unlocked;
        stop
      end if
    else if (accessType = BUY_NOW?) then (yes)
      |System|
      :Fetch CoursePurchase (userId, courseId);
      if (Purchase found?) then (yes)
        |Member|
        :Access granted;
        stop
      else (no)
        |Member|
        :403 - Purchase required;
        stop
      end if
    else (accessType = LEVEL_UNLOCK)
      |System|
      :Fetch UserPoints total\n(userId, communityId);
      if (Points >= threshold?) then (yes)
        |Member|
        :Access granted;
        stop
      else (no)
        |Member|
        :403 - Insufficient points;
        stop
      end if
    end if
  else (no)
    |Member|
    :403 - Not a member;
    stop
  end if
else (no)
  |Member|
  :401 - Unauthorized;
  stop
end if
@enduml

---

### AD-04 — Subscription Expiry Job

@startuml Subscription Expiry Job
|Scheduler|
start
:Trigger hourly cron;

|System|
:Query Subscriptions where\n  subscriptionEnd <= now\n  paymentStatus = SUCCESS\n  membership.status = ACTIVE;

if (Expired subscriptions found?) then (yes)
  repeat
    :Membership.update { status: EXPIRED,\n  membershipTier: FREE };
    :Send expiry notification email to member;
  repeat while (more expired?)
else (no)
  :Skip;
end if

:Query Subscriptions where\n  subscriptionEnd BETWEEN now AND now+3days\n  paymentStatus = SUCCESS\n  membership.status = ACTIVE;

if (Upcoming expirations found?) then (yes)
  repeat
    :Send renewal reminder email to member;
  repeat while (more upcoming?)
else (no)
  :Skip;
end if

:Job complete - log result;
stop
@enduml

---

### AD-05 — Presigned Upload Process

@startuml Presigned Upload Process
|Member|
start
:Select file to upload;

|System|
:Validate file type and size;

if (Valid?) then (yes)
  |Member|
  :POST /upload/presign\n{ filename, contentType, folder };

  |System|
  :Build unique storage key (uuid + filename);
  :Request presigned PUT URL from S3/R2\n(TTL: 300s);
  :Return { presignedUrl, key, cdnUrl };

  |Member|
  :PUT file directly to presignedUrl;

  |S3/R2|
  if (Upload successful?) then (yes)
    :File stored at key;

    |Member|
    :Receive 200 OK from S3/R2;
    :Save cdnUrl to entity\n(course thumbnail / lesson video /\ncommunity cover / attachment);

    |System|
    :PATCH entity { field: cdnUrl };
    :Entity updated in DB;

    |Member|
    :Upload complete;
    stop
  else (no)
    |Member|
    :Show upload failure error;
    stop
  end if
else (no)
  |System|
  :Return 400 validation error;

  |Member|
  :Show validation error;
  stop
end if
@enduml
