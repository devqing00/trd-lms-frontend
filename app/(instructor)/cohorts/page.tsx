"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Calendar, Search, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { useInstructorCohorts } from "@/lib/hooks/use-queries";

const STATUS_BADGE: Record<string, "success" | "info" | "warning" | "error" | "default"> = {
  scheduled: "info",
  "in-progress": "success",
  completed: "default",
  cancelled: "error",
};

export default function InstructorCohortsPage() {
  const { data: cohorts = [], isLoading } = useInstructorCohorts();
  const [search, setSearch] = useState("");

  const filtered = search
    ? cohorts.filter(
        (c) =>
          c.courseName.toLowerCase().includes(search.toLowerCase()) ||
          c.instructorName.toLowerCase().includes(search.toLowerCase())
      )
    : cohorts;

  const active = filtered.filter((c) => c.status !== "completed" && c.status !== "cancelled");
  const past = filtered.filter((c) => c.status === "completed" || c.status === "cancelled");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          My Cohorts
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your assigned course cohorts and track progress.
        </p>
      </div>

      {/* Search */}
      {cohorts.length > 0 && (
        <div className="relative max-w-md">
          <Search
            size={18}
            className="text-text-tertiary absolute top-1/2 left-4 -translate-y-1/2"
          />
          <Input
            placeholder="Search cohorts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div role="status" aria-label="Loading cohorts">
            <div className="border-accent-green h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            <span className="sr-only">Loading cohorts…</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No cohorts found"
          description={
            cohorts.length === 0
              ? "You haven't been assigned to any cohorts yet."
              : "No cohorts match your search."
          }
        />
      ) : (
        <div className="space-y-8">
          {/* Active Cohorts */}
          {active.length > 0 && (
            <section>
              <h2 className="font-display text-text-primary mb-4 text-lg font-bold">
                Active Cohorts ({active.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((cohort) => (
                  <Card key={cohort.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant={STATUS_BADGE[cohort.status] ?? "default"}>
                          {cohort.status}
                        </Badge>
                        <span className="text-text-tertiary text-xs">
                          {cohort.enrolledCount}/{cohort.capacity}
                        </span>
                      </div>
                      <CardTitle className="mt-2 line-clamp-2 text-base">
                        {cohort.courseName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar size={14} className="shrink-0" />
                        {new Date(cohort.startDate).toLocaleDateString()} –{" "}
                        {new Date(cohort.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-secondary">Capacity</span>
                          <span className="text-text-primary font-medium">
                            {Math.round((cohort.enrolledCount / cohort.capacity) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(cohort.enrolledCount / cohort.capacity) * 100}
                          className="h-2"
                        />
                      </div>
                      <Link href={`/instructor/attendance?courseId=${cohort.courseId}`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Take Attendance <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Past Cohorts */}
          {past.length > 0 && (
            <section>
              <h2 className="font-display text-text-primary mb-4 text-lg font-bold">
                Past Cohorts ({past.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((cohort) => (
                  <Card key={cohort.id} className="opacity-75">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant={STATUS_BADGE[cohort.status] ?? "default"}>
                          {cohort.status}
                        </Badge>
                        <span className="text-text-tertiary text-xs">
                          {cohort.enrolledCount}/{cohort.capacity}
                        </span>
                      </div>
                      <CardTitle className="mt-2 line-clamp-2 text-base">
                        {cohort.courseName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar size={14} className="shrink-0" />
                        {new Date(cohort.startDate).toLocaleDateString()} –{" "}
                        {new Date(cohort.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
