"use client";

import {
  Users,
  BookOpen,
  GraduationCap,
  ListOrdered,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDashboardStats } from "@/lib/hooks/use-queries";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
  accent = "blue",
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  href?: string;
  accent?: "blue" | "green" | "amber" | "purple" | "red";
}) {
  const accentColors = {
    blue: "bg-accent-blue/10 text-accent-blue",
    green: "bg-accent-green/10 text-accent-green",
    amber: "bg-accent-amber/10 text-accent-amber",
    purple: "bg-accent-purple/10 text-accent-purple",
    red: "bg-accent-red/10 text-accent-red",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${accentColors[accent]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">{value}</CardTitle>
      </CardHeader>
      {(description || href) && (
        <CardFooter className="pt-0">
          {description && (
            <p className="text-text-tertiary min-w-0 truncate text-xs">{description}</p>
          )}
          {href && (
            <Link
              href={href}
              className="text-accent-blue ml-auto shrink-0 text-xs font-medium hover:underline"
            >
              View all →
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-1">System overview and key metrics</p>
        </div>
        <div className="flex items-center">
          <Badge variant="info" className="hidden md:flex">
            <TrendingUp className="mr-1 h-3 w-3" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          description={`${stats.usersByRole.admin} admins · ${stats.usersByRole.instructor} instructors · ${stats.usersByRole.student} students`}
          href="/admin/users"
          accent="blue"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          description={`${stats.coursesByStatus.published} published · ${stats.coursesByStatus.draft} drafts`}
          href="/admin/courses"
          accent="purple"
        />
        <StatCard
          title="Active Enrollments"
          value={stats.activeEnrollments}
          icon={GraduationCap}
          href="/admin/enrollments"
          accent="green"
        />
        <StatCard
          title="Waitlisted"
          value={stats.waitlistTotal}
          icon={ListOrdered}
          href="/admin/waitlist"
          accent="amber"
        />
        <StatCard
          title="Certificates Issued"
          value={stats.certificatesIssued}
          icon={Award}
          accent="blue"
        />
      </div>

      {/* Recent Enrollments + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Enrollments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest enrollment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-2xl border-2 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary truncate text-sm font-medium">
                      {enrollment.userName}
                    </p>
                    <p className="text-text-secondary truncate text-xs">{enrollment.courseName}</p>
                  </div>
                  <Badge
                    variant={
                      enrollment.status === "enrolled"
                        ? "info"
                        : enrollment.status === "completed"
                          ? "success"
                          : enrollment.status === "waitlisted"
                            ? "warning"
                            : "default"
                    }
                  >
                    {enrollment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/enrollments" className="w-full">
              <Button variant="ghost" size="sm" className="w-full">
                View all enrollments
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/users" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/courses/new" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <BookOpen className="h-4 w-4" />
                Create Course
              </Button>
            </Link>
            <Link href="/admin/waitlist" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                <ListOrdered className="h-4 w-4" />
                Review Waitlist
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
