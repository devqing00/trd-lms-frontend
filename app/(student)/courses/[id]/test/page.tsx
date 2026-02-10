"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  Send,
  BookOpen,
  RotateCcw,
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
import { fetchTest, fetchTestAttempts, submitTestAttempt, mockTests } from "@/lib/mock-data";
import type { Test, TestAttempt } from "@/lib/types";

type AnswerMap = Record<string, string>;

// Tab-switch warning overlay
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

// Test results view
function TestResults({
  attempt,
  test,
  courseId,
}: {
  attempt: TestAttempt;
  test: Test;
  courseId: string;
}) {
  const incorrectTags = new Set<string>();
  attempt.answers.forEach((ans) => {
    const question = test.questions.find((q) => q.id === ans.questionId);
    if (question && question.correctOptionId !== ans.selectedOptionId) {
      question.tags.forEach((tag) => incorrectTags.add(tag));
    }
  });

  return (
    <div className="space-y-6">
      <Link
        href={`/courses/${courseId}`}
        className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Course
      </Link>

      <Card className="text-center">
        <CardContent className="space-y-4 pt-6">
          {attempt.passed ? (
            <CheckCircle2 size={64} className="text-accent-green mx-auto" />
          ) : (
            <XCircle size={64} className="text-accent-red mx-auto" />
          )}
          <h1 className="font-display text-text-primary text-3xl font-bold">
            {attempt.passed ? "Congratulations!" : "Not Quite There"}
          </h1>
          <p className="text-text-secondary">
            {attempt.passed
              ? "You passed the prerequisite test!"
              : "You did not meet the passing score. Review the material and try again."}
          </p>

          <div className="my-6 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-text-primary text-4xl font-bold">{attempt.score}%</p>
              <p className="text-text-tertiary text-xs">Your Score</p>
            </div>
            <div className="bg-border-default h-12 w-px" />
            <div className="text-center">
              <p className="text-text-tertiary text-4xl font-bold">{test.passingScore}%</p>
              <p className="text-text-tertiary text-xs">Passing Score</p>
            </div>
          </div>

          {!attempt.passed && incorrectTags.size > 0 && (
            <Card className="border-accent-amber/30 bg-accent-amber/5 mx-auto max-w-sm text-left">
              <CardHeader>
                <CardTitle className="text-accent-amber flex items-center gap-2 text-sm">
                  <BookOpen size={16} />
                  Recommended Study Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-2 text-xs">
                  Focus on these topics in Module 0:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...incorrectTags].map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center gap-3 pt-4">
            <Link
              href={`/courses/${courseId}`}
              className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Course
            </Link>
            {!attempt.passed && (
              <Link href={`/courses/${courseId}/test`}>
                <Button>
                  <RotateCcw size={16} /> Retry Test
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = use(params);

  // Test state
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestAttempt | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState<TestAttempt[]>([]);

  // Tab switch detection
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);

  // Load test
  useEffect(() => {
    async function load() {
      // Find the test for this course
      const courseTest = mockTests.find((t) => t.courseId === courseId);
      if (courseTest) {
        const [t, attempts] = await Promise.all([
          fetchTest(courseTest.id),
          fetchTestAttempts(courseTest.id),
        ]);
        setTest(t);
        setPreviousAttempts(attempts);
      }
      setLoading(false);
    }
    void load();
  }, [courseId]);

  // Auto-submit callback
  const handleAutoSubmit = useCallback(async () => {
    if (!test || submitting || result) return;
    setSubmitting(true);
    const answerList = test.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id] ?? "",
    }));
    const attempt = await submitTestAttempt(test.id, answerList);
    setResult(attempt);
    setSubmitting(false);
  }, [test, answers, submitting, result]);

  // Timer
  const timer = useTimer({
    totalSeconds: (test?.timeLimitMinutes ?? 30) * 60,
    onExpire: handleAutoSubmit,
    autoStart: false,
  });

  // Tab switch detection
  useEffect(() => {
    if (!started || result) return;

    function handleVisibilityChange() {
      if (document.hidden) {
        setTabWarnings((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            void handleAutoSubmit();
          } else {
            setShowTabWarning(true);
          }
          return next;
        });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [started, result, handleAutoSubmit]);

  // Prevent copy/paste
  useEffect(() => {
    if (!started || result) return;

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
  }, [started, result]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading test">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading test…</span>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-secondary">No prerequisite test found for this course.</p>
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

  // Show results if submitted
  if (result) {
    return <TestResults attempt={result} test={test} courseId={courseId} />;
  }

  const questions = test.questions;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  // Start screen
  if (!started) {
    const attemptsUsed = previousAttempts.length;
    const attemptsLeft = test.maxAttempts - attemptsUsed;
    const alreadyPassed = previousAttempts.some((a) => a.passed);

    return (
      <div className="space-y-6">
        <Link
          href={`/courses/${courseId}`}
          className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Course
        </Link>

        <Card className="mx-auto max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{test.title}</CardTitle>
            <CardDescription>Complete this test to unlock course enrollment.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">{totalQuestions}</p>
                <p className="text-text-tertiary text-xs">Questions</p>
              </div>
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">{test.timeLimitMinutes} min</p>
                <p className="text-text-tertiary text-xs">Time Limit</p>
              </div>
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">{test.passingScore}%</p>
                <p className="text-text-tertiary text-xs">To Pass</p>
              </div>
              <div className="bg-bg-tertiary rounded-xl p-3 text-center">
                <p className="text-text-primary text-lg font-bold">{attemptsLeft}</p>
                <p className="text-text-tertiary text-xs">Attempts Left</p>
              </div>
            </div>

            <div className="border-accent-amber/30 bg-accent-amber/5 text-text-secondary rounded-xl border p-3 text-xs">
              <p className="text-accent-amber mb-1 font-semibold">Important:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>The timer will start as soon as you begin the test.</li>
                <li>Switching tabs will trigger a warning. 3 warnings auto-submit.</li>
                <li>Copy/paste is disabled during the test.</li>
                <li>Questions and answer options are randomized.</li>
              </ul>
            </div>

            {alreadyPassed && (
              <div className="border-accent-green/30 bg-accent-green/5 text-accent-green rounded-xl border p-3 text-center text-sm">
                <CheckCircle2 size={20} className="mx-auto mb-1" />
                You have already passed this test!
              </div>
            )}

            {previousAttempts.length > 0 && (
              <div className="space-y-2">
                <p className="text-text-tertiary text-xs font-semibold tracking-wider uppercase">
                  Previous Attempts
                </p>
                {previousAttempts.map((a) => (
                  <div
                    key={a.id}
                    className="border-border-default flex items-center justify-between rounded-lg border p-2 text-sm"
                  >
                    <span className="text-text-secondary">Attempt #{a.attemptNumber}</span>
                    <span
                      className={`font-bold ${a.passed ? "text-accent-green" : "text-accent-red"}`}
                    >
                      {a.score}% {a.passed ? "✓" : "✗"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2">
            {attemptsLeft > 0 && !alreadyPassed ? (
              <Button
                onClick={() => {
                  setStarted(true);
                  timer.start();
                }}
                className="w-full"
                size="lg"
              >
                Start Test
              </Button>
            ) : alreadyPassed ? (
              <Link
                href={`/courses/${courseId}`}
                className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Course
              </Link>
            ) : (
              <div className="text-accent-red text-center text-sm">
                No attempts remaining. Contact support if needed.
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Active test
  if (!currentQuestion) return null;

  function selectAnswer(optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion!.id]: optionId,
    }));
  }

  function toggleFlag() {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion!.id)) {
        next.delete(currentQuestion!.id);
      } else {
        next.add(currentQuestion!.id);
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (!test) return;
    setSubmitting(true);
    const answerList = test.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id] ?? "",
    }));
    const attempt = await submitTestAttempt(test.id, answerList);
    setResult(attempt);
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      {/* Tab warning overlay */}
      {showTabWarning && (
        <TabWarningOverlay count={tabWarnings} onDismiss={() => setShowTabWarning(false)} />
      )}

      {/* Timer bar */}
      <div className="border-border-default bg-bg-secondary sticky top-0 z-30 rounded-2xl border-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock
              size={18}
              className={
                timer.remaining < 60 ? "text-accent-red animate-pulse" : "text-accent-blue"
              }
            />
            <span
              className={`font-mono text-lg font-bold ${
                timer.remaining < 60 ? "text-accent-red" : "text-text-primary"
              }`}
            >
              {timer.formatted}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-text-tertiary text-sm">
              {answeredCount}/{totalQuestions} answered
            </span>
            {tabWarnings > 0 && (
              <Badge variant="outline" className="border-accent-amber text-accent-amber">
                ⚠ {tabWarnings}/3
              </Badge>
            )}
          </div>
        </div>
        <Progress value={timer.progress} className="mt-2 h-1.5" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        {/* Question area */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge>
                Question {currentIndex + 1} of {totalQuestions}
              </Badge>
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  flagged.has(currentQuestion.id)
                    ? "bg-accent-amber/10 text-accent-amber"
                    : "text-text-tertiary hover:text-text-primary"
                }`}
                aria-label={
                  flagged.has(currentQuestion.id)
                    ? "Unflag this question"
                    : "Flag this question for review"
                }
              >
                <Flag size={14} />
                {flagged.has(currentQuestion.id) ? "Flagged" : "Flag"}
              </button>
            </div>
            <CardTitle className="mt-3 text-lg leading-relaxed">{currentQuestion.text}</CardTitle>
            {currentQuestion.difficulty && (
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.difficulty}
                </Badge>
                {currentQuestion.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-3">
            {currentQuestion.options.map((option) => {
              const selected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => selectAnswer(option.id)}
                  className={`w-full rounded-2xl border-2 p-4 text-left text-sm transition-all duration-200 ${
                    selected
                      ? "border-accent-blue bg-accent-blue/10 shadow-hard-sm"
                      : "border-border-default bg-bg-tertiary hover:border-border-strong hover:bg-bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        selected
                          ? "border-accent-blue bg-accent-blue text-white"
                          : "border-border-default text-text-tertiary"
                      }`}
                    >
                      {String.fromCharCode(65 + currentQuestion.options.indexOf(option))}
                    </span>
                    <span
                      className={selected ? "text-text-primary font-medium" : "text-text-secondary"}
                    >
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </CardContent>

          <CardFooter className="justify-between pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              <ArrowLeft size={16} /> Previous
            </Button>

            {currentIndex === totalQuestions - 1 ? (
              <Button onClick={handleSubmit} disabled={submitting} size="sm">
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Submit Test
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
              >
                Next <ArrowRight size={16} />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Question navigation panel */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="text-sm">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = flagged.has(q.id);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      isCurrent
                        ? "border-accent-blue bg-accent-blue border-2 text-white"
                        : isAnswered
                          ? "border-accent-green bg-accent-green/10 text-accent-green border-2"
                          : "border-border-default text-text-tertiary hover:border-border-strong border-2"
                    }`}
                    aria-label={`Go to question ${idx + 1}${isAnswered ? " (answered)" : ""}${isFlagged ? " (flagged)" : ""}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="bg-accent-amber absolute -top-1 -right-1 h-3 w-3 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-text-tertiary mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="border-accent-green bg-accent-green/10 h-3 w-3 rounded-sm border-2" />
                Answered ({answeredCount})
              </div>
              <div className="flex items-center gap-2">
                <span className="border-border-default h-3 w-3 rounded-sm border-2" />
                Unanswered ({totalQuestions - answeredCount})
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-accent-amber h-3 w-3 rounded-full" />
                Flagged ({flagged.size})
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={submitting} className="mt-4 w-full" size="sm">
              <Send size={16} /> Submit Test
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
