"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, ClipboardList, Target, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  useCourses,
  useTests,
  useCreateTest,
  useUpdateTest,
  useDeleteTest,
  useQuestionBank,
} from "@/lib/hooks/use-queries";
import { toast } from "sonner";
import type { Test, TestCategory } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

const CATEGORY_BADGE: Record<TestCategory, "info" | "success" | "warning"> = {
  prerequisite: "warning",
  "post-course": "success",
  module: "info",
};

const CATEGORY_LABELS: Record<TestCategory, string> = {
  prerequisite: "Prerequisite",
  "post-course": "Post-Course",
  module: "Module",
};

interface TestForm {
  title: string;
  courseId: string;
  category: TestCategory;
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number;
  questionIds: string[];
}

const emptyForm: TestForm = {
  title: "",
  courseId: "",
  category: "prerequisite",
  passingScore: 70,
  maxAttempts: 3,
  timeLimitMinutes: 30,
  questionIds: [],
};

export default function TestsPage() {
  const { data: testsData, isLoading } = useTests();
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100, search: "" });
  const createTest = useCreateTest();
  const updateTest = useUpdateTest();
  const deleteTest = useDeleteTest();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [form, setForm] = useState<TestForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Test | null>(null);

  // Fetch questions for selected course when editing
  const { data: questionsData } = useQuestionBank(
    form.courseId ? { courseId: form.courseId } : undefined
  );
  const availableQuestions = questionsData ?? [];

  const tests = useMemo(() => testsData ?? [], [testsData]);

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [tests, search, categoryFilter]);

  const courseLookup = useMemo(() => {
    const map = new Map<string, string>();
    coursesData?.data.forEach((c) => map.set(c.id, c.title));
    return map;
  }, [coursesData]);

  function openCreate() {
    setEditingTest(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(test: Test) {
    setEditingTest(test);
    setForm({
      title: test.title,
      courseId: test.courseId,
      category: test.category,
      passingScore: test.passingScore,
      maxAttempts: test.maxAttempts,
      timeLimitMinutes: test.timeLimitMinutes ?? 30,
      questionIds: test.questions.map((q) => q.id),
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.courseId) {
      toast.error("Title and Course are required");
      return;
    }

    if (editingTest) {
      updateTest.mutate(
        {
          id: editingTest.id,
          title: form.title,
          courseId: form.courseId,
          category: form.category,
          passingScore: form.passingScore,
          maxAttempts: form.maxAttempts,
          timeLimitMinutes: form.timeLimitMinutes || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Test updated");
            setDialogOpen(false);
          },
        }
      );
    } else {
      createTest.mutate(
        {
          title: form.title,
          courseId: form.courseId,
          category: form.category,
          passingScore: form.passingScore,
          maxAttempts: form.maxAttempts,
          timeLimitMinutes: form.timeLimitMinutes || undefined,
          questionIds: form.questionIds,
        },
        {
          onSuccess: () => {
            toast.success("Test created");
            setDialogOpen(false);
          },
        }
      );
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteTest.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Test "${deleteTarget.title}" deleted`);
        setDeleteTarget(null);
      },
    });
  }

  function toggleQuestion(qId: string) {
    setForm((prev) => ({
      ...prev,
      questionIds: prev.questionIds.includes(qId)
        ? prev.questionIds.filter((id) => id !== qId)
        : [...prev.questionIds, qId],
    }));
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="text-accent-blue h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Test Management
          </h1>
          <p className="text-text-secondary mt-1">
            Create and manage prerequisite, post-course, and module tests
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Test
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <ClipboardList className="text-accent-blue h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Total Tests</p>
              <p className="text-text-primary text-xl font-bold">{tests.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <Target className="text-accent-amber h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Prerequisite</p>
              <p className="text-text-primary text-xl font-bold">
                {tests.filter((t) => t.category === "prerequisite").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <HelpCircle className="text-accent-green h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Post-Course</p>
              <p className="text-text-primary text-xl font-bold">
                {tests.filter((t) => t.category === "post-course").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              placeholder="Search tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              aria-label="Search tests"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="prerequisite">Prerequisite</SelectItem>
              <SelectItem value="post-course">Post-Course</SelectItem>
              <SelectItem value="module">Module</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead className="text-center">Passing %</TableHead>
              <TableHead className="text-center">Time Limit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-text-tertiary py-12 text-center">
                  <ClipboardList className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  <p>No tests found</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.title}</TableCell>
                  <TableCell className="text-text-secondary text-sm">
                    {courseLookup.get(test.courseId) ?? "Unknown"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={CATEGORY_BADGE[test.category]}>
                      {CATEGORY_LABELS[test.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{test.questions.length}</TableCell>
                  <TableCell className="text-center">{test.passingScore}%</TableCell>
                  <TableCell className="text-center">
                    {test.timeLimitMinutes ? `${test.timeLimitMinutes} min` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(test)}
                        aria-label={`Edit ${test.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-accent-red h-8 w-8"
                        onClick={() => setDeleteTarget(test)}
                        aria-label={`Delete ${test.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTest ? "Edit Test" : "Create Test"}</DialogTitle>
            <DialogDescription>
              {editingTest
                ? "Update test settings and question assignments"
                : "Set up a new test with questions from the course bank"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="test-title">Title</Label>
              <Input
                id="test-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. ICT Prerequisite Assessment"
              />
            </div>

            {/* Course + Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  value={form.courseId}
                  onValueChange={(v) => setForm((p) => ({ ...p, courseId: v, questionIds: [] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesData?.data.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((p) => ({ ...p, category: v as TestCategory }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prerequisite">Prerequisite</SelectItem>
                    <SelectItem value="post-course">Post-Course</SelectItem>
                    <SelectItem value="module">Module</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Passing / Attempts / Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="passing">Passing Score (%)</Label>
                <Input
                  id="passing"
                  type="number"
                  min={1}
                  max={100}
                  value={form.passingScore}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, passingScore: parseInt(e.target.value) || 70 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attempts">Max Attempts</Label>
                <Input
                  id="attempts"
                  type="number"
                  min={1}
                  max={10}
                  value={form.maxAttempts}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, maxAttempts: parseInt(e.target.value) || 3 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time Limit (min)</Label>
                <Input
                  id="time"
                  type="number"
                  min={0}
                  max={180}
                  value={form.timeLimitMinutes}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      timeLimitMinutes: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <p className="text-text-tertiary text-xs">0 = no limit</p>
              </div>
            </div>

            {/* Question Selection */}
            {form.courseId && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <HelpCircle className="text-accent-blue h-4 w-4" />
                    Questions ({form.questionIds.length} selected)
                  </CardTitle>
                  <CardDescription>Select questions from the course question bank</CardDescription>
                </CardHeader>
                <CardContent>
                  {availableQuestions.length === 0 ? (
                    <p className="text-text-tertiary py-4 text-center text-sm">
                      No questions in this course bank yet. Create questions first.
                    </p>
                  ) : (
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {availableQuestions.map((q) => (
                        <label
                          key={q.id}
                          className={`border-border-default hover:bg-bg-tertiary flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors ${
                            form.questionIds.includes(q.id)
                              ? "border-accent-blue bg-accent-blue/5"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-accent-blue h-4 w-4"
                            checked={form.questionIds.includes(q.id)}
                            onChange={() => toggleQuestion(q.id)}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-text-primary truncate text-sm">{q.text}</p>
                            <div className="mt-1 flex items-center gap-2">
                              {q.difficulty && (
                                <Badge variant="outline" className="text-xs">
                                  {q.difficulty}
                                </Badge>
                              )}
                              {q.tags?.map((tag) => (
                                <span key={tag} className="text-text-tertiary text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={
                !form.title.trim() || !form.courseId || createTest.isPending || updateTest.isPending
              }
            >
              {createTest.isPending || updateTest.isPending
                ? "Saving..."
                : editingTest
                  ? "Update Test"
                  : "Create Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This will remove
              the test and disassociate it from any course. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-accent-red hover:bg-accent-red/90"
              onClick={handleDelete}
              disabled={deleteTest.isPending}
            >
              {deleteTest.isPending ? "Deleting..." : "Delete Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
