"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ClipboardCheck,
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useInstructorCourses,
  useTestAttempts,
  useOverrideTestAttempt,
  useTests,
} from "@/lib/hooks/use-queries";
import { getCurrentInstructorId } from "@/lib/mock-data";
import type { TestAttempt } from "@/lib/types";

export default function InstructorGradingPage() {
  const [courseFilter, setCourseFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<TestAttempt | null>(null);
  const [overrideResult, setOverrideResult] = useState<"pass" | "fail">("pass");
  const [justification, setJustification] = useState("");

  const { data: courses = [] } = useInstructorCourses();
  const { data: tests = [] } = useTests();
  const { data: attemptsData, isLoading } = useTestAttempts({
    page: 1,
    pageSize: 100,
    search: "",
  });
  const overrideMutation = useOverrideTestAttempt();

  const attempts = attemptsData?.data ?? [];

  // Filter attempts to instructor's courses
  const instructorCourseIds = courses.map((c) => c.id);
  const instructorTestIds = tests
    .filter((t) => instructorCourseIds.includes(t.courseId))
    .map((t) => t.id);

  const filtered = attempts
    .filter((a) => instructorTestIds.includes(a.testId))
    .filter((a) => {
      if (courseFilter !== "all") {
        const courseTests = tests.filter((t) => t.courseId === courseFilter).map((t) => t.id);
        return courseTests.includes(a.testId);
      }
      return true;
    })
    .filter((a) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return a.userName?.toLowerCase().includes(q) || a.userEmail?.toLowerCase().includes(q);
    });

  function getTestInfo(testId: string) {
    return tests.find((t) => t.id === testId);
  }

  function getCourseForTest(testId: string) {
    const test = tests.find((t) => t.id === testId);
    if (!test) return null;
    return courses.find((c) => c.id === test.courseId);
  }

  function openOverride(attempt: TestAttempt) {
    setSelectedAttempt(attempt);
    setOverrideResult(attempt.passed ? "fail" : "pass");
    setJustification("");
    setOverrideDialogOpen(true);
  }

  function handleOverride() {
    if (!selectedAttempt) return;
    overrideMutation.mutate(
      {
        attemptId: selectedAttempt.id,
        passed: overrideResult === "pass",
        adminId: getCurrentInstructorId(),
      },
      {
        onSuccess: () => {
          toast.success("Test result overridden successfully");
          setOverrideDialogOpen(false);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Grading & Overrides
        </h1>
        <p className="text-text-secondary mt-1">
          Review test attempts and override results with justification
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              aria-label="Search students"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full sm:w-56">
              <BookOpen className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Attempts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="text-accent-green h-5 w-5" />
            Test Attempts
          </CardTitle>
          <CardDescription>
            {filtered.length} attempt{filtered.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div role="status" aria-label="Loading grades">
                <div className="border-accent-green h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                <span className="sr-only">Loading grades…</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <ClipboardCheck className="text-text-tertiary mx-auto h-12 w-12" />
              <p className="text-text-secondary mt-2">
                No test attempts to review yet. Students will appear here once they take
                assessments.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">Student</TableHead>
                    <TableHead className="min-w-[140px]">Test</TableHead>
                    <TableHead className="hidden sm:table-cell">Course</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="hidden md:table-cell">Attempt #</TableHead>
                    <TableHead className="w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((attempt) => {
                    const test = getTestInfo(attempt.testId);
                    const course = getCourseForTest(attempt.testId);
                    return (
                      <TableRow key={attempt.id}>
                        <TableCell>
                          <div className="min-w-0">
                            <p className="text-text-primary line-clamp-1 text-sm font-medium">
                              {attempt.userName}
                            </p>
                            <p className="text-text-tertiary line-clamp-1 text-xs">
                              {attempt.userEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-text-primary line-clamp-1 text-sm font-medium">
                            {test?.title ?? "Unknown Test"}
                          </p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-text-secondary line-clamp-1 text-sm">
                            {course?.title ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-text-primary text-sm font-semibold">
                            {attempt.score}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge variant={attempt.passed ? "success" : "error"} className="gap-1">
                              {attempt.passed ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {attempt.passed ? "Pass" : "Fail"}
                            </Badge>
                            {attempt.isOverridden && (
                              <Badge variant="warning" className="gap-1">
                                <Shield className="h-3 w-3" />
                                Override
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-text-tertiary text-sm">
                            #{attempt.attemptNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => openOverride(attempt)}>
                            <Shield className="mr-1 h-3 w-3" />
                            Override
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Override Dialog */}
      <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="text-accent-amber h-5 w-5" />
              Override Test Result
            </DialogTitle>
            <DialogDescription>
              This will manually change the student&apos;s test result. Provide a justification for
              the override.
            </DialogDescription>
          </DialogHeader>

          {selectedAttempt && (
            <div className="space-y-4">
              <div className="border-border-default bg-bg-secondary rounded-2xl border-2 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Current Score</span>
                  <span className="text-text-primary text-sm font-bold">
                    {selectedAttempt.score}%
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Current Result</span>
                  <Badge variant={selectedAttempt.passed ? "success" : "error"}>
                    {selectedAttempt.passed ? "Pass" : "Fail"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Override To</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOverrideResult("pass")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-medium transition-all ${
                      overrideResult === "pass"
                        ? "border-accent-green bg-accent-green/10 text-accent-green"
                        : "border-border-default text-text-secondary"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" /> Pass
                  </button>
                  <button
                    onClick={() => setOverrideResult("fail")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-medium transition-all ${
                      overrideResult === "fail"
                        ? "border-accent-red bg-accent-red/10 text-accent-red"
                        : "border-border-default text-text-secondary"
                    }`}
                  >
                    <XCircle className="h-4 w-4" /> Fail
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Justification</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Provide a reason for this override..."
                  rows={3}
                  className="border-border-default bg-bg-primary focus:border-accent-blue rounded-2xl border-2"
                />
              </div>

              <div className="bg-accent-amber/10 flex items-center gap-2 rounded-xl p-3">
                <AlertTriangle className="text-accent-amber h-4 w-4 shrink-0" />
                <p className="text-accent-amber text-xs">
                  This action will be logged and cannot be undone.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOverrideDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleOverride}
              disabled={!justification.trim() || overrideMutation.isPending}
            >
              Confirm Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
