// ============================================
// LMS Domain Types
// ============================================

// --- Enums ---

export type UserRole = "admin" | "instructor" | "student";
export type UserStatus = "active" | "suspended" | "pending";
export type CourseStatus = "draft" | "published" | "archived";
export type EnrollmentStatus = "enrolled" | "waitlisted" | "completed" | "cancelled";
export type AttendanceStatus = "present" | "absent" | "excused";
export type CertificateStatus = "generating" | "ready" | "revoked";
export type WaitlistStatus = "waiting" | "offered" | "expired" | "promoted";
export type CohortStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

// --- Base ---

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

// --- User ---

export interface User extends Timestamps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastLoginAt?: string;
}

export interface UserCreatePayload {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role: UserRole;
}

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: UserRole;
  status?: UserStatus;
}

// --- Course ---

export interface CoursePricing {
  fee: number; // Standard fee in Naira
  cohortFee?: number; // Cohort class fee (min 3, max 5 students)
  specialFee?: number; // Special class package fee
}

export interface Course extends Timestamps {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string; // e.g. "3 months", "5 weeks"
  topics?: string[]; // Key topics covered
  pricing: CoursePricing;
  venue: {
    address: string;
    room: string;
  };
  capacity: number;
  waitlistCap: number;
  instructorIds: string[];
  status: CourseStatus;
  prerequisiteTestId?: string;
  postCourseTestId?: string; // End-of-course assessment (PRD §2.5)
  modules: CourseModule[];
  enrolledCount: number;
  waitlistCount: number;
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  testId?: string; // End-of-module test (PRD §2.2)
  contentItems: ContentItem[];
}

export interface ContentItem {
  id: string;
  type: "pdf" | "video" | "slides" | "text";
  title: string;
  url?: string;
  content?: string;
}

export interface CourseCreatePayload {
  title: string;
  description: string;
  category: string;
  duration: string;
  topics?: string[];
  pricing: CoursePricing;
  venue: {
    address: string;
    room: string;
  };
  capacity: number;
  waitlistCap: number;
  instructorIds: string[];
  prerequisiteTestId?: string;
  postCourseTestId?: string;
}

export interface CourseUpdatePayload extends Partial<CourseCreatePayload> {
  status?: CourseStatus;
}

// --- Cohort ---

export interface Cohort extends Timestamps {
  id: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  startDate: string;
  endDate: string;
  status: CohortStatus;
  enrolledCount: number;
  capacity: number;
}

// --- Enrollment ---

export interface Enrollment extends Timestamps {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  status: EnrollmentStatus;
  enrolledAt?: string;
  completedAt?: string;
  qrCode?: string; // Entry pass QR payload
}

// --- Waitlist ---

export interface WaitlistEntry extends Timestamps {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  position: number;
  status: WaitlistStatus;
  offeredAt?: string;
  expiresAt?: string;
}

// --- Attendance ---

export interface AttendanceRecord extends Timestamps {
  id: string;
  enrollmentId: string;
  userId: string;
  userName: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
  scannedBy?: string;
  method: "qr" | "manual";
}

// --- Certificate ---

export interface Certificate extends Timestamps {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  instructorId?: string; // PRD §2.6 - instructor on certificate
  instructorName?: string; // PRD §2.6 - instructor on certificate
  certificateNumber: string;
  status: CertificateStatus;
  issuedAt?: string;
  revokedAt?: string;
  verificationUrl: string;
}

// --- Assessment ---

export interface Question {
  id: string;
  courseId: string; // Questions belong to a course
  text: string;
  type: "mcq";
  options: { id: string; text: string }[];
  correctOptionId: string;
  tags: string[]; // Topics within the course
  difficulty?: "easy" | "medium" | "hard";
}

export interface Test {
  id: string;
  title: string;
  courseId: string;
  category: TestCategory; // prerequisite, post-course, or module
  questions: Question[];
  passingScore: number; // percentage
  maxAttempts: number;
  timeLimitMinutes?: number;
}

export type TestCategory = "prerequisite" | "post-course" | "module";

export interface TestAttempt extends Timestamps {
  id: string;
  testId: string;
  userId: string;
  userName: string; // denormalized for display
  userEmail: string; // denormalized for display
  score: number;
  passed: boolean;
  attemptNumber: number;
  answers: { questionId: string; selectedOptionId: string }[];
  isOverridden?: boolean; // PRD §2.5 - admin manual override
  overriddenBy?: string; // admin userId who overrode
  overriddenAt?: string;
}

// --- API ---

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// --- Platform Constants ---

export const APPLICATION_FORM_FEE = 2000; // ₦2,000
export const SPECIAL_CLASS_MIN_STUDENTS = 3;
export const SPECIAL_CLASS_MAX_STUDENTS = 5;
export const ENROLLMENT_POLICY =
  "Enrollment of students is monthly — Class begins at the beginning of a new month.";
export const CONTACT_PHONES = ["0803-302-7479", "0802-924-8172", "0806-273-3470"];
export const AVAILABLE_FACILITIES = [
  "State-of-the-art computers",
  "Conducive environment",
  "Seasoned instructors",
];

// --- Table/Filtering ---

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  search?: string;
  role?: UserRole;
  status?: string;
  category?: string;
  page: number;
  pageSize: number;
  sort?: SortConfig;
}
