"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getCurrentStudent,
  fetchStudentEnrollments,
  fetchStudentCertificates,
  fetchPublishedCourses,
} from "@/lib/mock-data";
import type { Enrollment, Certificate, Course } from "@/lib/types";

export default function StudentDashboardPage() {
  const student = getCurrentStudent();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [enr, cert, crs] = await Promise.all([
        fetchStudentEnrollments(),
        fetchStudentCertificates(),
        fetchPublishedCourses(),
      ]);
      setEnrollments(enr);
      setCertificates(cert);
      setCourses(crs);
      setLoading(false);
    }
    void load();
  }, []);

  const [now] = useState(() => Date.now());
  const activeEnrollments = enrollments.filter((e) => e.status === "enrolled");
  const completedEnrollments = enrollments.filter((e) => e.status === "completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading dashboard">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {student.name.split(" ")[0]}
        </h1>
        <p className="text-text-secondary mt-1">
          Here&apos;s an overview of your learning progress.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-blue/10 text-accent-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <BookOpen size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary text-2xl font-bold">{activeEnrollments.length}</p>
              <p className="text-text-tertiary text-xs">Active Courses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-green/10 text-accent-green flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <GraduationCap size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary text-2xl font-bold">{completedEnrollments.length}</p>
              <p className="text-text-tertiary text-xs">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-amber/10 text-accent-amber flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Award size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary text-2xl font-bold">{certificates.length}</p>
              <p className="text-text-tertiary text-xs">Certificates</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-bg-tertiary text-text-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <TrendingUp size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-text-primary text-2xl font-bold">{courses.length}</p>
              <p className="text-text-tertiary text-xs">Available</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-text-primary text-xl font-bold">My Courses</h2>
          <Link href="/courses">
            <Button variant="ghost" size="sm">
              View All <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {activeEnrollments.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen size={40} className="text-text-tertiary mx-auto mb-3 opacity-40" />
            <p className="text-text-secondary">
              No active courses yet.{" "}
              <Link href="/courses" className="text-accent-blue font-semibold hover:underline">
                Browse catalog
              </Link>
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeEnrollments.slice(0, 3).map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId);
              // Derive progress from enrollment timing — deterministic per enrollment
              const enrolledTime = enrollment.enrolledAt
                ? now - new Date(enrollment.enrolledAt).getTime()
                : 0;
              const daysSinceEnrolled = Math.floor(enrolledTime / (1000 * 60 * 60 * 24));
              const totalModules = course?.modules.length ?? 3;
              const completedModules = Math.min(Math.floor(daysSinceEnrolled / 2), totalModules);
              const progress =
                totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
              return (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Badge>{course?.category ?? "Course"}</Badge>
                      <Badge variant="outline" className="text-accent-green border-accent-green">
                        Enrolled
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 line-clamp-2">{enrollment.courseName}</CardTitle>
                    <CardDescription className="truncate">
                      {course?.duration ?? "—"} &bull; {course?.venue.address.split(",")[0] ?? "—"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Progress</span>
                        <span className="text-text-primary font-semibold">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/courses/${enrollment.courseId}`} className="w-full">
                      <Button variant="ghost" size="sm" className="w-full">
                        Continue Learning <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Certificates */}
      {certificates.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-text-primary text-xl font-bold">
              Recent Certificates
            </h2>
            <Link href="/certificates">
              <Button variant="ghost" size="sm">
                View All <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.slice(0, 2).map((cert) => (
              <Card key={cert.id} className="flex items-center gap-4 p-4">
                <div className="bg-accent-amber/10 text-accent-amber flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                  <Award size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary truncate font-semibold">{cert.courseName}</p>
                  <p className="text-text-tertiary text-sm">
                    Issued {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "—"}
                  </p>
                </div>
                <Badge variant="outline" className="border-accent-green text-accent-green shrink-0">
                  {cert.status}
                </Badge>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="font-display text-text-primary mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link href="/courses">
            <Card className="hover:shadow-hard-card-lg cursor-pointer p-4 text-center transition-all hover:-translate-y-[2px]">
              <BookOpen size={24} className="text-accent-blue mx-auto mb-2" aria-hidden="true" />
              <p className="text-text-primary text-sm font-medium">Browse Courses</p>
            </Card>
          </Link>
          <Link href="/certificates">
            <Card className="hover:shadow-hard-card-lg cursor-pointer p-4 text-center transition-all hover:-translate-y-[2px]">
              <Award size={24} className="text-accent-amber mx-auto mb-2" aria-hidden="true" />
              <p className="text-text-primary text-sm font-medium">My Certificates</p>
            </Card>
          </Link>
          <Link href="/profile">
            <Card className="hover:shadow-hard-card-lg cursor-pointer p-4 text-center transition-all hover:-translate-y-[2px]">
              <Calendar size={24} className="text-accent-green mx-auto mb-2" aria-hidden="true" />
              <p className="text-text-primary text-sm font-medium">My Profile</p>
            </Card>
          </Link>
          <Link href="/courses">
            <Card className="hover:shadow-hard-card-lg cursor-pointer p-4 text-center transition-all hover:-translate-y-[2px]">
              <Clock size={24} className="text-text-secondary mx-auto mb-2" aria-hidden="true" />
              <p className="text-text-primary text-sm font-medium">Schedule</p>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
