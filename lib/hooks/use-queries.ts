// ============================================
// TanStack Query Hooks for LMS Data
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FilterConfig,
  User,
  Course,
  Question,
  Test,
  Cohort,
  AttendanceRecord,
} from "@/lib/types";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchCourses,
  fetchCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchEnrollments,
  updateEnrollmentStatus,
  fetchWaitlist,
  promoteWaitlistEntry,
  removeWaitlistEntry,
  fetchDashboardStats,
  fetchAttendance,
  markAttendance,
  fetchCohorts,
  createCohort,
  updateCohort,
  deleteCohort,
  fetchCertificates,
  generateCertificate,
  revokeCertificate,
  fetchQuestionBank,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchAllTests,
  createTest,
  updateTest,
  deleteTest,
  overrideTestAttempt,
  fetchAllTestAttempts,
  fetchAnalyticsData,
  fetchInstructorCourses,
  fetchInstructorEnrollments,
  fetchInstructorCohorts,
  fetchInstructorDashboardStats,
} from "@/lib/mock-data";

// --- Query Keys ---

export const queryKeys = {
  users: (filters: FilterConfig) => ["users", filters] as const,
  courses: (filters: FilterConfig) => ["courses", filters] as const,
  course: (id: string) => ["course", id] as const,
  enrollments: (filters: FilterConfig & { courseId?: string }) => ["enrollments", filters] as const,
  waitlist: (filters: FilterConfig & { courseId?: string }) => ["waitlist", filters] as const,
  dashboardStats: ["dashboard-stats"] as const,
  attendance: (filters: FilterConfig & { courseId?: string; date?: string }) =>
    ["attendance", filters] as const,
  cohorts: (filters: FilterConfig & { courseId?: string }) => ["cohorts", filters] as const,
  certificates: (filters: FilterConfig & { courseId?: string }) =>
    ["certificates", filters] as const,
  questionBank: (filters?: { search?: string; difficulty?: string; tag?: string }) =>
    ["question-bank", filters] as const,
  tests: ["tests"] as const,
  testAttempts: (filters?: FilterConfig & { testId?: string }) =>
    ["test-attempts", filters] as const,
  analytics: ["analytics"] as const,
};

// --- Users ---

export function useUsers(filters: FilterConfig) {
  return useQuery({
    queryKey: queryKeys.users(filters),
    queryFn: () => fetchUsers(filters),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<User, "id" | "createdAt" | "updatedAt" | "lastLoginAt">) =>
      createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<User> & { id: string }) => updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// --- Courses ---

export function useCourses(filters: FilterConfig) {
  return useQuery({
    queryKey: queryKeys.courses(filters),
    queryFn: () => fetchCourses(filters),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => fetchCourse(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Omit<
        Course,
        "id" | "createdAt" | "updatedAt" | "enrolledCount" | "waitlistCount" | "modules"
      >
    ) => createCourse(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Course> & { id: string }) => updateCourse(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// --- Enrollments ---

export function useEnrollments(filters: FilterConfig & { courseId?: string }) {
  return useQuery({
    queryKey: queryKeys.enrollments(filters),
    queryFn: () => fetchEnrollments(filters),
  });
}

export function useUpdateEnrollmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      enrollmentId: string;
      status: "enrolled" | "completed" | "cancelled";
    }) => updateEnrollmentStatus(params.enrollmentId, params.status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// --- Waitlist ---

export function useWaitlist(filters: FilterConfig & { courseId?: string }) {
  return useQuery({
    queryKey: queryKeys.waitlist(filters),
    queryFn: () => fetchWaitlist(filters),
  });
}

export function usePromoteWaitlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => promoteWaitlistEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["waitlist"] });
      qc.invalidateQueries({ queryKey: ["enrollments"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useRemoveWaitlistEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeWaitlistEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["waitlist"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// --- Dashboard Stats ---

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: fetchDashboardStats,
  });
}

// --- Attendance ---

export function useAttendance(filters: FilterConfig & { courseId?: string; date?: string }) {
  return useQuery({
    queryKey: queryKeys.attendance(filters),
    queryFn: () => fetchAttendance(filters),
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      enrollmentId: string;
      userId: string;
      courseId: string;
      date: string;
      status: AttendanceRecord["status"];
      method: AttendanceRecord["method"];
    }) =>
      markAttendance(
        params.enrollmentId,
        params.userId,
        params.courseId,
        params.date,
        params.status,
        params.method
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

// --- Cohorts ---

export function useCohorts(filters: FilterConfig & { courseId?: string }) {
  return useQuery({
    queryKey: queryKeys.cohorts(filters),
    queryFn: () => fetchCohorts(filters),
  });
}

export function useCreateCohort() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Cohort, "id" | "createdAt" | "updatedAt" | "enrolledCount">) =>
      createCohort(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cohorts"] });
    },
  });
}

export function useUpdateCohort() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Cohort> & { id: string }) => updateCohort(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cohorts"] });
    },
  });
}

export function useDeleteCohort() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCohort(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cohorts"] });
    },
  });
}

// --- Certificates (Admin) ---

export function useCertificatesAdmin(filters: FilterConfig & { courseId?: string }) {
  return useQuery({
    queryKey: queryKeys.certificates(filters),
    queryFn: () => fetchCertificates(filters),
  });
}

export function useGenerateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { userId: string; courseId: string }) =>
      generateCertificate(params.userId, params.courseId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["certificates"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useRevokeCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeCertificate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
}

// --- Question Bank ---

export function useQuestionBank(filters?: {
  search?: string;
  difficulty?: string;
  tag?: string;
  courseId?: string;
}) {
  return useQuery({
    queryKey: queryKeys.questionBank(filters),
    queryFn: () => fetchQuestionBank(filters),
  });
}

export function useCreateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Question, "id">) => createQuestion(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-bank"] });
    },
  });
}

export function useUpdateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Question> & { id: string }) =>
      updateQuestion(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-bank"] });
    },
  });
}

export function useDeleteQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["question-bank"] });
    },
  });
}

// --- Tests ---

export function useTests() {
  return useQuery({
    queryKey: queryKeys.tests,
    queryFn: fetchAllTests,
  });
}

export function useCreateTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Test, "id" | "questions"> & { questionIds: string[] }) =>
      createTest(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}

export function useUpdateTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Test> & { id: string }) => updateTest(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}

export function useDeleteTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}

// --- Test Attempt Override ---

export function useOverrideTestAttempt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { attemptId: string; passed: boolean; adminId: string }) =>
      overrideTestAttempt(params.attemptId, params.passed, params.adminId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["test-attempts"] });
    },
  });
}

export function useTestAttempts(filters?: FilterConfig & { testId?: string }) {
  return useQuery({
    queryKey: queryKeys.testAttempts(filters),
    queryFn: () => fetchAllTestAttempts(filters),
    enabled: !!filters,
  });
}

// --- Analytics ---

export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: fetchAnalyticsData,
  });
}

// --- Instructor Scoped ---

export function useInstructorCourses() {
  return useQuery({
    queryKey: ["instructor-courses"],
    queryFn: fetchInstructorCourses,
  });
}

export function useInstructorEnrollments(courseId?: string) {
  return useQuery({
    queryKey: ["instructor-enrollments", courseId],
    queryFn: () => fetchInstructorEnrollments(courseId),
  });
}

export function useInstructorCohorts() {
  return useQuery({
    queryKey: ["instructor-cohorts"],
    queryFn: fetchInstructorCohorts,
  });
}

export function useInstructorDashboard() {
  return useQuery({
    queryKey: ["instructor-dashboard"],
    queryFn: fetchInstructorDashboardStats,
  });
}
