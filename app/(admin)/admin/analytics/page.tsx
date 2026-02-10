"use client";

import {
  BarChart3,
  Users,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Award,
  Activity,
  UserCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAnalytics, useDashboardStats } from "@/lib/hooks/use-queries";

// CSS-only bar chart component (no external chart deps)
function BarChart({
  data,
  maxValue,
}: {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
}) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-text-secondary w-20 truncate text-xs sm:w-40">{d.label}</span>
          <div className="flex-1">
            <div className="bg-bg-tertiary h-6 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  d.color ?? "bg-accent-blue"
                }`}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-text-primary w-8 text-right text-xs font-semibold">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

// Simple CSS bar-group for pass/fail
function PassFailChart({ data }: { data: { label: string; passed: number; failed: number }[] }) {
  const max = Math.max(...data.map((d) => d.passed + d.failed), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-text-secondary w-24 truncate text-xs sm:w-40">{d.label}</span>
            <span className="text-text-tertiary text-xs">
              {d.passed + d.failed > 0 ? Math.round((d.passed / (d.passed + d.failed)) * 100) : 0}%
              pass
            </span>
          </div>
          <div className="bg-bg-tertiary flex h-5 overflow-hidden rounded-full">
            <div
              className="bg-accent-green h-full transition-all duration-500"
              style={{
                width: `${(d.passed / max) * 100}%`,
              }}
            />
            <div
              className="bg-accent-red h-full transition-all duration-500"
              style={{
                width: `${(d.failed / max) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Mini trend bars using CSS
function MiniBar({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height: 64 }}>
      {data.map((d) => (
        <div key={d.label} className="group flex flex-1 flex-col items-center gap-1">
          <div
            className="bg-accent-blue group-hover:bg-accent-blue/80 w-full rounded-t transition-all"
            style={{ height: `${(d.value / max) * 100}%`, minHeight: 4 }}
          />
          <span className="text-text-tertiary text-[9px]">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const isLoading = analyticsLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading analytics">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading analytics…</span>
        </div>
      </div>
    );
  }

  if (!analytics || !stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Analytics & Reports
        </h1>
        <p className="text-text-secondary mt-1">
          Insights across courses, students, and instructor performance
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-blue/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
              <Users className="text-accent-blue h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary truncate text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-text-tertiary truncate text-xs">Total Users</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-green/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
              <BookOpen className="text-accent-green h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary truncate text-2xl font-bold">{stats.totalCourses}</p>
              <p className="text-text-tertiary truncate text-xs">Total Courses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-amber/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
              <GraduationCap className="text-accent-amber h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary truncate text-2xl font-bold">
                {stats.activeEnrollments}
              </p>
              <p className="text-text-tertiary truncate text-xs">Active Enrollments</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-purple/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
              <Award className="text-accent-purple h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary truncate text-2xl font-bold">
                {stats.certificatesIssued}
              </p>
              <p className="text-text-tertiary truncate text-xs">Certificates Issued</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enrollments per Course */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-accent-blue h-5 w-5" />
              Enrollments per Course
            </CardTitle>
            <CardDescription>Top courses by enrollment count</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={analytics.enrollmentsPerCourse.slice(0, 8).map((e) => ({
                label:
                  e.courseName.length > 30 ? e.courseName.substring(0, 27) + "..." : e.courseName,
                value: e.count,
                color: "bg-accent-blue",
              }))}
            />
          </CardContent>
        </Card>

        {/* Pass/Fail Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-accent-green h-5 w-5" />
              Test Pass/Fail Rates
            </CardTitle>
            <CardDescription>
              <span className="mr-3 inline-flex items-center gap-1">
                <span className="bg-accent-green h-2 w-2 rounded-full" /> Passed
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="bg-accent-red h-2 w-2 rounded-full" /> Failed
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PassFailChart
              data={analytics.passFailRates.slice(0, 6).map((r) => ({
                label:
                  r.courseName.length > 30 ? r.courseName.substring(0, 27) + "..." : r.courseName,
                passed: r.passed,
                failed: r.failed,
              }))}
            />
          </CardContent>
        </Card>

        {/* Student Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-accent-amber h-5 w-5" />
              Student Activity
            </CardTitle>
            <CardDescription>Active vs inactive (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Active</span>
              <span className="text-accent-green text-sm font-semibold">
                {analytics.studentActivity.active}
              </span>
            </div>
            <Progress
              value={(analytics.studentActivity.active / analytics.studentActivity.total) * 100}
              className="h-3"
            />
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Inactive</span>
              <span className="text-accent-red text-sm font-semibold">
                {analytics.studentActivity.inactive}
              </span>
            </div>
            <div className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-xl border p-3">
              <span className="text-text-secondary text-sm">Total Students</span>
              <span className="text-text-primary font-bold">{analytics.studentActivity.total}</span>
            </div>

            {/* Monthly Enrollments Mini */}
            <div className="pt-2">
              <p className="text-text-secondary mb-2 text-xs font-medium">
                Monthly Enrollments (6 Mo)
              </p>
              <MiniBar
                data={analytics.monthlyEnrollments.map((m) => ({
                  label: m.month,
                  value: m.count,
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructor Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="text-accent-purple h-5 w-5" />
              Instructor Performance
            </CardTitle>
            <CardDescription>Courses assigned & average pass rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.instructorPerformance.map((inst) => (
                <div
                  key={inst.instructorId}
                  className="border-border-default flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-medium">
                      {inst.instructorName}
                    </p>
                    <p className="text-text-tertiary text-xs">
                      {inst.coursesAssigned} course
                      {inst.coursesAssigned !== 1 ? "s" : ""} assigned
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      inst.avgPassRate >= 80
                        ? "border-accent-green text-accent-green"
                        : inst.avgPassRate >= 60
                          ? "border-accent-amber text-accent-amber"
                          : "border-accent-red text-accent-red"
                    }
                  >
                    {inst.avgPassRate}% pass
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="text-accent-blue h-5 w-5" />
            Course Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {analytics.categoryDistribution.map((cat) => (
              <div
                key={cat.category}
                className="border-border-default bg-bg-tertiary flex items-center gap-2 rounded-2xl border px-4 py-2"
              >
                <span className="text-text-secondary text-sm">{cat.category}</span>
                <Badge>{cat.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
