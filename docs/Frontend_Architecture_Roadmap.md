# **Frontend Architecture & Roadmap: Hybrid LMS**

**Version:** 1.2 (Tactile Design Update)

**Target Stack:** Next.js (App Router), TypeScript, Tailwind, TanStack Query

This document outlines the professional "cracked developer" setup for the LMS frontend. It prioritizes type safety, offline-first capabilities for instructors, and a distinct **"Tactile Modern"** aesthetic using pure CSS for high-performance interactions.

## **1\. Technology Stack Strategy**

We are choosing tools that balance **Development Speed** with **Production Robustness**.

| Category         | Choice                                    | Rationale                                                                                                                                                              |
| :--------------- | :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**    | **Next.js (latest version) (App Router)** | Hybrid rendering. Server Components for public/admin dashboards (SEO/Performance), Client Components for the interactive Test Engine.                                  |
| **Language**     | **TypeScript (Strict)**                   | Non-negotiable for a system managing certifications and logic gates.                                                                                                   |
| **Server State** | **TanStack Query (latest version)**       | The "Secret Weapon" for the Offline Mode. Handles caching, background refetching, and syncing local state when connectivity returns.                                   |
| **Client State** | **Zustand**                               | Minimalist global state for things like "Active Drag-and-Drop" or "Sidebar State."                                                                                     |
| **Styling**      | **Tailwind CSS + Shadcn/UI**              | **Customized** with "hard shadow" tokens and high border-radius. Shadcn is chosen over Daisy UI because we own the code and can fully customize the tactile aesthetic. |
| **Visuals**      | **CSS Transitions**                       | Lightweight transition-all and transform for tactile, pressable interactions (No heavy JS animation libraries).                                                        |
| **PWA/Offline**  | **Serwist (or next-pwa)**                 | Modern Service Worker wrapper to cache assets and API responses. **No native mobile app** - PWA only for instructor offline mode.                                      |

## **2\. Visual Identity & Design System (Tactile Modern)**

**⚠️ COMPLETE SPEC:** See `Design_System.md` for the full design system with all components, tokens, and patterns.

Based on the "Request Demo" button reference, we will implement a design system that feels **physical and clickable**.

- **Typography:**
  - **Headers:** **"TBJ Endgraph Mini"** (Local font - `/public/fonts/tbj-endgraph-font-family/`)
    - Weights: Thin (100), Light (300), Regular (400), Medium (500), Bold (700)
    - Usage: Page titles, section headers, card titles
    - _Characteristics:_ Geometric, modern, display-oriented
  - **Body Text:** **"Geist Sans"** (Built-in with Next.js 14+, via `next/font`)
    - _Pairing Rationale:_ Geometric display + neutral body = professional modern aesthetic
    - _Benefits:_ Optimized for UI/screen reading, excellent metrics, tree-shakeable
    - Usage: All body text, buttons, labels, captions
  - _Headings:_ Bold (700), Tight tracking (-0.02em).
  - _Body:_ Regular (400) for readability, Medium (500) for emphasis.
- **The "Tactile" Vibe (Crucial):**
  - **Depth via Hard Shadows:** Instead of blurry generic shadows, we use **solid offset shadows** (0 blur) to create a layered, sticker-like effect.
    - _Token:_ box-shadow: 0px 4px 0px 0px #09090B (for depth).
  - **Super-Rounded Shapes:**
    - **Buttons:** rounded-full (Pill shape) is mandatory for primary actions.
    - **Cards:** rounded-\[2rem\] (32px).
    - **Inputs:** rounded-2xl with a 2px solid border.
- **Interaction Physics (Pure CSS):**
  - **Hover:** Elements lift slightly (translate-y-\[-2px\]) and shadow grows.
  - **Active (Click):** Elements press down (translate-y-\[2px\]) and shadow shrinks. This mimics a real mechanical button.
- **Color Palette:**
  - **Background:** Deep Charcoal/Black (\#09090B).
  - **Surface/Cards:** Zinc-900 (\#18181B) with 1px border (border-zinc-800).
  - **Primary Accent (Blue):** Vibrant Electric Blue (\#3B82F6). Used for the "top layer" of the pill buttons.
  - **Text:** High contrast white (\#FAFAFA).

## **3\. Project Roadmap**

### **Phase 1: The "Iron-Clad" Foundation (Weeks 1-2)**

- **Repo Setup:** Husky, ESLint, Prettier.
- **Design System Implementation:**
  - Configure `tailwind.config.ts` to add custom boxShadow utilities (e.g., shadow-hard, shadow-hard-sm).
  - Setup local font loading for TBJ Endgraph Mini in `app/layout.tsx`.
  - Configure Geist Sans (built-in with Next.js 14+).
  - Create Shadcn UI component variants (Button, Card, Input) with "Pressable Pill" styles by default.
  - **CSS Strategy:** Define global :root variables for shadow colors to easily switch themes.
  - **Deliverable:** Complete `Design_System.md` implementation with all component examples working.
- **Auth Layer:** Setup NextAuth.js with generic Route Guards.

### **Phase 2: Core Data & Admin Dashboard (Weeks 3-4)** ✅

- **TanStack Query Setup:** Configure QueryClient with devtools.
- **Type System:** Full TypeScript types for User, Course, Enrollment, WaitlistEntry, Cohort, Certificate, Test, Question, TestAttempt (with TestCategory, override fields).
- **Mock Data Layer:** Async mock API functions with filtering, pagination, sorting.
- **Admin Layout:** Responsive sidebar (permanent desktop / overlay mobile), mobile header with hamburger.
- **Admin Features:**
  - Dashboard with stat cards and quick actions.
  - User Management: CRUD, search, role/status filters, data table with responsive column hiding.
  - Course Management: Grid/table views, status/category filters, responsive tables.
  - Course Editor: Multi-section form (metadata, capacity, content modules, prerequisite + post-course test toggles).
  - Course Edit Page: Full edit form for existing courses with delete confirmation.
  - Waitlist Management: Table with status indicators, approve/reject actions.
  - Enrollment Management: Table with progress tracking, status filters.
  - **Question Bank (PRD §4.2):** CRUD for MCQ questions with difficulty, topic tags, correct answer selector. Search/filter by difficulty and topic.
  - **Analytics Dashboard (PRD §5.4):** CSS-only charts: enrollments per course, pass/fail rates, student activity, instructor performance, monthly trends, category distribution.
  - **Settings Page:** Organization settings, assessment defaults (pass score, max attempts, time limit, shuffle, tab-switch, copy-paste prevention), notification preferences, security (session timeout, password policy, 2FA toggle).
  - **Test Override (PRD §2.5):** Admin can override test attempt pass/fail results manually.
  - **Certificate Management (PRD §2.6):** Generate and revoke certificates, instructor name on certificates.
  - **Attendance APIs (PRD §3.2):** Mark attendance (QR/manual), fetch attendance records.
  - **Cohort CRUD:** Create, update, delete cohorts with instructor assignment.
- **Responsive Tables:** overflow-x-auto wrappers, hidden columns on mobile, stacked info on small screens.

### **Phase 3: The Student Experience (Weeks 5-7)**

- **Authentication Pages:**
  - Login page with email/password form, validation, "forgot password" link.
  - Registration page with Name, Email, Phone, Organization fields + validation.
  - Shared auth layout with branding.
- **Student Layout & Navigation:**
  - Responsive student sidebar/nav (bottom tab bar on mobile, sidebar on desktop).
  - Student mobile header with hamburger menu.
  - Notification bell / indicator.
- **Student Dashboard:**
  - My active courses with progress indicators.
  - Upcoming sessions / calendar.
  - Recent certificates earned.
  - Quick actions (browse courses, continue learning).
- **Course Catalog & Browsing (PRD 3.2, 3.4):**
  - Searchable course catalog with category/status filters.
  - Course cards with enrollment status, prerequisite indicators.
  - Course Detail page:
    - Course info (description, duration, venue, instructor, capacity).
    - Module list / content outline.
    - Prerequisite test status (passed/not attempted/failed).
    - Conditional "Enroll" button (disabled until prereq passed).
    - Waitlist join flow (when course is full).
    - Seat availability indicator.
- **Assessment / Test Engine (PRD 3.3):**
  - Test start screen with instructions and attempt history.
  - Timer hook (countdown, auto-submit on expiry).
  - Question navigation panel (answered/unanswered/flagged indicators).
  - MCQ question renderer with randomized answer order.
  - Local state preservation (Zustand) to survive page refresh.
  - Tab-switch / focus-loss detection with warning overlay.
  - Copy-paste prevention within test interface.
  - Auto-grading on submission with instant score display.
  - **Smart Remediation:** On failure, analyze incorrect answers by topic tags and recommend specific Module 0 sections.
  - Score history / attempt tracking.
  - **Post-Course Final Assessment (PRD §2.5):** Separate final-test page for end-of-course assessment, with same engine, shown only to enrolled students after physical training. Passing qualifies for certification.
- **Certificates (PRD 3.6):**
  - Student certificates page listing earned certificates.
  - Certificate detail view with download action.
  - Public certificate verification page (unauthenticated route `/verify/[id]`).
- **QR Entry Pass:**
  - Entry QR code display for confirmed enrollments (react-qr-code).
  - Time-bound validity indicator.
- **Student Profile (PRD 3.1):**
  - Profile view with personal info, enrollment history, test scores, certificates.
  - Edit profile form.
- **Notifications UI (PRD 3.7):**
  - In-app notification center (dropdown or page).
  - Notification types: enrollment confirmation, waitlist updates, class reminders, certificate ready.
  - Read/unread state management.

### **Phase 4: The "Offline" Instructor PWA (Weeks 8-9)**

**Note:** This is a Progressive Web App, not a native mobile application. Implementation focuses on practical offline capabilities within browser limitations.

- **Instructor Layout & Navigation:**
  - Instructor-specific sidebar/nav (separate from admin).
  - Role-based route protection for instructor pages.
- **Instructor Dashboard (PRD §3.2):**
  - View assigned courses with cohort status.
  - Enrolled students list per course.
  - Quick actions: mark attendance, view results, upload materials.
  - Upcoming session calendar.
- **Attendance Management (PRD §3.2):**
  - QR Scanner: react-qr-reader or html5-qrcode.
  - Camera permissions handling with graceful fallback to manual entry.
  - Attendance table with present/absent/excused status.
  - QR validation includes HMAC signature verification and timestamp checking.
  - Invalid/expired QR codes show clear error messages.
- **Material Upload (PRD §3.2):**
  - Upload supporting materials (PDF, docs, videos, slides) per course.
  - File management UI with drag-and-drop.
- **Student Tracking (PRD §3.2):**
  - View enrolled students per assigned course.
  - Track student progress, attendance, and test scores.
  - Performance stats dashboard per cohort.
- **Manual Grading (PRD §2.5, §3.2):**
  - View test attempts for assigned courses.
  - Override pass/fail with justification (uses overrideTestAttempt API).
  - Grade report export.
- **PWA Configuration:**
  - Manifest.json for "Add to Home Screen" experience.
  - Service Worker (Serwist/next-pwa) for offline asset caching.
  - **Limitation Acknowledgment:** iOS Safari PWA support is limited. Test extensively on target devices.
- **Offline Sync:**
  - IndexedDB persistence for scanned attendance data.
  - Background sync API when connectivity returns.
  - Conflict resolution: Last-write-wins with server-side validation.
- **Security Implementation:**
  - QR validation includes HMAC signature verification and timestamp checking.
  - Invalid/expired QR codes show clear error messages.
