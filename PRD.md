# Nectar (Stack) — Product Requirements Document

**Version:** 1.0
**Date:** March 7, 2026
**Platform:** Web (Mobile-first PWA)
**Market:** Dubai, UAE
**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase + Framer Motion

---

## 1. Executive Summary

Nectar (internally branded as "Stack") is a **two-sided home services marketplace** connecting consumers with vetted service professionals ("Pros") in Dubai. The platform enables consumers to post jobs, receive competitive quotes, manage payments via escrow, and earn loyalty rewards — while giving vendors tools for lead management, AI-powered pricing, scheduling, and professional profile building.

**Core Value Proposition:**
- **For Consumers:** Find, compare, and hire trusted home service professionals with AI-powered pricing transparency and a gamified loyalty program.
- **For Vendors:** Discover high-quality leads, optimize pricing with AI market insights, and build a professional online presence with reviews, portfolios, and certifications.

---

## 2. User Personas

### 2.1 Consumer
- Dubai resident (homeowner or tenant)
- Needs home services (cleaning, AC repair, plumbing, etc.)
- Values transparency in pricing and vendor quality
- Motivated by rewards, cashback, and convenience

### 2.2 Vendor (Pro)
- Licensed home service professional or small business owner
- Operates in one or more service categories
- Needs consistent lead flow and efficient job management
- Values competitive intelligence and professional branding

---

## 3. User Flows

### 3.1 Consumer Journey

```
Welcome Screen → Login/Signup → Consumer Home
  ├── Browse Services → Select Sub-service → Configure Job (AI pricing) → Post Job
  ├── View Active Jobs → Manage Quotes (list/compare) → Accept Quote
  ├── Track Job Progress (5-stage pipeline) → Make Payment (escrow) → Leave Review (+50 pts)
  ├── Messages → Chat with Vendor (real-time)
  ├── Rewards → View Points, Tier, Challenges, Achievements
  ├── Market Benchmark → AI pricing insights by category + neighborhood
  └── Profile → Personal Info, Payment Methods, Transactions, Help Center
```

### 3.2 Vendor Journey

```
Welcome Screen → Login/Signup → Vendor Home (Dashboard)
  ├── Toggle Availability → View Priority Actions (Requests, Chats, Bookings)
  ├── Work Management:
  │   ├── New Leads → View Details → Submit Quote (with AI Price Check)
  │   ├── Active Jobs → Update Status (En Route → Arrived → Working → Completed)
  │   └── History → View Earnings, Request Reviews
  ├── Schedule → Weekly Calendar → Job Details → Start/Complete Jobs
  ├── Company Profile → Edit Services, Portfolio, Certifications, Team, Expertise
  └── Messages → Chat with Consumers
```

---

## 4. Feature Specifications

### 4.1 Authentication & Onboarding

| Feature | Description |
|---|---|
| **Email/Password Login** | Standard authentication via Supabase Auth |
| **Phone Number** | Optional phone field during signup |
| **Email Verification** | Required before account activation |
| **Password Reset** | Email-based password recovery flow |
| **User Type Selection** | Welcome screen: "I need help" (Consumer) vs "I'm a Pro" (Vendor) |
| **Vendor Onboarding** | Multi-step signup for new professionals |
| **Session Persistence** | Supabase session management with protected routes |

### 4.2 Consumer Home Screen

| Feature | Description |
|---|---|
| **Personalized Greeting** | "Hello, {firstName}" with points badge |
| **Notification Bell** | Unread count badge, navigates to notifications |
| **Search Bar** | Search across all service categories |
| **Review Banner** | Prompts to review completed jobs (50 pts incentive) |
| **"Need Something Done?" CTA** | Primary job posting entry point |
| **Quick Re-hire** | Horizontal scroll of previously hired vendors with ratings + distance |
| **Services Grid** | 6 main service category tiles |
| **Recommended Pros** | Filterable/sortable vendor cards (by specialty, rating, distance) |
| **Active Jobs Preview** | Up to 2 in-progress jobs with status badges |
| **FAB** | Floating action button for quick job posting |
| **Bottom Navigation** | Home, Jobs, Messages, Rewards, Profile (with badge counts) |
| **Pull-to-Refresh** | Gesture-based content refresh with skeleton loading |

### 4.3 Service Catalog & Job Configuration

#### 4.3.1 Service Categories (13 Main Categories)

| Category | Subscription Support |
|---|---|
| Home Cleaning | Yes |
| Specialized Cleaning | Yes |
| Gardening & Landscaping | Yes |
| AC & Ventilation | Yes |
| Plumbing | No |
| Electrical | No |
| Handyman | No |
| Painting | No |
| Laundry & Dry Cleaning | Yes |
| Vehicle Care | Yes |
| Pest Control | Yes |
| Moving & Delivery | No |
| Smart Home | No |

Each category contains multiple sub-services with individual average pricing.

#### 4.3.2 Job Configuration (Multi-Step Form)

| Step | Details |
|---|---|
| **Service Selection** | Pre-filled from service catalog |
| **Description** | Required text field; AI suggestion button available |
| **Location** | Defaults to "Dubai Marina, Dubai"; editable |
| **Urgency** | Flexible (within a week), Today (24h), Urgent (ASAP) |
| **Budget** | AI-suggested Low/Fair(recommended)/Premium options or custom amount |
| **Subscription** | Toggle one-time vs recurring; Weekly (15% off), Bi-Weekly (10% off), Monthly (5% off); preferred day + time slot |
| **Photos** | Up to 5 photos (optional) |
| **Summary** | Review card before final submission |

#### 4.3.3 AI Market Insights (Job Configuration)

- **Price Range:** Min / Average / Max from market data
- **Active Vendors:** Count of available pros in category
- **Average Response Time:** Minutes to first quote
- **AI Confidence Score:** 78–95% based on data density
- **Budget Suggestions:** Low, Fair (recommended), Premium tiers

### 4.4 Quote Management

| Feature | Description |
|---|---|
| **List View** | Individual quote cards with vendor name, rating, price, response time, completion rate, availability, message |
| **Compare View** | Side-by-side comparison of up to 3 quotes with "Best" highlighting |
| **Stats Summary** | Total quotes received, lowest price, top rating |
| **Actions** | View vendor profile, open chat, accept quote |

### 4.5 Job Lifecycle & Progress Tracking

#### Consumer-Side States:
```
Request Sent → Offer Accepted → In Progress → Completed → Payment Released
```

#### Vendor-Side States:
```
New Lead → Quoted → En Route → Arrived → Working → Awaiting Payment → Completed
```

| Feature | Description |
|---|---|
| **Status Badges** | Color-coded: Pending (orange), In Progress (blue), Completed (green), Cancelled (red) |
| **Progress Bar** | Visual 5-stage pipeline on PaymentScreen |
| **Status Updates** | Vendor can update: Mark Arrived → Start Work → Mark Completed |
| **Consumer Controls** | Can update status: Pending → In Progress → Completed |

### 4.6 Payment System

| Feature | Description |
|---|---|
| **Payment Methods** | Credit/Debit Card (****4242), Stack Wallet (balance display), Cash on Completion |
| **Escrow** | Payment held securely until job completion; status: "In Escrow (Protected)" → "Payment Complete" |
| **Price Breakdown** | Service amount + Platform fee (5%) = Total |
| **Vendor Payouts** | Earned amount − Platform fee (10%) = Net earnings |
| **Tipping** | Optional: None, 10 AED, 20 AED, 50 AED during review |
| **Transaction History** | Full history with filters (All, Completed, Refunded); receipt download with ID |
| **Success State** | Confirmation screen with points earned notification |

### 4.7 Reviews & Ratings

| Feature | Description |
|---|---|
| **5-Star Rating** | Interactive star selection with hover state |
| **Quick Tags** | Professional, Punctual, Quality Work, Friendly, Clean & Tidy, Great Value |
| **Written Review** | Optional text comment |
| **Tipping** | Integrated into review flow |
| **Points Reward** | +50 points per submitted review |
| **Vendor Response** | Vendors can reply to reviews (displayed on profile) |
| **Pinned Reviews** | Vendors can highlight favorite reviews |
| **Review Prompts** | Banner on home screen + badge on completed jobs |

### 4.8 Rewards & Loyalty Program

#### Tier System

| Tier | Badge | Cashback Rate |
|---|---|---|
| Bronze | 🥉 | 0% |
| Silver | 🥈 | 1% |
| Gold | 🥇 | 3% |
| Platinum | 👑 | 5% |

#### Points Earning

| Action | Points |
|---|---|
| Completed job | 5% of job value |
| Submit a review | 50 points |
| Weekly challenges | Variable (e.g., 150 pts) |

#### Rewards Features

| Feature | Description |
|---|---|
| **Points Dashboard** | Current balance, tier, progress to next tier |
| **Statistics** | Day streak, AED saved, lifetime points |
| **Growth Chart** | Points trend over 3M/6M/1Y/All |
| **Weekly Challenges** | Goal-based tasks with countdown timer and progress bar |
| **Achievements** | Grid of earned/locked achievements with progress tracking |
| **Recent Earnings** | Activity log of point-earning events |
| **Cashback Redemption** | Applied as discounts on future bookings |

### 4.9 Messaging & Chat

| Feature | Description |
|---|---|
| **Conversations List** | Search, filter (All/Unread), online indicators, last message preview, unread badges |
| **Real-Time Chat** | Message bubbles (blue for user, card-style for vendor) |
| **Message Status** | Sending (clock) → Sent (✓) → Delivered (✓✓) → Read (blue ✓✓) |
| **Typing Indicator** | Animated dots when other party is typing |
| **Media** | Image attachment button |
| **Quick Actions** | Phone call and video call buttons in header |
| **Online Status** | Green dot indicator; "Online" / "Last seen recently" / "typing..." |

### 4.10 Notifications

| Feature | Description |
|---|---|
| **Timeline View** | Vertical timeline with colored icon markers |
| **Notification Types** | Job status, Quote received, Message, Reward, Payment |
| **Navigation** | Tap notification to go to relevant screen |
| **Unread Indicators** | Dot markers on unread items |
| **Bell Badge** | Unread count on home screen header |

### 4.11 Vendor Dashboard (Home)

| Feature | Description |
|---|---|
| **Profile Header** | Avatar, name, rating, review count |
| **Availability Toggle** | On/off switch for receiving new job offers |
| **Priority Actions** | Requests count, unread chats, today's bookings (with badges) |
| **Performance Metrics** | Conversion rate (%), response time (min), satisfaction rating |
| **AI Price Check** | Your quote vs market benchmark; win chance adjustment suggestions |
| **Top Leads** | High-probability jobs with estimated payout, win probability, "Quote Now" CTA |
| **Quick Access** | Schedule, Services/Company Profile, Payouts/Wallet |
| **Bottom Navigation** | Home, Schedule, Profile (with pending quotes count) |

### 4.12 Vendor Work Management

#### New Leads Tab
| Feature | Description |
|---|---|
| **Job Cards** | Title, location, urgency badge, budget range, competition info, distance, posted time, client rating |
| **Quoting Panel** | Quote amount input, AI Price Check (high/low/optimal), message textarea |
| **AI Price Check** | Recommends optimal price, shows win rate impact, color-coded alerts |
| **Decline** | Option to pass on a lead |

#### Active Jobs Tab
| Feature | Description |
|---|---|
| **Job Cards** | Category, title, client, status badge, scheduled time, location, agreed price |
| **Status Progression** | En Route → Arrived → Working → Awaiting Payment |
| **Quick Actions** | Navigate (maps), Message, Call |

#### History Tab
| Feature | Description |
|---|---|
| **Completed/Cancelled** | Status badge, customer rating |
| **Financial Breakdown** | Final payout − Platform fee (10%) = Net earnings |
| **Actions** | "Payouts & Wallet", "Ask for Review" |

### 4.13 Vendor Schedule

| Feature | Description |
|---|---|
| **Week Navigator** | Previous/next week arrows, date range display |
| **Day Selector** | Abbreviated day names with job count badges |
| **Job List** | Sorted by time; shows time range, slot label, status, category, title, location, customer info, amount |
| **Expanded Details** | Full address, customer notes, action buttons (Call, Message, Navigate) |
| **Status Actions** | Upcoming: "Start Job" / "Reschedule"; In Progress: "Mark Completed" |

### 4.14 Vendor Profile (Public)

| Feature | Description |
|---|---|
| **Cover Media** | Image or video with play button overlay |
| **Header** | Name, verified badge, rating, completed jobs count, "Contact & Get Quote" CTA |
| **Licenses & Certifications** | Grid with verified checkmarks and issuers |
| **Portfolio** | Before/after project cards, horizontally scrollable |
| **About** | Company story, tagline, USPs with checkmarks |
| **Team** | Horizontal cards with name, role, experience, bio |
| **Services & Pricing** | Service name, category badge, price range, benefits |
| **Tips & Expertise** | Blog-style expert tips with publish dates |
| **Performance Metrics** | Response time, jobs completed %, on-time arrival %, repeat customers % |
| **Reviews** | Rating summary, category filter tabs, pinned reviews, vendor responses |
| **Trust Badges** | Stack Verified, Top Rated 2024, Fast Responder, Background Checked |
| **Warranty** | 30-Day Service Guarantee with expandable details |

### 4.15 Company Profile Editor (Vendor)

| Feature | Description |
|---|---|
| **Services Management** | Add/edit/delete services with pricing tiers |
| **Portfolio** | Upload before/after project photos |
| **Certifications** | Add licenses with verification status |
| **Team Members** | Name, role, experience, bio per team member |
| **Expertise Content** | Publish tips and blog content |
| **Business Story** | Company description and USPs |

### 4.16 Market Benchmark (AI Insights)

| Feature | Description |
|---|---|
| **Input** | Service category selector + neighborhood selector |
| **AI Confidence** | 78–95% score based on data availability |
| **Price Trend Chart** | Interactive chart with 3M/6M/1Y/All ranges |
| **Price Range** | Visual bar with Min/Average/Max |
| **Supply Data** | Availability %, active vendor count |
| **Response Time** | Average minutes to first quote |
| **CTA** | "Post My Job and Get Quotes" |

**Supported Neighborhoods:** Dubai Marina, Downtown Dubai, Business Bay, JBR, Palm Jumeirah, Deira, Bur Dubai, JLT, Al Barsha, Jumeirah

### 4.17 Help Center

| Feature | Description |
|---|---|
| **Contact Options** | Live Chat, Call Us, Email — "Available 24/7, Avg response: 2 min" |
| **FAQ Sections** | Getting Started, Payments & Pricing, Trust & Safety, Rewards & Points |
| **Expandable Categories** | Nested accordion: section → category → question → answer |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Lazy Loading:** Route-based code splitting with error boundary + retry
- **Skeleton Loading:** Placeholder UI during data fetches
- **Pull-to-Refresh:** Gesture-based refresh on home screens
- **Animations:** Framer Motion for smooth transitions and staggered list animations

### 5.2 Accessibility
- Semantic HTML structure
- Icon + text labels on all navigation items
- Minimum touch target size: 40×40px
- Color contrast compliance

### 5.3 Theming
- **Light/Dark Mode** toggle on Welcome screen
- CSS custom properties (HSL-based) via shadcn/ui design system
- Brand colors: Primary Blue (217 91% 60%), dark accents

### 5.4 Security
- Protected routes via `ProtectedRoute` component (Supabase session check)
- Escrow-based payment protection
- Verified vendor badges (Background Checked, Stack Verified)
- No client-side secret exposure

### 5.5 Platform
- Mobile-first responsive design
- PWA-ready (Vite build)
- Deployed via Lovable (lovable.dev)

---

## 6. Data Architecture

### 6.1 Backend: Supabase
- **Authentication:** Supabase Auth (email/password)
- **Database:** PostgreSQL via Supabase
- **Real-time:** Supabase Realtime for messaging (planned)
- **Storage:** Supabase Storage for images/media (planned)

### 6.2 State Management
- **Zustand** for client-side state
- **React Context** for auth state propagation
- **Local state** for form management and UI interactions

### 6.3 Key Data Models
- **User** — id, email, name, phone, type (consumer/vendor), points, tier
- **Job** — id, title, description, category, subcategory, budget, urgency, location, status, consumer_id, vendor_id, subscription config
- **Quote** — id, job_id, vendor_id, price, duration, message, status
- **Review** — id, job_id, consumer_id, vendor_id, rating, tags, comment, tip, vendor_response
- **Transaction** — id, job_id, amount, fee, method, status, receipt_id
- **Message** — id, conversation_id, sender_id, content, status (sent/delivered/read), timestamp
- **Vendor Profile** — id, user_id, services, portfolio, certifications, team, about, warranty
- **Notification** — id, user_id, type, title, message, read, navigation_target

---

## 7. Platform Fee Structure

| Fee | Rate | Applied To |
|---|---|---|
| Consumer Platform Fee | 5% | Added to job total at payment |
| Vendor Platform Fee | 10% | Deducted from vendor payout |

---

## 8. Currency & Localization

- **Currency:** AED (United Arab Emirates Dirham)
- **Default Location:** Dubai Marina, Dubai
- **Language:** English (primary)
- **Distance Units:** Kilometers (km)

---

## 9. Future Considerations

Based on the current codebase structure and UI placeholders:

1. **Real-time Messaging** — Full Supabase Realtime integration (currently simulated)
2. **Push Notifications** — Native push via service worker (test button exists)
3. **Maps Integration** — Full map view for job locations and vendor navigation
4. **In-App Calling** — Phone and video call buttons exist in chat UI
5. **Media Upload** — Image attachment in chat, portfolio uploads
6. **Subscription Management** — Pause/cancel/modify recurring bookings
7. **Vendor Analytics Dashboard** — Expanded performance metrics and trends
8. **Multi-language Support** — Arabic localization for UAE market
9. **Native Mobile Apps** — iOS/Android via React Native or Capacitor
10. **Dispute Resolution System** — Structured mediation flow

---

## 10. Appendix: Route Map

| Route | Page | User Type |
|---|---|---|
| `/` | Welcome Screen | Public |
| `/login` | Login/Signup | Public |
| `/consumer` | Consumer Home | Consumer |
| `/vendor` | Vendor Dashboard | Vendor |
| `/profile` | User Profile | Both |
| `/rewards` | Rewards & Loyalty | Consumer |
| `/notifications` | Notification Center | Both |
| `/messages` | Conversations List | Both |
| `/chat` | Direct Chat | Both |
| `/jobs` | Jobs Management | Consumer |
| `/job` | Job Details | Both |
| `/post-request` | Post a Job | Consumer |
| `/job-configuration` | Job Setup (multi-step) | Consumer |
| `/quote-management` | Compare Quotes | Consumer |
| `/review` | Leave a Review | Consumer |
| `/payment` | Payment & Progress | Consumer |
| `/request` | Request Detail (Vendor) | Vendor |
| `/services` | Service Catalog | Consumer |
| `/market-benchmark` | AI Market Insights | Both |
| `/company-profile` | Company Profile Editor | Vendor |
| `/help` | Help Center | Both |
| `/transactions` | Transaction History | Consumer |
| `/vendor-work` | Work Pipeline | Vendor |
