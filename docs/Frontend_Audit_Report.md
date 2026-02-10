# TRD LMS Frontend — Comprehensive Audit Report

**Date:** 2025-01-XX  
**Scope:** Every page file and component file in the project  
**Method:** Manual line-by-line code review (research only, no changes made)

---

## Summary

| Category              | Count  |
| --------------------- | ------ |
| DEAD_BUTTON           | 7      |
| DEAD_LINK             | 1      |
| NO_FEEDBACK           | 16     |
| MISSING_RESPONSIVE    | 17     |
| OVERFLOW_RISK         | 6      |
| INCOMPLETE_FEATURE    | 12     |
| MISSING_INTERACTIVITY | 4      |
| STUB_PAGE             | 2      |
| EMPTY_STATE (missing) | 1      |
| **Total**             | **66** |

---

## Issue Codes

| Code                    | Meaning                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `DEAD_BUTTON`           | Button/CTA with no `onClick`, no `href`, or handler is a no-op                                                      |
| `DEAD_LINK`             | `<Link>` or `<a>` with `href="#"` or pointing to a non-existent route                                               |
| `NO_FEEDBACK`           | Mutation (create/update/delete) that occurs with no toast, alert, or visible success/error feedback to the user     |
| `MISSING_RESPONSIVE`    | `text-3xl` or `text-4xl` heading without a smaller mobile breakpoint variant (e.g., missing `text-2xl sm:text-3xl`) |
| `OVERFLOW_RISK`         | Long text (names, emails, addresses) without `truncate`, `line-clamp`, or `max-width` constraint                    |
| `INCOMPLETE_FEATURE`    | Feature that is partially built — data is mocked/hardcoded, persistence is missing, or core logic is stubbed        |
| `MISSING_INTERACTIVITY` | Element that looks clickable/actionable but does nothing on interaction                                             |
| `STUB_PAGE`             | Page that is just a heading and description with no functional content                                              |
| `EMPTY_STATE`           | Table or list that has no empty-state messaging when data is absent                                                 |

---

## Detailed Findings

---

### FILE: app/page.tsx (Landing Page)

**ISSUES:**

- **[DEAD_BUTTON] Line ~56:** "Browse Courses" `<Button>` has no `onClick` handler and is not wrapped in `<Link>`. Clicking does nothing.
- **[DEAD_BUTTON] Line ~59:** "Learn How It Works" `<Button>` has no `onClick` handler and no `<Link>`. Clicking does nothing.
- **[DEAD_BUTTON] Line ~229:** "Start Free Trial" `<Button>` in the CTA section has no `onClick` and no `<Link>`. Dead.
- **[DEAD_BUTTON] Line ~232:** "Contact Sales" `<Button>` in the CTA section has no `onClick` and no `<Link>`. Dead.

---

### FILE: app/(auth)/login/page.tsx

**ISSUES:**

- **[DEAD_LINK] Line ~113:** "Forgot password?" `<Link href="#">` — links to `#`, which scrolls to top. No forgot-password route or flow exists.
- **[MISSING_INTERACTIVITY] Line ~107:** "Remember me" checkbox — native `<input type="checkbox">` that is not wired to any state. Has no effect on login behavior.
- **[INCOMPLETE_FEATURE] Line ~51:** `handleSubmit` always redirects to `/dashboard` regardless of user role. In a multi-role app (admin/instructor/student), the redirect target should be role-aware. Also, no real auth—just a `setTimeout`.

---

### FILE: app/(auth)/register/page.tsx

**ISSUES:**

- **[INCOMPLETE_FEATURE] Lines ~50–60:** No role selection during registration. Always redirects to `/dashboard` after simulated delay. No actual account creation.

---

### FILE: app/(admin)/admin/page.tsx (Admin Dashboard)

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~90:** `text-3xl` heading "Admin Dashboard" with no smaller mobile variant.
- **[MISSING_RESPONSIVE] Line ~53:** Stat card values use `text-3xl` with no responsive downscale.
- **[INCOMPLETE_FEATURE] Lines ~140–180:** "Quick Actions" section has a "View All" Certificates link that renders but has no `href` (the `<Link>` wrapping "View All" next to certificates points to `/admin/certificates` which does not exist as a route).

---

### FILE: app/(admin)/admin/users/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~145:** `text-3xl` heading "User Management" with no mobile variant.
- **[NO_FEEDBACK] Line ~121:** `createUser.mutate()` — `onSuccess` closes the dialog but shows no success toast/message.
- **[NO_FEEDBACK] Line ~129:** `updateUser.mutate()` — `onSuccess` closes the editing state but shows no success toast.
- **[NO_FEEDBACK] Line ~136:** `deleteUser.mutate()` — `onSuccess` closes the confirming state but shows no success toast.
- **[INCOMPLETE_FEATURE] Line ~140:** "Toggle Role" in the dropdown only toggles between `instructor` and `student` (ternary). An admin user's role can never be toggled, and there is no way to set a user to admin.

---

### FILE: app/(admin)/admin/courses/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~91:** `text-3xl` heading "Course Management" with no mobile variant.
- **[NO_FEEDBACK] Lines ~75–87:** `publishCourse`, `archiveCourse`, and `deleteCourse` mutations have `onSuccess` that only closes dialogs/state. No toast/message for any operation.
- **[OVERFLOW_RISK] Line ~200 (approx):** Venue address column in the table — text is rendered without `truncate` or `max-width`. Long addresses will push table width.

---

### FILE: app/(admin)/admin/enrollments/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~49:** `text-3xl` heading "Enrollments" with no mobile variant.
- **[MISSING_INTERACTIVITY] Lines ~90–160:** Read-only table with no action buttons (no export, no cancel enrollment, no approve). Users cannot act on any enrollment.
- **[OVERFLOW_RISK] Line ~118 (approx):** Student name `<p>` in table has no `truncate`. Email at line ~122 has `truncate` with `max-w-[250px]` ✓, but the student name does not.

---

### FILE: app/(admin)/admin/waitlist/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~80:** `text-3xl` heading "Waitlist Management" with no mobile variant.
- **[NO_FEEDBACK] Line ~65:** `promoteWaitlistEntry.mutate()` — `onSuccess` closes dialog, no success toast.
- **[NO_FEEDBACK] Line ~72:** `removeWaitlistEntry.mutate()` — `onSuccess` closes dialog, no success toast.

---

### FILE: app/(admin)/admin/questions/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~204:** `text-3xl` heading "Question Bank" with no mobile variant (phase 1 course-select screen).
- **[NO_FEEDBACK] Line ~174:** `updateQuestion.mutate()` — `onSuccess` closes dialog, no toast.
- **[NO_FEEDBACK] Line ~177:** `createQuestion.mutate()` — `onSuccess` closes dialog, no toast.
- **[NO_FEEDBACK] Line ~182:** `deleteQuestion.mutate()` — no feedback.
- **[INCOMPLETE_FEATURE] Line ~182:** Delete uses `window.confirm()` instead of a styled `<Dialog>` component. Inconsistent with rest of app which uses Radix Dialog for all confirmations.
- **[INCOMPLETE_FEATURE] Lines ~230–240:** Question list is sliced to first 50 items (`questions.slice(0, 50)`) but there is no pagination UI to access items beyond 50.

---

### FILE: app/(admin)/admin/analytics/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~143:** `text-3xl` heading "Analytics" with no mobile variant.
- **[INCOMPLETE_FEATURE] Entire page:** All charts are CSS-only bar rendering (percentage widths). No interactivity — no tooltips, no click-to-drill-down, no date range filter, no data export.
- **[INCOMPLETE_FEATURE] Line ~37:** Bar chart label truncation uses JS `substring(0, 15)` at small screens. This is fragile compared to CSS `truncate`.

---

### FILE: app/(admin)/admin/settings/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~69:** `text-3xl` heading "Platform Settings" with no mobile variant.
- **[INCOMPLETE_FEATURE] Entire page:** Settings are local `useState` only. The "Save All" button sets `setSaved(true)` then `setTimeout` resets it. **No data is persisted anywhere** — all values reset on page refresh.
- **[NO_FEEDBACK] Line ~60 (approx):** "Saved!" text swap is used instead of a proper toast notification. Easy to miss.
- **[INCOMPLETE_FEATURE] Lines ~45–55:** No validation on numeric inputs (passing score, max attempts). User can enter 0, negative numbers, or leave blank.

---

### FILE: app/(admin)/admin/courses/new/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~113:** `text-3xl` heading "Create New Course" with no mobile variant.
- **[NO_FEEDBACK] Line ~92:** `createCourse.mutate()` — `onSuccess` redirects to `/admin/courses` but shows no success toast.
- **[INCOMPLETE_FEATURE] Line ~85:** Course is always created with `instructorIds: []`. There is no instructor selection field in the form.
- **[INCOMPLETE_FEATURE] Line ~88:** `prerequisiteTestId` is hardcoded to `"test_placeholder"` string. No test-selection UI.

---

### FILE: app/(admin)/admin/courses/[id]/edit/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~193:** `text-3xl` heading "Edit Course" with no mobile variant.
- **[NO_FEEDBACK] Line ~145:** `updateCourse.mutate()` — `onSuccess` redirects, no toast.
- **[NO_FEEDBACK] Line ~151:** `deleteCourse.mutate()` — `onSuccess` redirects, no toast.
- **[INCOMPLETE_FEATURE] Lines ~130–155:** Same as `/new` — no instructor assignment, placeholder test IDs.

---

### FILE: app/(student)/dashboard/page.tsx

**ISSUES:**

- **[INCOMPLETE_FEATURE] Lines ~175–195:** Course progress is generated with `Math.random()` on every render. This means progress bars show different values on each re-render/navigation. Not derived from real enrollment data.
- **[DEAD_BUTTON] Line ~217 (approx):** "Schedule" quick action links to `/courses` — there is no dedicated schedule page. Not technically dead, but misleading.

---

### FILE: app/(student)/courses/[id]/page.tsx (Course Detail)

**ISSUES:**

- **[INCOMPLETE_FEATURE] Lines ~460–516:** Module content items (lessons) are rendered as static text. There is no click handler or link to view actual content. Students cannot consume course material.
- **[NO_FEEDBACK] Line ~370 (approx):** Enrollment `try/catch` block — the `catch` is empty. If enrollment fails, the user sees no error message.

---

### FILE: app/(student)/courses/[id]/test/page.tsx (Prerequisite Test)

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~115:** Results heading uses `text-3xl` with no mobile variant.
- **[MISSING_RESPONSIVE] Lines ~126, ~133:** Score display uses `text-4xl` with no responsive downscale.
- **[INCOMPLETE_FEATURE] Lines ~500–510 (approx):** Question navigation sidebar uses `hidden lg:block`. On mobile/tablet, there is no alternative way to jump between questions — the student must click through one at a time using "Previous"/"Next".

---

### FILE: app/(student)/courses/[id]/final-test/page.tsx (Post-Course Test)

**ISSUES:**

- **[INCOMPLETE_FEATURE] Lines ~500–510 (approx):** Same mobile question-navigation issue as the prerequisite test — `hidden lg:block` nav panel with no mobile alternative.

---

### FILE: app/(student)/certificates/page.tsx

**ISSUES:**

- **[DEAD_BUTTON] Line ~140 (approx):** "Download" `<Button>` has no `onClick` handler. Clicking does nothing. The certificate cannot actually be downloaded.

---

### FILE: app/(student)/profile/page.tsx

**ISSUES:**

- **[INCOMPLETE_FEATURE] Lines ~60–70:** `handleSave` function only calls `setEditing(false)`. **No API call is made** — profile changes are discarded on "save".
- **[NO_FEEDBACK] Lines ~60–70:** No success/error message after "saving" profile changes. The user gets no indication their (non-persisted) edits were acknowledged.
- **[OVERFLOW_RISK] Line ~105 (approx):** In the read-only profile view, the email address text has no `truncate` or `max-width`. Long emails could overflow the layout on narrow viewports.

---

### FILE: app/verify/[certNumber]/page.tsx

**ISSUES:**

- None identified. Clean implementation with proper loading/error/success states.

---

### FILE: app/(instructor)/instructor/page.tsx (Instructor Dashboard)

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~61:** `text-3xl` heading "Instructor Dashboard" with no mobile variant.

---

### FILE: app/(instructor)/instructor/courses/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~31:** `text-3xl` heading "My Courses" with no mobile variant.

---

### FILE: app/(instructor)/instructor/students/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~82:** `text-3xl` heading "My Students" with no mobile variant.
- **[OVERFLOW_RISK] Line ~150 (approx):** Student name in table cell has no `truncate`. Long names push the column.
- **[OVERFLOW_RISK] Line ~155 (approx):** Email in table cell has no `truncate`. Long emails push the column.

---

### FILE: app/(instructor)/instructor/attendance/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~163:** `text-3xl` heading "Attendance" with no mobile variant.
- **[INCOMPLETE_FEATURE] Lines ~96–115:** QR scan is fully simulated — `handleQrScan()` just picks a random enrolled student after a 2-second `setTimeout`. No actual camera/html5-qrcode integration. The QR expiry check is `Date.now() - Date.now()` which is always 0, so the expiry branch never triggers.
- **[NO_FEEDBACK] Line ~154:** `markAttendance.mutate()` for manual entry — `onSuccess` closes dialog, no toast.

---

### FILE: app/(instructor)/instructor/materials/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~109:** `text-3xl` heading "Materials" with no mobile variant.
- **[INCOMPLETE_FEATURE] Entire page:** File uploads are client-side only (`useState` with `Record<string, UploadedFile[]>`). Files are lost on page refresh. No API integration for persistent storage.
- **[INCOMPLETE_FEATURE] Line ~70:** Uploaded files are stored in component state initialized from `MOCK_FILES` (an empty `{}`). Every page visit starts with zero files.

---

### FILE: app/(instructor)/instructor/grading/page.tsx

**ISSUES:**

- **[MISSING_RESPONSIVE] Line ~126:** `text-3xl` heading "Grading & Overrides" with no mobile variant.
- **[NO_FEEDBACK] Line ~119:** `overrideMutation.mutate()` — `onSuccess` closes dialog, no toast confirming the override was applied.
- **[INCOMPLETE_FEATURE] Line ~116:** Justification text from the override dialog is collected in state but **never sent to the mutation**. The `overrideMutation.mutate()` call only passes `{ attemptId, passed, adminId }` — the justification string is discarded.

---

### FILE: app/(instructor)/cohorts/page.tsx

**ISSUES:**

- **[STUB_PAGE] Entire file:** Only renders a heading "My Cohorts" and a description paragraph. No data fetching, no table, no functionality.

---

### FILE: app/(instructor)/scan/page.tsx

**ISSUES:**

- **[STUB_PAGE] Entire file:** Only renders a heading "QR Scanner" and a description paragraph. No scanning functionality. (Note: The real scan implementation is on `/instructor/attendance` instead.)
- **[MISSING_RESPONSIVE] Line ~4:** `text-3xl` heading with no mobile variant.

---

### FILE: components/student/notification-panel.tsx

**ISSUES:**

- **[MISSING_INTERACTIVITY] Lines ~80–120:** Clicking a notification only marks it as read. Notifications do not navigate the user to the relevant content (e.g., clicking "You passed the test" should link to the course/certificate).

---

### FILE: components/student/sidebar.tsx

**ISSUES:**

- **[INCOMPLETE_FEATURE] Line ~30 (approx):** Notification count badge reads directly from `mockNotifications` import. This is a static import — the count does not update reactively when notifications are marked as read via the notification panel.

---

### FILE: components/landing-nav.tsx

**ISSUES:**

- **[INCOMPLETE_FEATURE] Lines ~1–50:** Mobile hamburger view only shows "Sign In" and "Register" links. The desktop nav shows no additional page links either. If the landing page "Browse Courses" button were functional, there's no corresponding nav link.

---

## Cross-Cutting Issues

### 1. No Toast/Notification System Implemented

The project has `@radix-ui/react-toast` in `package-lock.json` (transitive dep from `radix-ui`) but **no toast component is built** and **no toast is used anywhere** in the codebase. Every single mutation across admin, instructor, and student flows lacks success/error feedback. This affects approximately **16 mutation operations**.

### 2. `text-3xl` Without Responsive Variant (17 Occurrences)

All admin page headings and all instructor page headings use `text-3xl` without `text-2xl sm:text-3xl` (or similar). On a 320px viewport, `text-3xl` (1.875rem / 30px) is oversized. The student pages correctly use `text-2xl sm:text-3xl`.

**Affected files:**

- `app/(admin)/admin/page.tsx` (lines 53, 90)
- `app/(admin)/admin/users/page.tsx` (line 145)
- `app/(admin)/admin/courses/page.tsx` (line 91)
- `app/(admin)/admin/courses/new/page.tsx` (line 113)
- `app/(admin)/admin/courses/[id]/edit/page.tsx` (line 193)
- `app/(admin)/admin/enrollments/page.tsx` (line 49)
- `app/(admin)/admin/waitlist/page.tsx` (line 80)
- `app/(admin)/admin/questions/page.tsx` (line 204)
- `app/(admin)/admin/analytics/page.tsx` (line 143)
- `app/(admin)/admin/settings/page.tsx` (line 69)
- `app/(instructor)/instructor/page.tsx` (line 61)
- `app/(instructor)/instructor/courses/page.tsx` (line 31)
- `app/(instructor)/instructor/students/page.tsx` (line 82)
- `app/(instructor)/instructor/attendance/page.tsx` (line 163)
- `app/(instructor)/instructor/materials/page.tsx` (line 109)
- `app/(instructor)/instructor/grading/page.tsx` (line 126)
- `app/(instructor)/cohorts/page.tsx` (line 4)
- `app/(instructor)/scan/page.tsx` (line 4)
- `app/(student)/courses/[id]/test/page.tsx` (lines 115, 126, 133)

### 3. No Real Authentication

Login and register pages simulate auth with `setTimeout`. There is no JWT, session, or cookie-based auth. All routes are accessible without login. Role-based redirects are hardcoded to `/dashboard`.

### 4. Mock Data Layer Has No Persistence

All data mutations in `use-queries.ts` operate on in-memory arrays via `queryClient.setQueryData`. Data resets completely on page refresh. This is expected for a prototype but means every "save", "create", "delete", and "update" operation is ephemeral.

---

## Pages That Exist in Sidebar but Are Stubs

| Route      | Status              |
| ---------- | ------------------- |
| `/cohorts` | Stub — heading only |
| `/scan`    | Stub — heading only |

---

## What's Working Well

- **Student course catalog** — proper grid layout, search, category filters, enrollment status overlay, `line-clamp` on titles/descriptions.
- **Test engine** (both prerequisite and final) — timer, question navigation, tab-switch detection, copy-paste prevention, auto-submit, flagging, results with pass/fail and remediation links.
- **Certificate verification** (`/verify/[certNumber]`) — clean public page with loading/error/success states, proper QR verification display.
- **Admin Users CRUD** — full create/update/delete with dialogs, search, role/status filters, pagination.
- **Admin Questions CRUD** — two-phase UI (course select → questions), full create/edit/delete per question.
- **Instructor Attendance** — manual entry dialog, simulated QR scan UI with success/error states, course/date filtering.
- **Instructor Grading** — override dialog with justification, course filtering, pass/fail toggle.
- **Empty states** — most tables/lists have empty state messaging (only the admin dashboard certificates section is missing one).
- **Overflow handling** — tables wrap in `overflow-x-auto`, most names/titles use `truncate` or `line-clamp`.
- **Loading states** — all data-fetching pages show a spinner during load.
- **Theme toggle** — works correctly with SSR hydration guard.
- **Service worker registration** — properly registered in instructor layout for offline attendance.

---

_End of audit report._
