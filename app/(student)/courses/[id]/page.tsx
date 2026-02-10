"use client";

import { useEffect, useState, use, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Video,
  FileSpreadsheet,
  Type,
  QrCode,
  ChevronDown,
  ChevronRight,
  Play,
  Download,
  Eye,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  fetchCourse,
  fetchStudentEnrollments,
  fetchTestAttempts,
  enrollInCourse,
} from "@/lib/mock-data";
import type { Course, Enrollment, TestAttempt, ContentItem } from "@/lib/types";
import {
  APPLICATION_FORM_FEE,
  ENROLLMENT_POLICY,
  CONTACT_PHONES,
  AVAILABLE_FACILITIES,
  SPECIAL_CLASS_MIN_STUDENTS,
  SPECIAL_CLASS_MAX_STUDENTS,
} from "@/lib/types";

/** Format Naira */
function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
}

const CONTENT_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  video: Video,
  slides: FileSpreadsheet,
  text: Type,
};

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [postAttempts, setPostAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [viewingContent, setViewingContent] = useState<ContentItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key handler & focus trap for content viewer modal
  useEffect(() => {
    if (!viewingContent) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setViewingContent(null);
        return;
      }
      // Focus trap inside modal
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    // Focus the close button when modal opens
    const timer = setTimeout(() => {
      const closeBtn = modalRef.current?.querySelector<HTMLElement>(
        '[aria-label="Close content viewer"]'
      );
      closeBtn?.focus();
    }, 50);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [viewingContent]);

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }

  useEffect(() => {
    async function load() {
      try {
        const [crs, enrollments] = await Promise.all([fetchCourse(id), fetchStudentEnrollments()]);
        setCourse(crs);
        const myEnrollment = enrollments.find((e) => e.courseId === id);
        setEnrollment(myEnrollment ?? null);

        if (crs.prerequisiteTestId) {
          const att = await fetchTestAttempts(crs.prerequisiteTestId);
          setAttempts(att);
        }

        if (crs.postCourseTestId) {
          const postAtt = await fetchTestAttempts(crs.postCourseTestId);
          setPostAttempts(postAtt);
        }
      } catch {
        // Course not found
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  const prereqPassed = attempts.some((a) => a.passed);
  const postTestPassed = postAttempts.some((a) => a.passed);
  const seatsLeft = course ? Math.max(0, course.capacity - course.enrolledCount) : 0;
  const isFull = seatsLeft === 0;
  const canEnroll = !enrollment && prereqPassed && !isFull;
  const canWaitlist =
    !enrollment && prereqPassed && isFull && course && course.waitlistCount < course.waitlistCap;

  async function handleEnroll() {
    if (!course) return;
    setEnrolling(true);
    try {
      const enr = await enrollInCourse(course.id);
      setEnrollment(enr);
      toast.success(isFull ? "Added to waitlist" : "Enrolled successfully!");
    } catch {
      toast.error("Enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading course details">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading course details…</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-secondary">Course not found.</p>
        <Link
          href="/courses"
          className="text-text-secondary hover:text-text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/courses"
        className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Catalog
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{course.category}</Badge>
            {enrollment && (
              <Badge
                variant="outline"
                className={
                  enrollment.status === "enrolled"
                    ? "border-accent-green text-accent-green"
                    : enrollment.status === "waitlisted"
                      ? "border-accent-amber text-accent-amber"
                      : "border-accent-blue text-accent-blue"
                }
              >
                {enrollment.status === "enrolled"
                  ? "Enrolled"
                  : enrollment.status === "waitlisted"
                    ? "Waitlisted"
                    : enrollment.status}
              </Badge>
            )}
          </div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            {course.title}
          </h1>
          <p className="text-text-secondary max-w-2xl">{course.description}</p>
        </div>

        {/* Action */}
        <div className="shrink-0">
          {enrollment?.status === "enrolled" && enrollment.qrCode ? (
            <Card className="p-4 text-center">
              <QrCode size={48} className="text-accent-blue mx-auto mb-2" />
              <p className="text-text-primary text-xs font-semibold">Entry QR Code</p>
              <p className="text-text-tertiary text-[10px]">{enrollment.qrCode}</p>
            </Card>
          ) : canEnroll ? (
            <Button onClick={handleEnroll} disabled={enrolling} size="lg">
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </Button>
          ) : canWaitlist ? (
            <Button onClick={handleEnroll} disabled={enrolling} variant="secondary" size="lg">
              {enrolling ? "Joining..." : "Join Waitlist"}
            </Button>
          ) : !enrollment && !prereqPassed && course.prerequisiteTestId ? (
            <Link href={`/courses/${course.id}/test`}>
              <Button size="lg">Take Prerequisite Test</Button>
            </Link>
          ) : null}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-accent-blue" aria-hidden="true" />
            <div>
              <p className="text-text-primary text-sm font-semibold">{course.duration}</p>
              <p className="text-text-tertiary text-xs">Duration</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-accent-green" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-text-primary max-w-[200px] truncate text-sm font-semibold">
                {course.venue.room}
              </p>
              <p className="text-text-tertiary truncate text-xs">{course.venue.address}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-accent-amber" aria-hidden="true" />
            <div>
              <p className="text-text-primary text-sm font-semibold">
                {course.enrolledCount}/{course.capacity}
              </p>
              <p className="text-text-tertiary text-xs">Seats Filled</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            {prereqPassed ? (
              <CheckCircle2 size={20} className="text-accent-green" />
            ) : course.prerequisiteTestId ? (
              <XCircle size={20} className="text-accent-red" />
            ) : (
              <CheckCircle2 size={20} className="text-text-tertiary" />
            )}
            <div>
              <p className="text-text-primary text-sm font-semibold">
                {prereqPassed
                  ? "Passed"
                  : course.prerequisiteTestId
                    ? "Not Passed"
                    : "None Required"}
              </p>
              <p className="text-text-tertiary text-xs">Prerequisite</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pricing */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-text-tertiary text-xs">Course Fee</p>
            <p className="text-accent-blue text-2xl font-bold">{formatNaira(course.pricing.fee)}</p>
          </div>
          {course.pricing.specialFee && (
            <div>
              <p className="text-text-tertiary text-xs">Special Class (3–5 students)</p>
              <p className="text-accent-purple text-lg font-bold">
                {formatNaira(course.pricing.specialFee)}
              </p>
            </div>
          )}
          {course.pricing.cohortFee && (
            <div>
              <p className="text-text-tertiary text-xs">Cohort Fee</p>
              <p className="text-accent-green text-lg font-bold">
                {formatNaira(course.pricing.cohortFee)}
              </p>
            </div>
          )}
          <div>
            <p className="text-text-tertiary text-xs">Application Form</p>
            <p className="text-text-primary text-sm font-semibold">
              {formatNaira(APPLICATION_FORM_FEE)}
            </p>
          </div>
        </div>
        {course.topics && course.topics.length > 0 && (
          <div className="border-border-default mt-3 flex flex-wrap gap-1.5 border-t pt-3">
            <span className="text-text-tertiary text-xs">Topics:</span>
            {course.topics.map((topic) => (
              <Badge key={topic} variant="default" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Enrollment Information */}
      <Card className="p-4">
        <h3 className="text-text-primary mb-3 text-sm font-semibold">Enrollment Information</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border-border-default rounded-xl border-2 p-3">
            <p className="text-text-tertiary text-xs font-medium uppercase">Enrollment Policy</p>
            <p className="text-text-primary mt-1 text-sm">{ENROLLMENT_POLICY}</p>
          </div>
          <div className="border-border-default rounded-xl border-2 p-3">
            <p className="text-text-tertiary text-xs font-medium uppercase">Special Class</p>
            <p className="text-text-primary mt-1 text-sm">
              {SPECIAL_CLASS_MIN_STUDENTS}–{SPECIAL_CLASS_MAX_STUDENTS} students per group
            </p>
          </div>
          <div className="border-border-default rounded-xl border-2 p-3">
            <p className="text-text-tertiary text-xs font-medium uppercase">Contact</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {CONTACT_PHONES.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/-/g, "")}`}
                  className="text-accent-blue text-sm hover:underline"
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
          <div className="border-border-default rounded-xl border-2 p-3">
            <p className="text-text-tertiary text-xs font-medium uppercase">Facilities</p>
            <p className="text-text-primary mt-1 text-sm">
              {AVAILABLE_FACILITIES.slice(0, 3).join(", ")}
              {AVAILABLE_FACILITIES.length > 3 && ` +${AVAILABLE_FACILITIES.length - 3} more`}
            </p>
          </div>
        </div>
      </Card>

      {/* Capacity bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Seat Availability</span>
          <span className="text-text-primary font-semibold">
            {seatsLeft} of {course.capacity} remaining
          </span>
        </div>
        <Progress value={(course.enrolledCount / course.capacity) * 100} className="mt-2 h-3" />
        {isFull && (
          <p className="text-accent-amber mt-2 flex items-center gap-1 text-xs">
            <AlertTriangle size={14} /> Course is full. Waitlist: {course.waitlistCount}/
            {course.waitlistCap}
          </p>
        )}
      </Card>

      {/* Prerequisite Test Status */}
      {course.prerequisiteTestId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Prerequisite Test
            </CardTitle>
            <CardDescription>
              You must pass this test before enrolling in the course.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attempts.length === 0 ? (
              <div className="border-border-default bg-bg-tertiary rounded-xl border p-4 text-center">
                <p className="text-text-secondary text-sm">No attempts yet.</p>
                <Link href={`/courses/${course.id}/test`}>
                  <Button size="sm" className="mt-3">
                    Start Test
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-xl border p-3"
                    >
                      <div>
                        <p className="text-text-primary text-sm font-medium">
                          Attempt #{attempt.attemptNumber}
                        </p>
                        <p className="text-text-tertiary text-xs">
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            attempt.passed ? "text-accent-green" : "text-accent-red"
                          }`}
                        >
                          {attempt.score}%
                        </span>
                        {attempt.passed ? (
                          <CheckCircle2 size={18} className="text-accent-green" />
                        ) : (
                          <XCircle size={18} className="text-accent-red" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {!prereqPassed && (
                  <Link href={`/courses/${course.id}/test`}>
                    <Button size="sm" className="mt-2">
                      Retry Test
                    </Button>
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* End-of-Course / Final Assessment (PRD §2.5) */}
      {course.postCourseTestId && enrollment?.status === "enrolled" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Final Assessment
            </CardTitle>
            <CardDescription>
              Complete this assessment after your physical training to qualify for certification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {postTestPassed ? (
              <div className="border-accent-green bg-accent-green/5 flex items-center gap-3 rounded-xl border p-4">
                <CheckCircle2 size={24} className="text-accent-green" />
                <div>
                  <p className="text-text-primary font-medium">Assessment Passed!</p>
                  <p className="text-text-secondary text-sm">You are eligible for certification.</p>
                </div>
              </div>
            ) : (
              <>
                {postAttempts.length > 0 && (
                  <div className="space-y-2">
                    {postAttempts.map((attempt) => (
                      <div
                        key={attempt.id}
                        className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-xl border p-3"
                      >
                        <div>
                          <p className="text-text-primary text-sm font-medium">
                            Attempt #{attempt.attemptNumber}
                          </p>
                          <p className="text-text-tertiary text-xs">
                            {new Date(attempt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              attempt.passed ? "text-accent-green" : "text-accent-red"
                            }`}
                          >
                            {attempt.score}%
                          </span>
                          {attempt.passed ? (
                            <CheckCircle2 size={18} className="text-accent-green" />
                          ) : (
                            <XCircle size={18} className="text-accent-red" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link href={`/courses/${course.id}/final-test`}>
                  <Button size="sm" className="mt-2">
                    {postAttempts.length > 0 ? "Retry Assessment" : "Start Final Assessment"}
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Course Modules — Expandable Accordion */}
      {course.modules.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Course Modules</CardTitle>
                <CardDescription>
                  {course.modules.length} module
                  {course.modules.length !== 1 ? "s" : ""} &middot;{" "}
                  {course.modules.reduce((sum, m) => sum + m.contentItems.length, 0)} content items
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() => {
                  const allIds = course.modules.map((m) => m.id);
                  const allExpanded = allIds.every((id) => expandedModules.has(id));
                  setExpandedModules(allExpanded ? new Set() : new Set(allIds));
                }}
                className="text-accent-blue text-xs font-medium hover:underline"
                aria-label={
                  course.modules.every((m) => expandedModules.has(m.id))
                    ? "Collapse all modules"
                    : "Expand all modules"
                }
              >
                {course.modules.every((m) => expandedModules.has(m.id))
                  ? "Collapse All"
                  : "Expand All"}
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {course.modules
                .sort((a, b) => a.order - b.order)
                .map((module, idx) => {
                  const isExpanded = expandedModules.has(module.id);
                  return (
                    <div key={module.id} className="border-border-default rounded-xl border">
                      {/* Module Header — clickable */}
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className="hover:bg-bg-tertiary flex w-full items-center gap-3 p-4 text-left transition-colors"
                        aria-expanded={isExpanded}
                        aria-controls={`module-content-${module.id}`}
                      >
                        <span className="bg-accent-blue/10 text-accent-blue flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-text-primary truncate font-medium">{module.title}</p>
                          <p className="text-text-tertiary text-xs">
                            {module.contentItems.length} item
                            {module.contentItems.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown size={18} className="text-text-tertiary shrink-0" />
                        ) : (
                          <ChevronRight size={18} className="text-text-tertiary shrink-0" />
                        )}
                      </button>

                      {/* Module Content Items */}
                      {isExpanded && (
                        <div
                          id={`module-content-${module.id}`}
                          className="border-border-default border-t px-4 pt-3 pb-4"
                        >
                          {module.contentItems.length === 0 ? (
                            <p className="text-text-tertiary text-sm">No content items yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {module.contentItems.map((item) => {
                                const Icon = CONTENT_ICONS[item.type] ?? FileText;
                                const typeLabel =
                                  item.type === "pdf"
                                    ? "PDF Document"
                                    : item.type === "video"
                                      ? "Video"
                                      : item.type === "slides"
                                        ? "Presentation"
                                        : "Text Content";
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setViewingContent(item)}
                                    className="hover:border-border-default hover:bg-bg-tertiary flex w-full items-center gap-3 rounded-lg border border-transparent p-3 text-left transition-colors"
                                  >
                                    <span
                                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                        item.type === "video"
                                          ? "bg-accent-red/10 text-accent-red"
                                          : item.type === "pdf"
                                            ? "bg-accent-blue/10 text-accent-blue"
                                            : item.type === "slides"
                                              ? "bg-accent-amber/10 text-accent-amber"
                                              : "bg-accent-green/10 text-accent-green"
                                      }`}
                                    >
                                      <Icon size={18} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-text-primary truncate text-sm font-medium">
                                        {item.title}
                                      </p>
                                      <p className="text-text-tertiary text-xs">{typeLabel}</p>
                                    </div>
                                    <span className="text-text-tertiary shrink-0">
                                      {item.type === "video" ? (
                                        <Play size={16} />
                                      ) : item.type === "text" ? (
                                        <Eye size={16} />
                                      ) : (
                                        <Download size={16} />
                                      )}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Viewer Modal */}
      {viewingContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={viewingContent.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingContent(null);
          }}
        >
          <div
            ref={modalRef}
            className="bg-bg-primary relative w-full max-w-3xl rounded-2xl shadow-lg"
          >
            {/* Modal Header */}
            <div className="border-border-default flex items-center justify-between border-b p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    viewingContent.type === "video"
                      ? "bg-accent-red/10 text-accent-red"
                      : viewingContent.type === "pdf"
                        ? "bg-accent-blue/10 text-accent-blue"
                        : viewingContent.type === "slides"
                          ? "bg-accent-amber/10 text-accent-amber"
                          : "bg-accent-green/10 text-accent-green"
                  }`}
                >
                  {(() => {
                    const Icon = CONTENT_ICONS[viewingContent.type] ?? FileText;
                    return <Icon size={20} />;
                  })()}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-text-primary truncate text-lg font-bold">
                    {viewingContent.title}
                  </h3>
                  <p className="text-text-tertiary text-xs capitalize">
                    {viewingContent.type === "pdf"
                      ? "PDF Document"
                      : viewingContent.type === "video"
                        ? "Video Content"
                        : viewingContent.type === "slides"
                          ? "Presentation Slides"
                          : "Text Content"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingContent(null)}
                className="text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                aria-label="Close content viewer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5">
              {viewingContent.type === "video" && (
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-white">
                    <Play size={48} className="opacity-60" />
                    <p className="text-sm opacity-80">Video Player — {viewingContent.title}</p>
                    <p className="text-xs opacity-50">{viewingContent.url}</p>
                  </div>
                </div>
              )}

              {viewingContent.type === "pdf" && (
                <div className="border-border-default bg-bg-tertiary flex flex-col items-center gap-4 rounded-xl border p-8">
                  <FileText size={48} className="text-accent-blue opacity-60" />
                  <div className="text-center">
                    <p className="text-text-primary font-medium">{viewingContent.title}</p>
                    <p className="text-text-tertiary mt-1 text-sm">
                      PDF will open in browser viewer when connected to backend.
                    </p>
                    <p className="text-text-tertiary mt-1 text-xs">{viewingContent.url}</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    <Download size={16} className="mr-1.5" />
                    Download PDF
                  </Button>
                </div>
              )}

              {viewingContent.type === "slides" && (
                <div className="border-border-default bg-bg-tertiary flex flex-col items-center gap-4 rounded-xl border p-8">
                  <FileSpreadsheet size={48} className="text-accent-amber opacity-60" />
                  <div className="text-center">
                    <p className="text-text-primary font-medium">{viewingContent.title}</p>
                    <p className="text-text-tertiary mt-1 text-sm">
                      Presentation slides will render inline when connected to backend.
                    </p>
                    <p className="text-text-tertiary mt-1 text-xs">{viewingContent.url}</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    <Download size={16} className="mr-1.5" />
                    Download Slides
                  </Button>
                </div>
              )}

              {viewingContent.type === "text" && (
                <div className="border-border-default bg-bg-tertiary rounded-xl border p-6">
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                    {viewingContent.content ?? "No content available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
