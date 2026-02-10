"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  ScanLine,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useInstructorDashboard,
  useInstructorCourses,
  useInstructorCohorts,
} from "@/lib/hooks/use-queries";

const STAT_CARDS = [
  {
    key: "assignedCourses",
    label: "Assigned Courses",
    icon: BookOpen,
    color: "bg-accent-blue/10 text-accent-blue",
  },
  {
    key: "totalStudents",
    label: "Active Students",
    icon: Users,
    color: "bg-accent-green/10 text-accent-green",
  },
  {
    key: "attendanceRate",
    label: "Attendance Rate",
    icon: TrendingUp,
    color: "bg-accent-amber/10 text-accent-amber",
    suffix: "%",
  },
  {
    key: "upcomingSessionsCount",
    label: "Upcoming Sessions",
    icon: CalendarDays,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
] as const;

const STATUS_ICON = {
  present: <CheckCircle className="text-accent-green h-4 w-4" />,
  absent: <XCircle className="text-accent-red h-4 w-4" />,
  excused: <AlertCircle className="text-accent-amber h-4 w-4" />,
};

export default function InstructorDashboardPage() {
  const { data: stats, isLoading } = useInstructorDashboard();
  const { data: courses = [] } = useInstructorCourses();
  const { data: cohorts = [] } = useInstructorCohorts();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading dashboard">
          <div className="border-accent-green h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Instructor Dashboard
        </h1>
        <p className="text-text-secondary mt-1">Overview of your courses, students, and sessions</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const value = stats[card.key] ?? 0;
          return (
            <Card key={card.key} className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${card.color}`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-text-primary text-2xl font-bold">
                    {value}
                    {"suffix" in card ? card.suffix : ""}
                  </p>
                  <p className="text-text-tertiary truncate text-xs">{card.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Courses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="text-accent-blue h-5 w-5" />
                My Courses
              </CardTitle>
              <CardDescription>{courses.length} assigned</CardDescription>
            </div>
            <Link href="/instructor/courses">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {courses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="border-border-default flex items-center justify-between rounded-2xl border-2 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary truncate text-sm font-semibold">{course.title}</p>
                  <p className="text-text-tertiary text-xs">
                    {course.enrolledCount}/{course.capacity} enrolled &middot; {course.duration}
                  </p>
                </div>
                <Badge variant={course.status === "published" ? "success" : "default"}>
                  {course.status}
                </Badge>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-text-tertiary py-6 text-center text-sm">
                No courses assigned yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-500" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>
              {cohorts.filter((c) => c.status !== "completed").length} active cohorts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {cohorts
              .filter((c) => c.status !== "completed" && c.status !== "cancelled")
              .slice(0, 4)
              .map((cohort) => (
                <div
                  key={cohort.id}
                  className="border-border-default flex items-center justify-between rounded-2xl border-2 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-semibold">
                      {cohort.courseName}
                    </p>
                    <div className="text-text-tertiary mt-0.5 flex items-center gap-2 text-xs">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(cohort.startDate).toLocaleDateString()} –{" "}
                        {new Date(cohort.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      cohort.status === "in-progress"
                        ? "info"
                        : cohort.status === "scheduled"
                          ? "warning"
                          : "default"
                    }
                  >
                    {cohort.status}
                  </Badge>
                </div>
              ))}
            {cohorts.length === 0 && (
              <p className="text-text-tertiary py-6 text-center text-sm">No upcoming sessions.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link href="/instructor/attendance">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ScanLine className="h-4 w-4" /> Scan Attendance
              </Button>
            </Link>
            <Link href="/instructor/students">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" /> View Students
              </Button>
            </Link>
            <Link href="/instructor/grading">
              <Button variant="outline" className="w-full justify-start gap-2">
                <CheckCircle className="h-4 w-4" /> Grade Tests
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      {stats.recentAttendance.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="text-accent-green h-5 w-5" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Latest attendance records</CardDescription>
            </div>
            <Link href="/instructor/attendance">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentAttendance.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="border-border-default flex items-center justify-between rounded-xl border px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {STATUS_ICON[record.status]}
                    <div className="min-w-0">
                      <p className="text-text-primary truncate text-sm font-medium">
                        {record.userName}
                      </p>
                      <p className="text-text-tertiary text-xs">
                        {record.date} &middot; {record.method}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      record.status === "present"
                        ? "success"
                        : record.status === "absent"
                          ? "error"
                          : "warning"
                    }
                    className="shrink-0"
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
