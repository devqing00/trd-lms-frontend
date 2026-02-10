"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  Filter,
  CheckCircle2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  useCourses,
  useQuestionBank,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from "@/lib/hooks/use-queries";
import { toast } from "sonner";
import type { Question } from "@/lib/types";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const TOPICS = ["Safety", "Regulations", "Equipment", "Procedures", "Emergency Response"];
const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "border-accent-green text-accent-green",
  medium: "border-accent-amber text-accent-amber",
  hard: "border-accent-red text-accent-red",
};

export default function QuestionBankPage() {
  // Course selection
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Question, "id">>({
    courseId: "",
    text: "",
    type: "mcq",
    options: [
      { id: "opt-a", text: "" },
      { id: "opt-b", text: "" },
      { id: "opt-c", text: "" },
      { id: "opt-d", text: "" },
    ],
    correctOptionId: "opt-a",
    tags: [],
    difficulty: "medium",
  });

  const { data: courseData } = useCourses({
    search: "",
    page: 1,
    pageSize: 100,
  });
  const courses = courseData?.data ?? [];

  const { data: allQuestions = [] } = useQuestionBank({});
  const { data: courseQuestions = [], isLoading } = useQuestionBank({
    courseId: selectedCourseId ?? undefined,
    search: search || undefined,
    difficulty: difficultyFilter !== "all" ? difficultyFilter : undefined,
    tag: tagFilter !== "all" ? tagFilter : undefined,
  });

  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  // Build per-course stats
  const courseStats = useMemo(() => {
    const map = new Map<string, number>();
    allQuestions.forEach((q) => {
      map.set(q.courseId, (map.get(q.courseId) ?? 0) + 1);
    });
    return map;
  }, [allQuestions]);

  // Extract unique topics from selected course questions
  const courseTopics = useMemo(() => {
    if (!selectedCourseId) return TOPICS;
    const tags = new Set<string>();
    allQuestions
      .filter((q) => q.courseId === selectedCourseId)
      .forEach((q) => q.tags.forEach((t) => tags.add(t)));
    return tags.size > 0 ? Array.from(tags) : TOPICS;
  }, [selectedCourseId, allQuestions]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  function openCreate() {
    setEditingQuestion(null);
    setForm({
      courseId: selectedCourseId ?? "",
      text: "",
      type: "mcq",
      options: [
        { id: "opt-a", text: "" },
        { id: "opt-b", text: "" },
        { id: "opt-c", text: "" },
        { id: "opt-d", text: "" },
      ],
      correctOptionId: "opt-a",
      tags: [],
      difficulty: "medium",
    });
    setDialogOpen(true);
  }

  function openEdit(q: Question) {
    setEditingQuestion(q);
    setForm({
      courseId: q.courseId,
      text: q.text,
      type: q.type,
      options: q.options.map((o) => ({ ...o })),
      correctOptionId: q.correctOptionId,
      tags: [...q.tags],
      difficulty: q.difficulty,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (editingQuestion) {
      updateQuestion.mutate(
        { id: editingQuestion.id, ...form },
        {
          onSuccess: () => {
            setDialogOpen(false);
            toast.success("Question updated");
          },
        }
      );
    } else {
      createQuestion.mutate(form, {
        onSuccess: () => {
          setDialogOpen(false);
          toast.success("Question added");
        },
      });
    }
  }

  function handleDelete(id: string) {
    setDeleteTarget(id);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteQuestion.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Question deleted");
        setDeleteTarget(null);
      },
    });
  }

  function updateOption(index: number, text: string) {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((o, i) => (i === index ? { ...o, text } : o)),
    }));
  }

  const isFormValid =
    form.text.trim() !== "" &&
    form.courseId !== "" &&
    form.options.every((o) => o.text.trim() !== "");

  // ====== Course selection view ======
  if (!selectedCourseId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Question Bank
          </h1>
          <p className="text-text-secondary mt-1">
            Select a course to manage its assessment questions &middot; {allQuestions.length} total
            questions across {courses.length} courses
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const count = courseStats.get(course.id) ?? 0;
            return (
              <Card
                key={course.id}
                className="hover:border-accent-blue cursor-pointer transition-all hover:shadow-md"
                onClick={() => setSelectedCourseId(course.id)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="bg-accent-blue/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                    <BookOpen className="text-accent-blue h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-semibold">
                      {course.title}
                    </p>
                    <p className="text-text-tertiary text-xs">
                      {count} question{count !== 1 ? "s" : ""} &middot; {course.category}
                    </p>
                  </div>
                  <ChevronRight className="text-text-tertiary h-4 w-4 shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="py-12 text-center">
            <BookOpen className="text-text-tertiary mx-auto h-12 w-12" />
            <p className="text-text-secondary mt-2">
              No courses yet. Create a course to start adding questions.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ====== Course questions view ======
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <button
            onClick={() => {
              setSelectedCourseId(null);
              setSearch("");
              setDifficultyFilter("all");
              setTagFilter("all");
            }}
            className="text-accent-blue mb-1 flex items-center gap-1 text-xs font-medium hover:underline"
          >
            ← All Courses
          </button>
          <h1 className="font-display text-text-primary truncate text-2xl font-bold tracking-tight sm:text-3xl">
            {selectedCourse?.title ?? "Course"}
          </h1>
          <p className="text-text-secondary mt-1">
            {courseQuestions.length} question{courseQuestions.length !== 1 ? "s" : ""} &middot;{" "}
            {courseTopics.length} topics
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>

      {/* Topics overview */}
      <div className="flex flex-wrap gap-2">
        {courseTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => setTagFilter((prev) => (prev === topic ? "all" : topic))}
            className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-all ${
              tagFilter === topic
                ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                : "border-border-default text-text-secondary hover:border-accent-blue"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulty</SelectItem>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div role="status" aria-label="Loading questions">
                <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                <span className="sr-only">Loading questions…</span>
              </div>
            </div>
          ) : courseQuestions.length === 0 ? (
            <div className="py-12 text-center">
              <HelpCircle className="text-text-tertiary mx-auto h-12 w-12" />
              <p className="text-text-secondary mt-2">
                No questions for this course yet. Add your first question!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[240px]">Question</TableHead>
                    <TableHead className="hidden sm:table-cell">Difficulty</TableHead>
                    <TableHead className="hidden md:table-cell">Topic</TableHead>
                    <TableHead className="hidden lg:table-cell">Options</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseQuestions.slice(0, 50).map((q) => (
                    <TableRow key={q.id}>
                      <TableCell>
                        <p className="text-text-primary line-clamp-2 text-sm font-medium">
                          {q.text}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={DIFFICULTY_COLORS[q.difficulty ?? "medium"]}
                        >
                          {q.difficulty ?? "medium"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {q.tags.map((tag) => (
                            <Badge key={tag} variant="default" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-text-secondary text-sm">
                          {q.options.length} options
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(q)}
                            aria-label={`Edit question: ${q.text.slice(0, 50)}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-accent-red h-8 w-8"
                            onClick={() => handleDelete(q.id)}
                            aria-label={`Delete question: ${q.text.slice(0, 50)}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Edit Question" : "Add Question"}</DialogTitle>
            <DialogDescription>
              {editingQuestion
                ? "Update the question details and options."
                : `Add a new question to "${selectedCourse?.title}".`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Question text */}
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                placeholder="Enter the question..."
                rows={3}
                className="border-border-default bg-bg-primary focus:border-accent-blue rounded-2xl border-2"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Answer Options</Label>
              {form.options.map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        correctOptionId: opt.id,
                      }))
                    }
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      form.correctOptionId === opt.id
                        ? "border-accent-green bg-accent-green/10 text-accent-green"
                        : "border-border-default text-text-tertiary hover:border-accent-green"
                    }`}
                    aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct answer`}
                  >
                    {form.correctOptionId === opt.id ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                    )}
                  </button>
                  <Input
                    value={opt.text}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1"
                  />
                </div>
              ))}
              <p className="text-text-tertiary text-xs">
                Click the circle to mark the correct answer.
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={form.difficulty ?? "medium"}
                  onValueChange={(v) =>
                    setForm((prev) => ({
                      ...prev,
                      difficulty: v as Question["difficulty"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select
                  value={form.tags[0] ?? "Safety"}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, tags: [v] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courseTopics.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || createQuestion.isPending || updateQuestion.isPending}
            >
              {editingQuestion ? "Save Changes" : "Add Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-accent-red hover:bg-accent-red/90"
              onClick={confirmDelete}
              disabled={deleteQuestion.isPending}
            >
              {deleteQuestion.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
