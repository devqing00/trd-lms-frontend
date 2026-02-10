# **Comprehensive Product Requirements Document (PRD)**

## **Hybrid Learning Management System (LMS)**

**Version:** 3.0 (Unified)

**Status:** Approved for Development

## **1\. Executive Summary**

This Learning Management System (LMS) is a hybrid platform designed to manage the end-to-end lifecycle of physical training programs reinforced by mandatory digital gatekeeping. Unlike traditional e-learning platforms, this system creates a hard dependency between digital competency (prerequisite testing) and physical participation (classroom attendance).

### **1.1 Core Value Proposition**

The system automates quality control for physical training by ensuring no student can occupy a physical seat without first proving digital competence. It manages limited physical resources (seats) via automated waitlists and bridges the offline gap using QR-based attendance tracking.

### **1.2 Key Objectives**

- **Unified Management:** Centralize the administration of courses, instructors, students, and physical venues.
- **Competency Enforcement:** Prevent enrollment in physical courses until specific digital prerequisites are met.
- **Capacity Control:** Automate venue capacity management to prevent overbooking.
- **Hybrid Tracking:** seamless validation of physical attendance using digital tools (QR Codes), with support for offline environments.
- **Verifiable Credentialing:** Issue secure, publicly verifiable certificates upon successful completion of both digital and physical requirements.

## **2\. User Roles & Personas**

### **2.1 Administrator**

- **Scope:** Full system access.
- **Primary Goals:** Maintain system integrity, manage course catalogs, oversee instructor assignments, monitor global analytics, and handle exception cases (e.g., manual overrides).

### **2.2 Instructor**

- **Scope:** Assigned courses and cohorts.
- **Primary Goals:** Deliver physical training, track student attendance (even without internet), grade subjective assessments, and monitor cohort progress.

### **2.3 Student / Learner**

- **Scope:** Personal learning path.
- **Primary Goals:** Browse course catalog, pass prerequisite tests, secure a seat in physical training, access study materials, and obtain certification.

## **3\. Functional Requirements**

### **3.1 User Management & Authentication**

- **Registration:** The system must support user registration with mandatory fields (Name, Email, Phone, Organization).
- **Authentication:** Secure login using standard protocols (JWT/OAuth2).
- **Role-Based Access Control (RBAC):** Strict segregation of duties. Admins must have the ability to promote/demote users and lock accounts.
- **Profile Management:** Users must be able to view their history, active enrollments, and earned certificates.

### **3.2 Course & Content Management**

- **Course Creation:** Admins must be able to define:
  - **Metadata:** Title, Description, Category, Duration (e.g., "3 Days").
  - **Venue Details:** Physical location address and specific room number.
  - **Capacity Constraints:** Maximum number of seats available.
  - **Waitlist Cap:** Maximum number of allowed waitlisted users.
  - **Instructors:** Assignment of one or multiple instructors to a course instance.
- **Content Hosting:** The system must support the upload and rendering of:
  - PDF Documents (viewable in-browser).
  - Video Content (hosted or embedded links).
  - Presentation Slides.
- **Modular Structure:** Courses must support breaking content into "Modules."
- **Module 0 (Remedial & Foundation):**
  - A globally accessible module designed for foundational knowledge.
  - Must be indexed by topic tags to allow for targeted remediation recommendations.

### **3.3 Assessment Engine (Testing)**

- **Question Bank:** Admins must be able to create and manage a repository of questions.
  - **Types:** Multiple Choice Questions (MCQ).
  - **Tagging:** Each question must be tagged with a specific topic or competency area (e.g., "Safety", "Regulations").
  - **Difficulty:** Optional difficulty rating.
- **Prerequisite Testing (The Gatekeeper):**
  - Courses must have the option to link a mandatory "Prerequisite Test."
  - **Scoring:** Automated grading immediately upon submission.
  - **Attempts:** The system must track the number of attempts and score history.
  - **Encryption:** All test questions and answers must be encrypted at rest.
- **Smart Remediation:**
  - Upon failure, the system must analyze the user's incorrect answers based on question tags.
  - The system must provide specific recommendations pointing the user to relevant sections within "Module 0" rather than a generic failure message.

### **3.4 Enrollment & Capacity Management**

- **Conditional Enrollment:** The "Enroll" action must be strictly conditional. It is disabled if the Prerequisite Test is not passed.
- **Seat Allocation:**
  - Upon a valid enrollment request, the system must check the current enrollment count against the defined Course Capacity.
  - If Current \< Capacity: The user is enrolled, and a seat is deducted.
  - If Current \== Capacity: The user is diverted to the Waitlist flow.
- **Waitlist Management:**
  - Users can join a waitlist if the course is full but the waitlist cap is not reached.
  - **Promotion:** If an enrolled user cancels, the system must either auto-enroll the next waitlisted user or notify them of the opening (configurable).
- **Entry Pass Generation:**
  - Upon confirmed enrollment (not waitlist), the system must generate a unique, time-bound Entry QR Code for the student.

### **3.5 Attendance & Physical Training Management**

- **QR Code Scanning:**
  - Instructors must have a dedicated interface to scan student Entry QR Codes.
  - Scanning must validate the code against the specific course and date.
  - Successful scan updates the student's status to "Attended."
- **Offline Capability (Critical):**
  - The Instructor interface must function fully without an active internet connection.
  - Scanned data must be stored locally on the device.
  - The system must automatically synchronize attendance data with the central server once connectivity is restored.
- **Manual Override:** Instructors and Admins must have the ability to manually mark attendance for exception handling (e.g., broken phone).

### **3.6 Certification & Verification**

- **Eligibility Logic:** The system must only generate a certificate when three conditions are met:
  1. Prerequisite Test Passed.
  2. Physical Attendance Verified (via QR or Override).
  3. Final End-of-Course Exam Passed.
- **Certificate Generation:**
  - Automated PDF generation including Student Name, Course Title, Date, and Unique Certificate ID.
- **Public Verification:**
  - Certificates must include a QR code or URL.
  - This link must lead to a public, unauthenticated page on the LMS that validates the certificate's authenticity to third parties (employers/auditors).

### **3.7 Communication & Notifications**

- The system must trigger automated notifications (Email/In-App) for:
  - Enrollment Confirmation (with calendar invite/Entry QR).
  - Waitlist Status Updates (Joined/Promoted).
  - Class Reminders (24-48 hours prior).
  - Certificate Availability.

## **4\. Non-Functional Requirements**

### **4.1 Performance & Scalability**

- **Concurrency:** The system must support high-volume concurrent access (e.g., 500+ users starting a test simultaneously) without degradation.
- **Latency:** Test grading must be completed within 1 second of submission.
- **Capacity:** Architecture must allow scaling to support up to 10,000 active student profiles.

### **4.2 Security & Compliance**

- **Data Protection:** All personal user data and test content must be encrypted in transit and at rest.
- **Session Management:**
  - Secure session handling with automatic timeouts for inactivity.
  - Implement session rotation on sensitive actions (role changes, enrollment).
  - Content Security Policy (CSP) headers must be enforced to prevent XSS attacks.
- **QR Code Security:**
  - Entry QR codes must be time-bound (valid only for the course date ±24 hours).
  - QR payload must be cryptographically signed using HMAC-SHA256 to prevent forgery.
  - Codes must include unique nonce to prevent screenshot sharing between students.
- **Test Integrity:**
  - Questions must be randomized per attempt (order and answer choices).
  - Tab-switching/focus-loss detection must log warnings (configurable: hard-fail or soft-warning).
  - Individual question time limits (optional, configurable per test).
  - Prevent copy-paste operations within the test interface.
- **Audit Logging:** Comprehensive logs of all critical actions (Grading, Enrollment, Attendance marking) must be accessible to Admins for dispute resolution.

### **4.3 Reliability & Availability**

- **Offline First:** The Instructor module must be treated as an "Offline First" Progressive Web App (PWA) to ensure training continuity in remote locations with poor connectivity.
- **Data Integrity:**
  - Prevent race conditions during enrollment to ensure the number of enrolled students never exceeds physical capacity.
  - Use database-level atomic operations (e.g., optimistic locking, transactions) for seat allocation.
  - Implement row-level locking for concurrent waitlist promotions.

### **4.4 Scalability & Performance Architecture**

- **Waitlist Race Condition Prevention:**
  - When a seat becomes available, use atomic database transactions to claim the next waitlist slot.
  - Implement a background job queue (e.g., BullMQ, Agenda) to process waitlist notifications.
  - Notification order must be strictly FIFO based on waitlist join timestamp.
  - If the first user doesn't confirm within a configurable timeout (e.g., 24 hours), automatically offer to the next person.
- **Certificate Generation:**
  - PDF generation must be asynchronous (background job queue).
  - Do NOT generate certificates synchronously in API requests.
  - Queue system must handle retries for generation failures.
  - Status endpoint must allow polling for certificate completion ("Generating...", "Ready").
- **High-Concurrency Scenarios:**
  - Test submission endpoints must handle burst traffic (e.g., 500 submissions in 60 seconds).
  - Use database connection pooling and caching layers (Redis) for frequently accessed data (course catalogs).

### **4.5 Usability & Accessibility**

- **Device Support:**
  - Student Portal: Responsive Web (Mobile/Tablet/Desktop).
  - Instructor Portal: Progressive Web App (PWA) - Mobile-Optimized for handheld scanning with offline capabilities.
  - Admin Portal: Desktop-Optimized for complex management tasks.
- **UI Feedback:** Clear visual indicators for system status (e.g., "Syncing...", "Offline Mode", "You are #5 on Waitlist").
- **Note:** All portals are web-based. No native mobile applications will be developed.

## **5\. Reporting & Analytics**

- **Course Metrics:** Enrollment numbers, Waitlist depth, Drop-off rates.
- **Student Performance:** Pass/Fail rates on specific tests and individual questions (to identify weak curriculum areas).
- **Instructor Performance:** Attendance rates per cohort and student feedback scores (if applicable).
- **System Health:** Sync logs and error rates from offline instructor devices.
