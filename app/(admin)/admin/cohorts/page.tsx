"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, Users, CalendarDays, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  useCohorts,
  useCreateCohort,
  useUpdateCohort,
  useDeleteCohort,
  useCourses,
  useUsers,
} from "@/lib/hooks/use-queries";
import { useTableFilters } from "@/lib/hooks/use-table-filters";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import type { Cohort, CohortStatus } from "@/lib/types";

const STATUS_BADGE: Record<CohortStatus, "info" | "success" | "warning" | "default"> = {
  scheduled: "info",
  "in-progress": "warning",
  completed: "success",
  cancelled: "default",
};

interface CohortForm {
  courseId: string;
  instructorId: string;
  startDate: string;
  endDate: string;
  status: CohortStatus;
  capacity: number;
}

const emptyForm: CohortForm = {
  courseId: "",
  instructorId: "",
  startDate: "",
  endDate: "",
  status: "scheduled",
  capacity: 30,
};

export default function CohortsPage() {
  const { filters, setSearch, setPage } = useTableFilters({ pageSize: 15 });
  const { data, isLoading } = useCohorts(filters);
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100, search: "" });
  const { data: usersData } = useUsers({ page: 1, pageSize: 100, search: "" });
  const createCohort = useCreateCohort();
  const updateCohort = useUpdateCohort();
  const deleteCohort = useDeleteCohort();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [form, setForm] = useState<CohortForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Cohort | null>(null);

  const instructors = useMemo(() => {
    return usersData?.data.filter((u) => u.role === "instructor") ?? [];
  }, [usersData]);

  const courseLookup = useMemo(() => {
    const map = new Map<string, string>();
    coursesData?.data.forEach((c) => map.set(c.id, c.title));
    return map;
  }, [coursesData]);

  function openCreate() {
    setEditingCohort(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(cohort: Cohort) {
    setEditingCohort(cohort);
    setForm({
      courseId: cohort.courseId,
      instructorId: cohort.instructorId,
      startDate: cohort.startDate.split("T")[0] ?? "",
      endDate: cohort.endDate.split("T")[0] ?? "",
      status: cohort.status,
      capacity: cohort.capacity,
    });
    setDialogOpen(true);
  }

  function handleSubmit() {
    if (!form.courseId || !form.instructorId || !form.startDate || !form.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const courseName = courseLookup.get(form.courseId) ?? "";
    const instructor = instructors.find((i) => i.id === form.instructorId);
    const instructorName = instructor?.name ?? "";

    if (editingCohort) {
      updateCohort.mutate(
        {
          id: editingCohort.id,
          courseId: form.courseId,
          courseName,
          instructorId: form.instructorId,
          instructorName,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
          status: form.status,
          capacity: form.capacity,
        },
        {
          onSuccess: () => {
            toast.success("Cohort updated");
            setDialogOpen(false);
          },
        }
      );
    } else {
      createCohort.mutate(
        {
          courseId: form.courseId,
          courseName,
          instructorId: form.instructorId,
          instructorName,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
          status: form.status,
          capacity: form.capacity,
        },
        {
          onSuccess: () => {
            toast.success("Cohort created");
            setDialogOpen(false);
          },
        }
      );
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteCohort.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Cohort deleted");
        setDeleteTarget(null);
      },
    });
  }

  const cohorts = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

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
            Cohort Management
          </h1>
          <p className="text-text-secondary mt-1">
            Schedule and manage training cohorts across courses
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Cohort
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <CalendarDays className="text-accent-blue h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Total</p>
              <p className="text-text-primary text-xl font-bold">{data?.total ?? 0}</p>
            </div>
          </div>
        </Card>
        {(["scheduled", "in-progress", "completed"] as CohortStatus[]).map((status) => (
          <Card key={status} className="p-4">
            <div className="flex items-center gap-3">
              <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
                <Users
                  className={`h-5 w-5 ${
                    status === "scheduled"
                      ? "text-accent-blue"
                      : status === "in-progress"
                        ? "text-accent-amber"
                        : "text-accent-green"
                  }`}
                />
              </div>
              <div>
                <p className="text-text-tertiary text-sm capitalize">{status}</p>
                <p className="text-text-primary text-xl font-bold">
                  {cohorts.filter((c) => c.status === status).length}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search
            className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            placeholder="Search cohorts by course or instructor..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search cohorts"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead className="text-center">Enrolled / Cap</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohorts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-text-tertiary py-12 text-center">
                  <CalendarDays className="mx-auto mb-2 h-8 w-8 opacity-40" />
                  <p>No cohorts found</p>
                </TableCell>
              </TableRow>
            ) : (
              cohorts.map((cohort) => (
                <TableRow key={cohort.id}>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    {cohort.courseName}
                  </TableCell>
                  <TableCell className="text-text-secondary">{cohort.instructorName}</TableCell>
                  <TableCell className="text-text-secondary text-sm">
                    {new Date(cohort.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-text-secondary text-sm">
                    {new Date(cohort.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        cohort.enrolledCount >= cohort.capacity ? "text-accent-red font-medium" : ""
                      }
                    >
                      {cohort.enrolledCount}
                    </span>{" "}
                    / {cohort.capacity}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[cohort.status]}>{cohort.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(cohort)}
                        aria-label={`Edit cohort`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-accent-red h-8 w-8"
                        onClick={() => setDeleteTarget(cohort)}
                        aria-label={`Delete cohort`}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-border-default flex items-center justify-between border-t-2 px-4 py-3">
            <p className="text-text-tertiary text-sm">
              Page {filters.page} of {totalPages} ({data?.total ?? 0} cohorts)
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={filters.page <= 1}
                onClick={() => setPage(filters.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={filters.page >= totalPages}
                onClick={() => setPage(filters.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCohort ? "Edit Cohort" : "Create Cohort"}</DialogTitle>
            <DialogDescription>
              {editingCohort
                ? "Update cohort schedule and assignment"
                : "Schedule a new training cohort for a course"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Course */}
            <div className="space-y-2">
              <Label>Course</Label>
              <Select
                value={form.courseId}
                onValueChange={(v) => setForm((p) => ({ ...p, courseId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {coursesData?.data.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3" />
                        {c.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instructor */}
            <div className="space-y-2">
              <Label>Instructor</Label>
              <Select
                value={form.instructorId}
                onValueChange={(v) => setForm((p) => ({ ...p, instructorId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign instructor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Date</Label>
                <Input
                  id="start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Date</Label>
                <Input
                  id="end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Capacity + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cap">Capacity</Label>
                <Input
                  id="cap"
                  type="number"
                  min={1}
                  max={200}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, capacity: parseInt(e.target.value) || 30 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((p) => ({ ...p, status: v as CohortStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
              variant="primary"
              onClick={handleSubmit}
              disabled={
                !form.courseId ||
                !form.instructorId ||
                !form.startDate ||
                !form.endDate ||
                createCohort.isPending ||
                updateCohort.isPending
              }
            >
              {createCohort.isPending || updateCohort.isPending
                ? "Saving..."
                : editingCohort
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cohort</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the cohort for &ldquo;{deleteTarget?.courseName}
              &rdquo;? This action cannot be undone.
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
              disabled={deleteCohort.isPending}
            >
              {deleteCohort.isPending ? "Deleting..." : "Delete Cohort"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
