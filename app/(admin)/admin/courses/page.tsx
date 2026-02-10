"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Users,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Archive,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses, useUpdateCourse, useDeleteCourse } from "@/lib/hooks/use-queries";
import { useTableFilters } from "@/lib/hooks/use-table-filters";
import { toast } from "sonner";
import type { Course, CourseStatus } from "@/lib/types";

const STATUS_BADGE: Record<CourseStatus, "success" | "warning" | "default"> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

export default function CoursesPage() {
  const { filters, setSearch, setPage, setFilter } = useTableFilters({
    pageSize: 10,
  });
  const { data, isLoading } = useCourses(filters);
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  function handleDelete() {
    if (!deletingCourse) return;
    deleteCourse.mutate(deletingCourse.id, {
      onSuccess: () => {
        setDeletingCourse(null);
        toast.success("Course deleted");
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Courses
          </h1>
          <p className="text-text-secondary mt-1">Create and manage training courses</p>
        </div>
        <Link href="/admin/courses/new">
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            New Course
          </Button>
        </Link>
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
              placeholder="Search courses..."
              value={filters.search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              aria-label="Search courses"
            />
          </div>
          <Select
            value={filters.status ?? "all"}
            onValueChange={(v) => setFilter("status", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.category ?? "all"}
            onValueChange={(v) => setFilter("category", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="ICT & Digital Literacy">ICT & Digital Literacy</SelectItem>
              <SelectItem value="Research & Academic Writing">
                Research & Academic Writing
              </SelectItem>
              <SelectItem value="Health & Safety">Health & Safety</SelectItem>
              <SelectItem value="Leadership & Management">Leadership & Management</SelectItem>
              <SelectItem value="Laboratory & Technical Skills">
                Laboratory & Technical Skills
              </SelectItem>
              <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
              <SelectItem value="Professional Development">Professional Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Course</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Duration</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((course) => {
                    const fillPercent =
                      course.capacity > 0
                        ? Math.round((course.enrolledCount / course.capacity) * 100)
                        : 0;

                    return (
                      <TableRow key={course.id}>
                        <TableCell className="max-w-xs pl-6">
                          <div>
                            <p className="text-text-primary truncate font-medium">{course.title}</p>
                            <p className="text-text-tertiary flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">{course.venue.address}</span>
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="default">{course.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-text-secondary flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="text-text-tertiary h-3 w-3" />
                              <span className="text-text-primary font-medium">
                                {course.enrolledCount}
                              </span>
                              <span className="text-text-tertiary">/ {course.capacity}</span>
                              {course.waitlistCount > 0 && (
                                <span className="text-accent-amber text-xs">
                                  (+{course.waitlistCount} waitlist)
                                </span>
                              )}
                            </div>
                            <Progress value={fillPercent} className="h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_BADGE[course.status]}>{course.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={`Actions for ${course.title}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/courses/${course.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/courses/${course.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {course.status === "draft" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateCourse.mutate(
                                      {
                                        id: course.id,
                                        status: "published",
                                      },
                                      { onSuccess: () => toast.success("Course published") }
                                    )
                                  }
                                >
                                  <Globe className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {course.status === "published" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateCourse.mutate(
                                      {
                                        id: course.id,
                                        status: "archived",
                                      },
                                      { onSuccess: () => toast.success("Course archived") }
                                    )
                                  }
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-accent-red focus:text-accent-red"
                                onClick={() => setDeletingCourse(course)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {data?.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-text-secondary h-32 text-center">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="border-border-default flex items-center justify-between border-t-2 px-4 py-3 sm:px-6">
                <p className="text-text-secondary text-sm">
                  Showing {(data.page - 1) * data.pageSize + 1}–
                  {Math.min(data.page * data.pageSize, data.total)} of {data.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.page <= 1}
                    onClick={() => setPage(data.page - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-text-primary text-sm font-medium">
                    {data.page} / {data.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.page >= data.totalPages}
                    onClick={() => setPage(data.page + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingCourse} onOpenChange={(open) => !open && setDeletingCourse(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deletingCourse?.title}</strong>? This will
              also remove all associated enrollments and waitlist entries.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletingCourse(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCourse.isPending}>
              {deleteCourse.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
