"use client";

import Link from "next/link";
import { BookOpen, Users, Clock, MapPin, ClipboardCheck, ScanLine, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useInstructorCourses, useInstructorEnrollments } from "@/lib/hooks/use-queries";

const STATUS_VARIANT: Record<string, "success" | "warning" | "default"> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

export default function InstructorCoursesPage() {
  const { data: courses = [], isLoading } = useInstructorCourses();
  const { data: allEnrollments = [] } = useInstructorEnrollments();

  function getCourseStats(courseId: string) {
    const enrollments = allEnrollments.filter((e) => e.courseId === courseId);
    const enrolled = enrollments.filter((e) => e.status === "enrolled").length;
    const completed = enrollments.filter((e) => e.status === "completed").length;
    const total = enrolled + completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { enrolled, completed, total, completionRate };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          My Courses
        </h1>
        <p className="text-text-secondary mt-1">
          {courses.length} course{courses.length !== 1 ? "s" : ""} assigned to you
        </p>
      </div>

      {/* Summary stats */}
      {courses.length > 0 && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent-blue/10 flex h-10 w-10 items-center justify-center rounded-2xl">
                <BookOpen className="text-accent-blue h-5 w-5" />
              </div>
              <div>
                <p className="text-text-primary text-2xl font-bold">{courses.length}</p>
                <p className="text-text-tertiary text-xs">Total Courses</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent-green/10 flex h-10 w-10 items-center justify-center rounded-2xl">
                <Users className="text-accent-green h-5 w-5" />
              </div>
              <div>
                <p className="text-text-primary text-2xl font-bold">
                  {courses.reduce((sum, c) => sum + c.enrolledCount, 0)}
                </p>
                <p className="text-text-tertiary text-xs">Total Students</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent-amber/10 flex h-10 w-10 items-center justify-center rounded-2xl">
                <Layers className="text-accent-amber h-5 w-5" />
              </div>
              <div>
                <p className="text-text-primary text-2xl font-bold">
                  {courses.reduce((sum, c) => sum + c.modules.length, 0)}
                </p>
                <p className="text-text-tertiary text-xs">Total Modules</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-text-primary text-2xl font-bold">
                  {courses.filter((c) => c.status === "published").length}
                </p>
                <p className="text-text-tertiary text-xs">Published</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div role="status" aria-label="Loading courses">
            <div className="border-accent-green h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
            <span className="sr-only">Loading courses…</span>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="text-text-tertiary mx-auto h-12 w-12" />
          <p className="text-text-secondary mt-4">No courses assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const stats = getCourseStats(course.id);
            const fillPercent =
              course.capacity > 0 ? Math.round((course.enrolledCount / course.capacity) * 100) : 0;

            return (
              <Card key={course.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant={STATUS_VARIANT[course.status] ?? "default"}>
                      {course.status}
                    </Badge>
                    <span className="text-text-tertiary max-w-[140px] min-w-0 truncate text-xs">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="font-display text-text-primary line-clamp-2 text-lg font-bold">
                    {course.title}
                  </h3>
                  <p className="text-text-secondary mt-1 line-clamp-2 text-sm">
                    {course.description}
                  </p>

                  <div className="text-text-tertiary mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {course.enrolledCount}/{course.capacity} enrolled
                      </span>
                      <span className="text-xs font-medium">{fillPercent}%</span>
                    </div>
                    <Progress value={fillPercent} className="h-1.5" />

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <span>{course.modules.length} modules</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {course.venue.room} — {course.venue.address}
                      </span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  {stats.total > 0 && (
                    <div className="border-border-default bg-bg-secondary mt-3 grid grid-cols-3 gap-2 rounded-xl border-2 p-2.5">
                      <div className="text-center">
                        <p className="text-accent-blue text-sm font-bold">{stats.enrolled}</p>
                        <p className="text-text-tertiary text-[10px]">Active</p>
                      </div>
                      <div className="text-center">
                        <p className="text-accent-green text-sm font-bold">{stats.completed}</p>
                        <p className="text-text-tertiary text-[10px]">Done</p>
                      </div>
                      <div className="text-center">
                        <p className="text-text-primary text-sm font-bold">
                          {stats.completionRate}%
                        </p>
                        <p className="text-text-tertiary text-[10px]">Rate</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
                    <Link href={`/instructor/students?courseId=${course.id}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        <Users className="mr-1 h-3.5 w-3.5" /> Students
                      </Button>
                    </Link>
                    <Link href={`/instructor/attendance?courseId=${course.id}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        <ScanLine className="mr-1 h-3.5 w-3.5" /> Attend.
                      </Button>
                    </Link>
                    <Link href="/instructor/grading">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        <ClipboardCheck className="mr-1 h-3.5 w-3.5" /> Grade
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
