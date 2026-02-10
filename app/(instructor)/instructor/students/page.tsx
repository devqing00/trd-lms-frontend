"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Users, Search, BookOpen, Clock, UserCheck, UserX, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInstructorCourses, useInstructorEnrollments } from "@/lib/hooks/use-queries";

export default function InstructorStudentsPage() {
  return (
    <Suspense>
      <StudentsContent />
    </Suspense>
  );
}

function StudentsContent() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("courseId") ?? "all";
  const [courseFilter, setCourseFilter] = useState(initialCourse);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: courses = [] } = useInstructorCourses();
  const { data: enrollments = [], isLoading } = useInstructorEnrollments(
    courseFilter !== "all" ? courseFilter : undefined
  );

  const filtered = enrollments.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      if (!e.userName.toLowerCase().includes(q) && !e.userEmail.toLowerCase().includes(q))
        return false;
    }
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  // Stats
  const stats = (() => {
    const enrolled = enrollments.filter((e) => e.status === "enrolled").length;
    const completed = enrollments.filter((e) => e.status === "completed").length;
    const waitlisted = enrollments.filter((e) => e.status === "waitlisted").length;
    const cancelled = enrollments.filter((e) => e.status === "cancelled").length;
    return { enrolled, completed, waitlisted, cancelled, total: enrollments.length };
  })();

  const STATUS_BADGE: Record<string, "success" | "info" | "warning" | "default"> = {
    enrolled: "info",
    completed: "success",
    waitlisted: "warning",
    cancelled: "default",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          My Students
        </h1>
        <p className="text-text-secondary mt-1">
          {stats.total} student{stats.total !== 1 ? "s" : ""} across your assigned courses
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-blue/10 flex h-10 w-10 items-center justify-center rounded-2xl">
              <Users className="text-accent-blue h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary text-2xl font-bold">{stats.enrolled}</p>
              <p className="text-text-tertiary text-xs">Enrolled</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-green/10 flex h-10 w-10 items-center justify-center rounded-2xl">
              <UserCheck className="text-accent-green h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary text-2xl font-bold">{stats.completed}</p>
              <p className="text-text-tertiary text-xs">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-amber/10 flex h-10 w-10 items-center justify-center rounded-2xl">
              <Clock className="text-accent-amber h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary text-2xl font-bold">{stats.waitlisted}</p>
              <p className="text-text-tertiary text-xs">Waitlisted</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-2xl">
              <UserX className="text-text-tertiary h-5 w-5" />
            </div>
            <div>
              <p className="text-text-primary text-2xl font-bold">{stats.cancelled}</p>
              <p className="text-text-tertiary text-xs">Cancelled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name or email..."
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="waitlisted">Waitlisted</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results count */}
      <p className="text-text-tertiary text-sm">
        Showing {filtered.length} of {enrollments.length} students
      </p>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div role="status" aria-label="Loading students">
                <div className="border-accent-green h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                <span className="sr-only">Loading students…</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="text-text-tertiary mx-auto h-12 w-12" />
              <p className="text-text-secondary mt-2">No students found.</p>
              {(search || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Student</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Enrolled</TableHead>
                    <TableHead className="w-16">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="max-w-[180px]">
                        <p className="text-text-primary truncate text-sm font-medium">
                          {enrollment.userName}
                        </p>
                      </TableCell>
                      <TableCell className="hidden max-w-[220px] sm:table-cell">
                        <span className="text-text-secondary block truncate text-sm">
                          {enrollment.userEmail}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-text-secondary line-clamp-1 text-sm">
                          {enrollment.courseName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE[enrollment.status] ?? "default"}>
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-text-tertiary text-xs">
                          {enrollment.enrolledAt
                            ? new Date(enrollment.enrolledAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${enrollment.userEmail}`}
                          className="text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          aria-label={`Email ${enrollment.userName}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
