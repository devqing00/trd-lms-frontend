# TRD LMS — Backend API Specification

> **Version:** 1.0  
> **Frontend:** Next.js 16 + React 19 + TanStack Query v5  
> **Base URL:** `https://api.trd-lms.ui.edu.ng/v1`  
> **Auth:** JWT Bearer tokens (header: `Authorization: Bearer <token>`)  
> **Date Format:** ISO 8601 (`2025-01-15T09:00:00.000Z`)  
> **Currency:** Nigerian Naira (₦, integer values — no decimals)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Users](#2-users)
3. [Courses](#3-courses)
4. [Enrollments](#4-enrollments)
5. [Waitlist](#5-waitlist)
6. [Cohorts](#6-cohorts)
7. [Certificates](#7-certificates)
8. [Question Bank](#8-question-bank)
9. [Tests](#9-tests)
10. [Test Attempts](#10-test-attempts)
11. [Attendance](#11-attendance)
12. [Analytics](#12-analytics)
13. [Notifications](#13-notifications)
14. [Shared Types & Enums](#14-shared-types--enums)
15. [Pagination & Filtering](#15-pagination--filtering)
16. [Platform Constants](#16-platform-constants)
17. [Error Handling](#17-error-handling)

---

## 1. Authentication

### `POST /auth/login`

Login with email and password.

**Request:**

```json
{
  "email": "user@ui.edu.ng",
  "password": "string"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": { ...User }
}
```

### `POST /auth/register`

Register a new student account.

**Request:**

```json
{
  "name": "Adebayo Ogundimu",
  "email": "adebayo@student.ui.edu.ng",
  "phone": "08012345678",
  "organization": "Faculty of Science",
  "password": "securePassword123"
}
```

**Response (201):** `{ "token": "...", "user": { ...User } }`

### `POST /auth/refresh`

Refresh an expired access token.

**Request:** `{ "refreshToken": "..." }`  
**Response:** `{ "token": "...", "refreshToken": "..." }`

### `POST /auth/logout`

Invalidate current tokens.

**Response (204):** No content.

---

## 2. Users

### `GET /users`

**Auth:** Admin only  
**Query Params:** `?search=&role=&status=&page=1&pageSize=15&sortKey=name&sortDir=asc`

**Response (200):**

```json
{
  "data": [User],
  "total": 50,
  "page": 1,
  "pageSize": 15,
  "totalPages": 4
}
```

### `POST /users`

**Auth:** Admin only  
Create a new user (admin can create instructors/students).

**Request:**

```json
{
  "name": "Dr. Fatimah Ibrahim",
  "email": "fatimah@ui.edu.ng",
  "phone": "08098765432",
  "organization": "ITeMS, University of Ibadan",
  "role": "instructor"
}
```

**Response (201):** `User`

### `PATCH /users/:id`

**Auth:** Admin or self  
Update user profile fields.

**Request:** Partial user fields:

```json
{
  "name": "Updated Name",
  "phone": "08011111111",
  "organization": "New Department",
  "status": "suspended"
}
```

**Response (200):** `User`

### `DELETE /users/:id`

**Auth:** Admin only

**Response (204):** No content.

### `GET /users/me`

**Auth:** Any authenticated user  
Returns the current user's profile.

**Response (200):** `User`

### `PATCH /users/me/avatar`

**Auth:** Any authenticated user  
Upload avatar image (multipart form data).

**Request:** `Content-Type: multipart/form-data`, field: `avatar` (image file, max 2MB)

**Response (200):** `{ "avatarUrl": "https://..." }`

---

### User Object

```typescript
{
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role: "admin" | "instructor" | "student";
  status: "active" | "suspended" | "pending";
  avatarUrl?: string;
  lastLoginAt?: string;   // ISO 8601
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

---

## 3. Courses

### `GET /courses`

**Auth:** Admin / Instructor (all courses) or Public (published only)

**Query Params:**

- `search` — search title, description, category
- `status` — `draft | published | archived` (admin only)
- `category` — filter by category string
- `page`, `pageSize`, `sortKey`, `sortDir`

**Response (200):** `PaginatedResponse<Course>`

### `GET /courses/:id`

**Auth:** Any (published) or Admin/Instructor (any status)

**Response (200):** `Course` (includes full `modules` array with content items)

### `GET /courses/published`

**Auth:** Public (no auth required)  
Returns only published courses for the student catalog.

**Query Params:** `?search=&category=`

**Response (200):** `Course[]`

### `POST /courses`

**Auth:** Admin only

**Request:**

```json
{
  "title": "Data Science & Machine Learning",
  "description": "Comprehensive data science training...",
  "category": "Data & Analytics",
  "duration": "4 months",
  "topics": ["Python", "Machine Learning", "TensorFlow", "Data Visualization"],
  "pricing": {
    "fee": 300000,
    "cohortFee": 250000,
    "specialFee": 500000
  },
  "venue": {
    "address": "ITeMS Building, University of Ibadan",
    "room": "Training Lab 1"
  },
  "capacity": 30,
  "waitlistCap": 10,
  "instructorIds": ["usr-5", "usr-12"],
  "status": "draft",
  "prerequisiteTestId": "test-001",
  "postCourseTestId": "test-002"
}
```

**Response (201):** `Course`

### `PATCH /courses/:id`

**Auth:** Admin only

**Request:** Partial course fields (any subset of the create payload + `status`)

**Response (200):** `Course`

### `DELETE /courses/:id`

**Auth:** Admin only  
Also deletes associated enrollments, waitlist entries, and test assignments.

**Response (204):** No content.

---

### Course Object

```typescript
{
  id: string;
  title: string;
  description: string;
  category: string;            // e.g. "ICT & Digital Literacy"
  duration: string;            // e.g. "2 Weeks", "4 months"
  topics?: string[];           // ["Python", "Web Dev", ...]
  pricing: {
    fee: number;               // Standard fee in ₦ (integer)
    cohortFee?: number;        // Discounted cohort fee
    specialFee?: number;       // Special class (3-5 students) fee
  };
  venue: {
    address: string;
    room: string;
  };
  capacity: number;
  waitlistCap: number;
  instructorIds: string[];
  status: "draft" | "published" | "archived";
  prerequisiteTestId?: string;
  postCourseTestId?: string;
  modules: CourseModule[];
  enrolledCount: number;       // computed / denormalized
  waitlistCount: number;       // computed / denormalized
  createdAt: string;
  updatedAt: string;
}
```

### CourseModule Object

```typescript
{
  id: string;
  title: string;
  order: number;               // Display order (1-based)
  testId?: string;             // End-of-module test
  contentItems: ContentItem[];
}
```

### ContentItem Object

```typescript
{
  id: string;
  type: "pdf" | "video" | "slides" | "text";
  title: string;
  url?: string;                // For pdf, video, slides
  content?: string;            // For text type (rich text / markdown)
}
```

---

## 4. Enrollments

### `GET /enrollments`

**Auth:** Admin

**Query Params:**

- `courseId` — filter by course
- `search` — search by userName, courseName
- `status` — `enrolled | waitlisted | completed | cancelled`
- `page`, `pageSize`, `sortKey`, `sortDir`

**Response (200):** `PaginatedResponse<Enrollment>`

### `POST /enrollments`

**Auth:** Student (self-enrollment)  
Enrolls the authenticated student in a course. If the course is full, the student is automatically added to the waitlist.

**Request:**

```json
{
  "courseId": "crs-001"
}
```

**Response (201):** `Enrollment`  
Note: The response includes a `qrCode` field containing the QR code payload for attendance scanning.

### `PATCH /enrollments/:id/status`

**Auth:** Admin  
Change enrollment status (cancel, complete, reinstate).

**Request:**

```json
{
  "status": "completed"
}
```

**Response (200):** `Enrollment`  
Note: When status changes to `"completed"`, the server should set `completedAt` to the current timestamp.

### `GET /enrollments/me`

**Auth:** Student  
Returns the authenticated student's enrollments.

**Response (200):** `Enrollment[]`

---

### Enrollment Object

```typescript
{
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  status: "enrolled" | "waitlisted" | "completed" | "cancelled";
  enrolledAt?: string;
  completedAt?: string;
  qrCode?: string;             // QR payload for attendance entry pass
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Waitlist

### `GET /waitlist`

**Auth:** Admin

**Query Params:**

- `courseId` — filter by course
- `search` — userName, courseName
- `page`, `pageSize`

**Response (200):** `PaginatedResponse<WaitlistEntry>`  
Sorted by `position` ascending.

### `POST /waitlist/:id/promote`

**Auth:** Admin  
Promotes a waitlist entry to enrolled status. Creates an enrollment record.

**Response (200):** `WaitlistEntry` (with status `"promoted"`)

### `DELETE /waitlist/:id`

**Auth:** Admin  
Removes the entry from the waitlist.

**Response (204):** No content.

### `GET /waitlist/me`

**Auth:** Student  
Returns the authenticated student's waitlist entries.

**Response (200):** `WaitlistEntry[]`

---

### WaitlistEntry Object

```typescript
{
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  position: number;            // Queue position (1 = first in line)
  status: "waiting" | "offered" | "expired" | "promoted";
  offeredAt?: string;
  expiresAt?: string;          // Offer expiry deadline
  createdAt: string;
  updatedAt: string;
}
```

---

## 6. Cohorts

### `GET /cohorts`

**Auth:** Admin / Instructor

**Query Params:**

- `courseId` — filter by course
- `search` — courseName, instructorName
- `status` — `scheduled | in-progress | completed | cancelled`
- `page`, `pageSize`, `sortKey`, `sortDir`

**Response (200):** `PaginatedResponse<Cohort>`

### `POST /cohorts`

**Auth:** Admin

**Request:**

```json
{
  "courseId": "crs-001",
  "courseName": "Tech Odyssey",
  "instructorId": "usr-5",
  "instructorName": "Dr. A. Ibrahim",
  "startDate": "2025-08-01T00:00:00.000Z",
  "endDate": "2025-08-14T00:00:00.000Z",
  "status": "scheduled",
  "capacity": 30
}
```

**Response (201):** `Cohort`

### `PATCH /cohorts/:id`

**Auth:** Admin

**Request:** Partial cohort fields.

**Response (200):** `Cohort`

### `DELETE /cohorts/:id`

**Auth:** Admin

**Response (204):** No content.

### `GET /cohorts/instructor`

**Auth:** Instructor  
Returns cohorts assigned to the authenticated instructor.

**Response (200):** `Cohort[]`

---

### Cohort Object

```typescript
{
  id: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  enrolledCount: number; // computed
  capacity: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 7. Certificates

### `GET /certificates`

**Auth:** Admin

**Query Params:**

- `courseId`, `search` (userName, courseName, certificateNumber), `status` (`generating | ready | revoked`)
- `page`, `pageSize`

**Response (200):** `PaginatedResponse<Certificate>`

### `POST /certificates/generate`

**Auth:** Admin  
Generates a completion certificate for a student who completed a course.

**Request:**

```json
{
  "userId": "usr-1",
  "courseId": "crs-001"
}
```

**Response (201):** `Certificate`

- `certificateNumber` format: `TRD-YYYY-XXXXX` (e.g. `TRD-2025-8A3F2`)
- `verificationUrl`: `https://trd-lms.ui.edu.ng/verify/TRD-2025-8A3F2`
- `status`: `"ready"`
- `issuedAt`: current timestamp
- The server should resolve `instructorName` from the course's assigned instructor(s).

### `PATCH /certificates/:id/revoke`

**Auth:** Admin  
Revokes a certificate.

**Response (200):** `Certificate` (status: `"revoked"`, `revokedAt` set)

### `GET /certificates/verify/:certNumber`

**Auth:** Public (no auth)  
Public verification endpoint.

**Response (200):** `Certificate | null`

### `GET /certificates/me`

**Auth:** Student  
Returns the authenticated student's certificates.

**Response (200):** `Certificate[]`

---

### Certificate Object

```typescript
{
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  instructorId?: string;
  instructorName?: string;
  certificateNumber: string;   // "TRD-2025-8A3F2"
  status: "generating" | "ready" | "revoked";
  issuedAt?: string;
  revokedAt?: string;
  verificationUrl: string;     // Public verification link
  createdAt: string;
  updatedAt: string;
}
```

---

## 8. Question Bank

### `GET /questions`

**Auth:** Admin / Instructor

**Query Params:**

- `courseId` (required context — questions belong to a course)
- `search` — text search in question text
- `difficulty` — `easy | medium | hard`
- `tag` — topic/tag string

**Response (200):** `Question[]`

### `POST /questions`

**Auth:** Admin

**Request:**

```json
{
  "courseId": "crs-001",
  "text": "What is the keyboard shortcut to save a document?",
  "type": "mcq",
  "options": [
    { "id": "opt-a", "text": "Ctrl+S" },
    { "id": "opt-b", "text": "Ctrl+P" },
    { "id": "opt-c", "text": "Ctrl+Z" },
    { "id": "opt-d", "text": "Ctrl+X" }
  ],
  "correctOptionId": "opt-a",
  "tags": ["ICT Fundamentals", "Shortcuts"],
  "difficulty": "easy"
}
```

**Response (201):** `Question`

### `PATCH /questions/:id`

**Auth:** Admin

**Request:** Partial question fields.

**Response (200):** `Question`

### `DELETE /questions/:id`

**Auth:** Admin

**Response (204):** No content.

---

### Question Object

```typescript
{
  id: string;
  courseId: string;
  text: string;
  type: "mcq";                 // Extensible: future may add "true-false", "short-answer"
  options: { id: string; text: string }[];
  correctOptionId: string;     // Must match one of options[].id
  tags: string[];              // Topic tags within the course
  difficulty?: "easy" | "medium" | "hard";
}
```

---

## 9. Tests

### `GET /tests`

**Auth:** Admin

**Response (200):** `Test[]`

### `GET /tests/:id`

**Auth:** Admin / Student (for taking tests)

**Response (200):** `Test`  
**Note:** When returning to students for test-taking, `correctOptionId` MUST be stripped from the questions. Only return `{ id, text, options }` per question.

### `POST /tests`

**Auth:** Admin

**Request:**

```json
{
  "title": "ICT Prerequisite Assessment",
  "courseId": "crs-001",
  "category": "prerequisite",
  "questionIds": ["q-001", "q-002", "q-003"],
  "passingScore": 70,
  "maxAttempts": 3,
  "timeLimitMinutes": 30
}
```

**Response (201):** `Test` (with fully populated `questions` array)

### `PATCH /tests/:id`

**Auth:** Admin

**Request:** Partial test fields.

**Response (200):** `Test`

### `DELETE /tests/:id`

**Auth:** Admin  
Also unlinks from courses (`prerequisiteTestId`, `postCourseTestId`).

**Response (204):** No content.

---

### Test Object

```typescript
{
  id: string;
  title: string;
  courseId: string;
  category: "prerequisite" | "post-course" | "module";
  questions: Question[];       // Fully populated
  passingScore: number;        // Percentage (0-100)
  maxAttempts: number;
  timeLimitMinutes?: number;   // null/0 = no limit
}
```

---

## 10. Test Attempts

### `GET /test-attempts`

**Auth:** Admin

**Query Params:**

- `testId` — filter by test
- `page`, `pageSize`

**Response (200):** `PaginatedResponse<TestAttempt>`

### `GET /test-attempts/me?testId=xxx`

**Auth:** Student  
Returns the student's attempts for a specific test.

**Response (200):** `TestAttempt[]`

### `POST /test-attempts`

**Auth:** Student  
Submit answers for a test. The server auto-scores by comparing to `correctOptionId`.

**Request:**

```json
{
  "testId": "test-001",
  "answers": [
    { "questionId": "q-001", "selectedOptionId": "opt-a" },
    { "questionId": "q-002", "selectedOptionId": "opt-c" }
  ]
}
```

**Response (201):**

```json
{
  "id": "attempt-001",
  "testId": "test-001",
  "userId": "usr-1",
  "userName": "Student Name",
  "userEmail": "student@ui.edu.ng",
  "score": 80,
  "passed": true,
  "attemptNumber": 1,
  "answers": [...],
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Scoring Logic:**

- `score = (correctAnswers / totalQuestions) * 100` (rounded to nearest integer)
- `passed = score >= test.passingScore`
- Reject if `attemptNumber > test.maxAttempts`

### `PATCH /test-attempts/:id/override`

**Auth:** Admin only  
Admin manual override of pass/fail status (PRD §2.5).

**Request:**

```json
{
  "passed": true
}
```

**Response (200):**

```json
{
  ...TestAttempt,
  "isOverridden": true,
  "overriddenBy": "admin-user-id",
  "overriddenAt": "2025-01-15T..."
}
```

---

### TestAttempt Object

```typescript
{
  id: string;
  testId: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;               // 0–100
  passed: boolean;
  attemptNumber: number;
  answers: { questionId: string; selectedOptionId: string }[];
  isOverridden?: boolean;
  overriddenBy?: string;       // Admin userId who overrode
  overriddenAt?: string;       // ISO 8601
  createdAt: string;
  updatedAt: string;
}
```

---

## 11. Attendance

### `GET /attendance`

**Auth:** Admin / Instructor

**Query Params:**

- `courseId` — filter by course
- `date` — filter by date (YYYY-MM-DD)
- `search` — userName
- `page`, `pageSize`

**Response (200):** `PaginatedResponse<AttendanceRecord>`

### `POST /attendance`

**Auth:** Instructor  
Mark attendance for a student (via manual selection or QR scan).

**Request:**

```json
{
  "enrollmentId": "enr-001",
  "userId": "usr-1",
  "courseId": "crs-001",
  "date": "2025-07-15",
  "status": "present",
  "method": "qr"
}
```

**Response (201):** `AttendanceRecord`

---

### AttendanceRecord Object

```typescript
{
  id: string;
  enrollmentId: string;
  userId: string;
  userName: string;
  courseId: string;
  date: string;                // "2025-07-15"
  status: "present" | "absent" | "excused";
  scannedBy?: string;          // Instructor who scanned
  method: "qr" | "manual";
  createdAt: string;
  updatedAt: string;
}
```

---

## 12. Analytics

### `GET /analytics`

**Auth:** Admin only

**Response (200):**

```json
{
  "enrollmentsPerCourse": [{ "courseId": "crs-001", "courseName": "Tech Odyssey", "count": 25 }],
  "passFailRates": [
    { "courseId": "crs-001", "courseName": "Tech Odyssey", "passed": 18, "failed": 7, "total": 25 }
  ],
  "studentActivity": {
    "active": 120,
    "inactive": 30,
    "total": 150
  },
  "instructorPerformance": [
    {
      "instructorId": "usr-5",
      "instructorName": "Dr. Ibrahim",
      "coursesAssigned": 3,
      "avgPassRate": 85.5
    }
  ],
  "monthlyEnrollments": [
    { "month": "Jan", "count": 45 },
    { "month": "Feb", "count": 52 }
  ],
  "categoryDistribution": [
    { "category": "ICT & Digital Literacy", "count": 15 },
    { "category": "Data & Analytics", "count": 8 }
  ]
}
```

### `GET /analytics/dashboard`

**Auth:** Admin

**Response (200):**

```json
{
  "totalUsers": 150,
  "totalCourses": 40,
  "activeEnrollments": 120,
  "waitlistTotal": 35,
  "certificatesIssued": 89,
  "usersByRole": { "admin": 5, "instructor": 12, "student": 133 },
  "coursesByStatus": { "published": 25, "draft": 10, "archived": 5 },
  "recentEnrollments": [Enrollment, Enrollment, ...]
}
```

### `GET /analytics/instructor`

**Auth:** Instructor

**Response (200):**

```json
{
  "assignedCourses": 3,
  "totalStudents": 75,
  "attendanceRate": 87.5,
  "upcomingSessionsCount": 2,
  "recentAttendance": [AttendanceRecord, ...]
}
```

---

## 13. Notifications

### `GET /notifications`

**Auth:** Any authenticated user

**Response (200):** `Notification[]`

### `PATCH /notifications/:id/read`

**Auth:** Any authenticated user

**Response (200):** `{ success: true }`

### `PATCH /notifications/read-all`

**Auth:** Any authenticated user

**Response (200):** `{ success: true }`

---

### Notification Object

```typescript
{
  id: string;
  type: "enrollment" | "waitlist" | "reminder" | "certificate" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
```

---

## 14. Shared Types & Enums

### Status Enums

| Domain              | Values                                               |
| ------------------- | ---------------------------------------------------- |
| `UserRole`          | `admin`, `instructor`, `student`                     |
| `UserStatus`        | `active`, `suspended`, `pending`                     |
| `CourseStatus`      | `draft`, `published`, `archived`                     |
| `EnrollmentStatus`  | `enrolled`, `waitlisted`, `completed`, `cancelled`   |
| `AttendanceStatus`  | `present`, `absent`, `excused`                       |
| `CertificateStatus` | `generating`, `ready`, `revoked`                     |
| `WaitlistStatus`    | `waiting`, `offered`, `expired`, `promoted`          |
| `CohortStatus`      | `scheduled`, `in-progress`, `completed`, `cancelled` |
| `TestCategory`      | `prerequisite`, `post-course`, `module`              |

### Course Categories (Seed)

```
ICT & Digital Literacy
Research & Academic Writing
Health & Safety
Leadership & Management
Laboratory & Technical Skills
Data & Analytics
Professional Development
```

---

## 15. Pagination & Filtering

All list endpoints accept these common query parameters:

| Param      | Type            | Default | Description                             |
| ---------- | --------------- | ------- | --------------------------------------- |
| `page`     | integer         | 1       | Page number (1-based)                   |
| `pageSize` | integer         | 15      | Items per page (max 100)                |
| `search`   | string          | —       | Full-text search across relevant fields |
| `sortKey`  | string          | —       | Field name to sort by                   |
| `sortDir`  | `asc` \| `desc` | `asc`   | Sort direction                          |
| `status`   | string          | —       | Status filter (domain-specific)         |
| `category` | string          | —       | Course category filter                  |
| `courseId` | string          | —       | Filter by course ID                     |

### Paginated Response Shape

```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "pageSize": 15,
  "totalPages": 7
}
```

---

## 16. Platform Constants

These values should be stored in server configuration and can be served via a `/config` endpoint:

| Key                          | Value                                                                                 | Description                        |
| ---------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------- |
| `APPLICATION_FORM_FEE`       | `2000`                                                                                | ₦2,000 application processing fee  |
| `SPECIAL_CLASS_MIN_STUDENTS` | `3`                                                                                   | Minimum students for special class |
| `SPECIAL_CLASS_MAX_STUDENTS` | `5`                                                                                   | Maximum students for special class |
| `ENROLLMENT_POLICY`          | `"Enrollment of students is monthly — Class begins at the beginning of a new month."` | Displayed to students              |
| `CONTACT_PHONES`             | `["0803-302-7479", "0802-924-8172", "0806-273-3470"]`                                 | TRD contact numbers                |
| `AVAILABLE_FACILITIES`       | `["State-of-the-art computers", "Conducive environment", "Seasoned instructors"]`     | Facilities list                    |

### `GET /config`

**Auth:** Public

**Response (200):**

```json
{
  "applicationFormFee": 2000,
  "specialClassMinStudents": 3,
  "specialClassMaxStudents": 5,
  "enrollmentPolicy": "Enrollment of students is monthly...",
  "contactPhones": ["0803-302-7479", ...],
  "availableFacilities": ["State-of-the-art computers", ...]
}
```

---

## 17. Error Handling

### Error Response Shape

```json
{
  "message": "Course not found",
  "code": "RESOURCE_NOT_FOUND",
  "statusCode": 404
}
```

### Standard HTTP Status Codes

| Code | Meaning               | When                                                  |
| ---- | --------------------- | ----------------------------------------------------- |
| 200  | OK                    | Successful read/update                                |
| 201  | Created               | Successful creation                                   |
| 204  | No Content            | Successful deletion                                   |
| 400  | Bad Request           | Validation error, missing required fields             |
| 401  | Unauthorized          | Missing or invalid token                              |
| 403  | Forbidden             | Insufficient role permissions                         |
| 404  | Not Found             | Resource not found                                    |
| 409  | Conflict              | Duplicate email, already enrolled, etc.               |
| 422  | Unprocessable Entity  | Business rule violation (e.g., max attempts exceeded) |
| 500  | Internal Server Error | Server-side errors                                    |

### Common Error Codes

| Code                    | Description                         |
| ----------------------- | ----------------------------------- |
| `VALIDATION_ERROR`      | Request body failed validation      |
| `RESOURCE_NOT_FOUND`    | Requested resource doesn't exist    |
| `DUPLICATE_ENTRY`       | Email/enrollment already exists     |
| `UNAUTHORIZED`          | Authentication required             |
| `FORBIDDEN`             | Role doesn't have permission        |
| `MAX_ATTEMPTS_EXCEEDED` | Student exceeded test attempt limit |
| `COURSE_FULL`           | Course at capacity (auto-waitlist)  |
| `WAITLIST_FULL`         | Both course and waitlist are full   |

---

## Appendix A: API Endpoint Summary

| Method | Endpoint                           | Auth             | Description        |
| ------ | ---------------------------------- | ---------------- | ------------------ |
| POST   | `/auth/login`                      | Public           | Login              |
| POST   | `/auth/register`                   | Public           | Register student   |
| POST   | `/auth/refresh`                    | Public           | Refresh token      |
| POST   | `/auth/logout`                     | Any              | Logout             |
| GET    | `/users`                           | Admin            | List users         |
| POST   | `/users`                           | Admin            | Create user        |
| PATCH  | `/users/:id`                       | Admin/Self       | Update user        |
| DELETE | `/users/:id`                       | Admin            | Delete user        |
| GET    | `/users/me`                        | Any              | Get current user   |
| PATCH  | `/users/me/avatar`                 | Any              | Upload avatar      |
| GET    | `/courses`                         | Admin/Instructor | List all courses   |
| GET    | `/courses/:id`                     | Any              | Get course detail  |
| GET    | `/courses/published`               | Public           | Student catalog    |
| POST   | `/courses`                         | Admin            | Create course      |
| PATCH  | `/courses/:id`                     | Admin            | Update course      |
| DELETE | `/courses/:id`                     | Admin            | Delete course      |
| GET    | `/enrollments`                     | Admin            | List enrollments   |
| POST   | `/enrollments`                     | Student          | Self-enroll        |
| PATCH  | `/enrollments/:id/status`          | Admin            | Change status      |
| GET    | `/enrollments/me`                  | Student          | My enrollments     |
| GET    | `/waitlist`                        | Admin            | List waitlist      |
| POST   | `/waitlist/:id/promote`            | Admin            | Promote entry      |
| DELETE | `/waitlist/:id`                    | Admin            | Remove entry       |
| GET    | `/waitlist/me`                     | Student          | My waitlist        |
| GET    | `/cohorts`                         | Admin/Instructor | List cohorts       |
| POST   | `/cohorts`                         | Admin            | Create cohort      |
| PATCH  | `/cohorts/:id`                     | Admin            | Update cohort      |
| DELETE | `/cohorts/:id`                     | Admin            | Delete cohort      |
| GET    | `/cohorts/instructor`              | Instructor       | My cohorts         |
| GET    | `/certificates`                    | Admin            | List certificates  |
| POST   | `/certificates/generate`           | Admin            | Generate cert      |
| PATCH  | `/certificates/:id/revoke`         | Admin            | Revoke cert        |
| GET    | `/certificates/verify/:certNumber` | Public           | Verify cert        |
| GET    | `/certificates/me`                 | Student          | My certificates    |
| GET    | `/questions`                       | Admin/Instructor | List questions     |
| POST   | `/questions`                       | Admin            | Create question    |
| PATCH  | `/questions/:id`                   | Admin            | Update question    |
| DELETE | `/questions/:id`                   | Admin            | Delete question    |
| GET    | `/tests`                           | Admin            | List tests         |
| GET    | `/tests/:id`                       | Admin/Student    | Get test           |
| POST   | `/tests`                           | Admin            | Create test        |
| PATCH  | `/tests/:id`                       | Admin            | Update test        |
| DELETE | `/tests/:id`                       | Admin            | Delete test        |
| GET    | `/test-attempts`                   | Admin            | List attempts      |
| GET    | `/test-attempts/me`                | Student          | My attempts        |
| POST   | `/test-attempts`                   | Student          | Submit attempt     |
| PATCH  | `/test-attempts/:id/override`      | Admin            | Override result    |
| GET    | `/attendance`                      | Admin/Instructor | List attendance    |
| POST   | `/attendance`                      | Instructor       | Mark attendance    |
| GET    | `/analytics`                       | Admin            | Full analytics     |
| GET    | `/analytics/dashboard`             | Admin            | Dashboard stats    |
| GET    | `/analytics/instructor`            | Instructor       | Instructor stats   |
| GET    | `/notifications`                   | Any              | List notifications |
| PATCH  | `/notifications/:id/read`          | Any              | Mark read          |
| PATCH  | `/notifications/read-all`          | Any              | Mark all read      |
| GET    | `/config`                          | Public           | Platform config    |

**Total: 50 endpoints across 13 domains.**

---

## Appendix B: Database Schema Suggestions

### Recommended Tables

1. **users** — id, name, email, phone, organization, role, status, avatar_url, password_hash, last_login_at, created_at, updated_at
2. **courses** — id, title, description, category, duration, fee, cohort_fee, special_fee, venue_address, venue_room, capacity, waitlist_cap, status, prerequisite_test_id, post_course_test_id, created_at, updated_at
3. **course_topics** — course_id, topic (or JSON array on courses table)
4. **course_instructors** — course_id, user_id (join table)
5. **course_modules** — id, course_id, title, order, test_id
6. **content_items** — id, module_id, type, title, url, content
7. **enrollments** — id, user_id, course_id, status, enrolled_at, completed_at, qr_code, created_at, updated_at
8. **waitlist** — id, user_id, course_id, position, status, offered_at, expires_at, created_at, updated_at
9. **cohorts** — id, course_id, instructor_id, start_date, end_date, status, capacity, created_at, updated_at
10. **certificates** — id, user_id, course_id, instructor_id, certificate_number, status, issued_at, revoked_at, verification_url, created_at, updated_at
11. **questions** — id, course_id, text, type, options (JSON), correct_option_id, tags (JSON), difficulty
12. **tests** — id, title, course_id, category, passing_score, max_attempts, time_limit_minutes
13. **test_questions** — test_id, question_id, order (join table)
14. **test_attempts** — id, test_id, user_id, score, passed, attempt_number, answers (JSON), is_overridden, overridden_by, overridden_at, created_at, updated_at
15. **attendance** — id, enrollment_id, user_id, course_id, date, status, scanned_by, method, created_at, updated_at
16. **notifications** — id, user_id, type, title, message, read, created_at

### Key Indexes

- `users.email` — unique
- `enrollments(user_id, course_id)` — unique
- `waitlist(user_id, course_id)` — unique
- `certificates.certificate_number` — unique
- `attendance(enrollment_id, date)` — unique
- `test_attempts(test_id, user_id, attempt_number)` — unique

### Denormalized Fields

The frontend expects these computed fields. Choose between:

- **Option A:** Compute on read (JOIN + COUNT)
- **Option B:** Maintain denormalized counters with triggers/events

| Field                    | On                                              | Source                                                    |
| ------------------------ | ----------------------------------------------- | --------------------------------------------------------- |
| `enrolledCount`          | courses                                         | COUNT of enrollments WHERE status='enrolled'              |
| `waitlistCount`          | courses                                         | COUNT of waitlist WHERE status='waiting'                  |
| `enrolledCount`          | cohorts                                         | COUNT of enrollments in cohort's course during date range |
| `userName`, `courseName` | enrollments, waitlist, certificates, attendance | Denormalized from users/courses for display               |
