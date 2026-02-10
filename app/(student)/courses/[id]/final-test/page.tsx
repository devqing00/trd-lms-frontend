"use client";

/**
 * End-of-Course Final Assessment Page
 *
 * Reuses the same test engine pattern as the prerequisite test but
 * loads the course's postCourseTestId instead. PRD §2.5 requires
 * students to pass a final assessment after physical training to
 * qualify for certification.
 *
 * This file mirrors /courses/[id]/test/page.tsx with minimal changes
 * (loads postCourseTestId, different result messaging). A shared
 * TestEngine component is a candidate for a future refactor.
 */

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  Send,
  Eye,
  Award,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTimer } from "@/lib/hooks/use-timer";
import { fetchTest, fetchTestAttempts, submitTestAttempt, fetchCourse } from "@/lib/mock-data";
import type { Test, TestAttempt, Question } from "@/lib/types";

type AnswerMap = Record<string, string>;

function TabWarningOverlay({ count, onDismiss }: { count: number; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="mx-4 max-w-md text-center">
        <CardContent className="space-y-4 pt-6">
          <AlertTriangle size={48} className="text-accent-amber mx-auto" />
          <h2 className="font-display text-text-primary text-xl font-bold">Tab Switch Detected</h2>
          <p className="text-text-secondary text-sm">
            You navigated away from the test. This action has been logged.
          </p>
          <p className="text-accent-red text-xs font-semibold">
            Warning {count} of 3. Three warnings will auto-submit your test.
          </p>
          <Button onClick={onDismiss} className="w-full">
            Return to Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function FinalTestResults({
  attempt,
  test,
  courseId,
}: {
  attempt: TestAttempt;
  test: Test;
  courseId: string;
}) {
  const incorrectQuestions = test.questions.filter((q) => {
    const ans = attempt.answers.find((a) => a.questionId === q.id);
    return ans?.selectedOptionId !== q.correctOptionId;
  });

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardContent className="space-y-4 pt-6">
          {attempt.passed ? (
            <>
              <Award size={64} className="text-accent-green mx-auto" />
              <h2 className="font-display text-text-primary text-2xl font-bold">
                Congratulations! You Passed!
              </h2>
              <p className="text-text-secondary">
                You scored <strong>{attempt.score}%</strong> (passing: {test.passingScore}%). You
                are now eligible for certification.
              </p>
            </>
          ) : (
            <>
              <XCircle size={64} className="text-accent-red mx-auto" />
              <h2 className="font-display text-text-primary text-2xl font-bold">Not Yet Passed</h2>
              <p className="text-text-secondary">
                You scored <strong>{attempt.score}%</strong> (need {test.passingScore}% to pass).
                Review the areas below and try again.
              </p>
            </>
          )}
          <Progress value={attempt.score} className="h-3" />
        </CardContent>
        <CardFooter className="justify-center gap-3">
          <Link
            href={`/courses/${courseId}`}
            className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Course
          </Link>
          {attempt.passed && (
            <Link href="/certificates">
              <Button>
                <Award size={16} /> View Certificates
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>

      {/* Answer Review */}
      {!attempt.passed && incorrectQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye size={20} /> Areas to Review
            </CardTitle>
            <CardDescription>
              Focus on these {incorrectQuestions.length} topic
              {incorrectQuestions.length !== 1 ? "s" : ""} before retrying.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {incorrectQuestions.map((q) => (
              <div key={q.id} className="border-border-default rounded-xl border p-3">
                <p className="text-text-primary text-sm">{q.text}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {q.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function FinalTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);
  const router = useRouter();

  const [test, setTest] = useState<Test | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<"start" | "testing" | "results">("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestAttempt | null>(null);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const timer = useTimer({
    totalSeconds: (test?.timeLimitMinutes ?? 0) * 60,
    onExpire: () => handleSubmit(),
  });

  // Load test data
  useEffect(() => {
    async function load() {
      try {
        const course = await fetchCourse(courseId);
        if (!course.postCourseTestId) {
          router.push(`/courses/${courseId}`);
          return;
        }
        const [t, att] = await Promise.all([
          fetchTest(course.postCourseTestId),
          fetchTestAttempts(course.postCourseTestId),
        ]);
        setTest(t);
        setAttempts(att);
      } catch {
        // Not found
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [courseId, router]);

  // Tab-switch detection
  useEffect(() => {
    if (phase !== "testing") return;
    function handleVisibility() {
      if (document.hidden) {
        setTabWarnings((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            void handleSubmit();
          } else {
            setShowWarning(true);
          }
          return next;
        });
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Copy-paste prevention
  useEffect(() => {
    if (phase !== "testing") return;
    function prevent(e: Event) {
      e.preventDefault();
    }
    document.addEventListener("copy", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("cut", prevent);
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("cut", prevent);
    };
  }, [phase]);

  const handleSubmit = useCallback(async () => {
    if (!test || submitting) return;
    setSubmitting(true);
    try {
      const ansArray = Object.entries(answers).map(([qId, optId]) => ({
        questionId: qId,
        selectedOptionId: optId,
      }));
      const attempt = await submitTestAttempt(test.id, ansArray);
      setResult(attempt);
      setPhase("results");
      timer.reset();
    } catch {
      // Error
    } finally {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, answers, submitting]);

  function startTest() {
    setPhase("testing");
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
    setTabWarnings(0);
    if (test?.timeLimitMinutes) timer.start();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading assessment">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading assessment…</span>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-secondary">Final assessment not available for this course.</p>
        <Link
          href={`/courses/${courseId}`}
          className="text-text-secondary hover:text-text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Course
        </Link>
      </div>
    );
  }

  // --- Results Phase ---
  if (phase === "results" && result) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href={`/courses/${courseId}`}
          className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Course
        </Link>
        <FinalTestResults attempt={result} test={test} courseId={courseId} />
      </div>
    );
  }

  const question: Question | undefined = test.questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  // --- Start Phase ---
  if (phase === "start") {
    const alreadyPassed = attempts.some((a) => a.passed);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          href={`/courses/${courseId}`}
          className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Course
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award size={24} className="text-accent-blue" />
              {test.title}
            </CardTitle>
            <CardDescription>
              End-of-course final assessment for certification eligibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">{test.questions.length}</p>
                <p className="text-text-tertiary text-xs">Questions</p>
              </div>
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">{test.passingScore}%</p>
                <p className="text-text-tertiary text-xs">Pass Score</p>
              </div>
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">
                  {test.timeLimitMinutes ?? "∞"}
                </p>
                <p className="text-text-tertiary text-xs">Minutes</p>
              </div>
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">
                  {attempts.length}/{test.maxAttempts}
                </p>
                <p className="text-text-tertiary text-xs">Attempts</p>
              </div>
            </div>

            {alreadyPassed && (
              <div className="border-accent-green bg-accent-green/5 flex items-center gap-2 rounded-xl border p-3">
                <CheckCircle2 size={18} className="text-accent-green" />
                <p className="text-accent-green text-sm">
                  You have already passed this assessment.
                </p>
              </div>
            )}

            {attempts.length >= test.maxAttempts && !alreadyPassed && (
              <div className="border-accent-red bg-accent-red/5 flex items-center gap-2 rounded-xl border p-3">
                <XCircle size={18} className="text-accent-red" />
                <p className="text-accent-red text-sm">
                  Maximum attempts reached. Contact your instructor for assistance.
                </p>
              </div>
            )}

            {attempts.length > 0 && (
              <div className="space-y-2">
                <p className="text-text-secondary text-sm font-medium">Previous Attempts</p>
                {attempts.map((a) => (
                  <div
                    key={a.id}
                    className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-xl border p-3"
                  >
                    <span className="text-text-primary text-sm">Attempt #{a.attemptNumber}</span>
                    <span
                      className={`text-sm font-bold ${
                        a.passed ? "text-accent-green" : "text-accent-red"
                      }`}
                    >
                      {a.score}%{" "}
                      {a.passed ? (
                        <CheckCircle2 size={14} className="inline" />
                      ) : (
                        <XCircle size={14} className="inline" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={startTest}
              disabled={attempts.length >= test.maxAttempts && !alreadyPassed}
              className="w-full"
              size="lg"
            >
              {attempts.length > 0 ? "Retry Assessment" : "Start Assessment"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- Testing Phase ---
  if (!question) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {showWarning && (
        <TabWarningOverlay count={tabWarnings} onDismiss={() => setShowWarning(false)} />
      )}

      {/* Timer Bar */}
      <div className="border-border-default bg-bg-secondary flex flex-wrap items-center gap-2 rounded-2xl border p-3 sm:justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            Final Assessment
          </Badge>
          <span className="text-text-secondary text-sm">
            Q{currentQ + 1}/{test.questions.length}
          </span>
        </div>
        {test.timeLimitMinutes && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-accent-amber" />
            <span
              className={`font-mono text-sm font-bold ${
                timer.progress > 80 ? "text-accent-red" : "text-text-primary"
              }`}
            >
              {timer.formatted}
            </span>
          </div>
        )}
        <span className="text-text-secondary text-sm">
          {answeredCount}/{test.questions.length} answered
        </span>
      </div>

      <Progress value={((currentQ + 1) / test.questions.length) * 100} className="h-2" />

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Question */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge>Question {currentQ + 1}</Badge>
                {question.difficulty && (
                  <Badge
                    variant="outline"
                    className={
                      question.difficulty === "hard"
                        ? "border-accent-red text-accent-red"
                        : question.difficulty === "medium"
                          ? "border-accent-amber text-accent-amber"
                          : "border-accent-green text-accent-green"
                    }
                  >
                    {question.difficulty}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: opt.id,
                    }))
                  }
                  className={`w-full rounded-2xl border-2 p-4 text-left text-sm transition-all ${
                    answers[question.id] === opt.id
                      ? "border-accent-blue bg-accent-blue/5 text-text-primary"
                      : "border-border-default bg-bg-primary text-text-secondary hover:border-accent-blue/50"
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentQ === 0}
                onClick={() => setCurrentQ((p) => p - 1)}
              >
                <ArrowLeft size={16} /> Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFlagged((prev) => {
                    const next = new Set(prev);
                    if (next.has(question.id)) next.delete(question.id);
                    else next.add(question.id);
                    return next;
                  });
                }}
                className={flagged.has(question.id) ? "text-accent-amber" : ""}
              >
                <Flag size={16} /> {flagged.has(question.id) ? "Unflag" : "Flag"}
              </Button>
              {currentQ < test.questions.length - 1 ? (
                <Button size="sm" onClick={() => setCurrentQ((p) => p + 1)}>
                  Next <ArrowRight size={16} />
                </Button>
              ) : (
                <Button size="sm" onClick={() => void handleSubmit()} disabled={submitting}>
                  <Send size={16} /> {submitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Question Nav */}
        <Card className="self-start p-4">
          <p className="text-text-secondary mb-3 text-xs font-semibold">QUESTIONS</p>
          <div className="grid grid-cols-5 gap-1.5 lg:grid-cols-3">
            {test.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQ(i)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  i === currentQ
                    ? "bg-accent-blue shadow-hard-sm text-white"
                    : answers[q.id]
                      ? "bg-accent-green/15 text-accent-green"
                      : "bg-bg-tertiary text-text-tertiary"
                } ${flagged.has(q.id) ? "ring-accent-amber ring-2" : ""}`}
                aria-label={`Go to question ${i + 1}${answers[q.id] ? " (answered)" : ""}${flagged.has(q.id) ? " (flagged)" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="text-text-tertiary mt-4 space-y-1 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="bg-accent-green/15 h-3 w-3 rounded" /> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-bg-tertiary h-3 w-3 rounded" /> Unanswered
            </div>
            <div className="flex items-center gap-2">
              <span className="ring-accent-amber h-3 w-3 rounded ring-2" /> Flagged
            </div>
          </div>
          {answeredCount === test.questions.length && (
            <Button
              size="sm"
              className="mt-4 w-full"
              onClick={() => void handleSubmit()}
              disabled={submitting}
            >
              <Send size={14} /> Submit All
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
