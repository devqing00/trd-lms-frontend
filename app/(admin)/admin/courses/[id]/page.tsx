"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Users,
  MapPin,
  Clock,
  BookOpen,
  FileText,
  Video,
  Presentation,
  Globe,
  Archive,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCourse, useUpdateCourse, useDeleteCourse } from "@/lib/hooks/use-queries";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CourseStatus, ContentItem } from "@/lib/types";

const STATUS_BADGE: Record<CourseStatus, "success" | "warning" | "default"> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

const CONTENT_ICON: Record<ContentItem["type"], typeof FileText> = {
  pdf: FileText,
  video: Video,
  slides: Presentation,
  text: BookOpen,
};

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: course, isLoading } = useCourse(id);
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleDelete() {
    deleteCourse.mutate(id, {
      onSuccess: () => {
        toast.success("Course deleted");
        router.push("/admin/courses");
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-secondary">Course not found.</p>
        <Link
          href="/admin/courses"
          className="text-text-secondary hover:text-text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </Link>
      </div>
    );
  }

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const fillPercent =
    course.capacity > 0 ? Math.round((course.enrolledCount / course.capacity) * 100) : 0;

  const instructorNames =
    course.instructorIds.length > 0
      ? `${course.instructorIds.length} instructor(s) assigned`
      : "No instructors assigned";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/courses"
            className="text-text-secondary hover:text-text-primary mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
            aria-label="Back to courses"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
                {course.title}
              </h1>
              <Badge variant={STATUS_BADGE[course.status]}>{course.status}</Badge>
            </div>
            <p className="text-text-secondary mt-1 max-w-2xl">{course.description}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {course.status === "draft" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                updateCourse.mutate(
                  { id: course.id, status: "published" },
                  { onSuccess: () => toast.success("Course published") }
                )
              }
            >
              <Globe className="h-4 w-4" />
              Publish
            </Button>
          )}
          {course.status === "published" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateCourse.mutate(
                  { id: course.id, status: "archived" },
                  { onSuccess: () => toast.success("Course archived") }
                )
              }
            >
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          )}
          <Link href={`/admin/courses/${course.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-accent-red hover:text-accent-red"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <Users className="text-accent-blue h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Enrollment</p>
              <p className="text-text-primary text-lg font-bold">
                {course.enrolledCount}{" "}
                <span className="text-text-tertiary text-sm font-normal">/ {course.capacity}</span>
              </p>
            </div>
          </div>
          <Progress value={fillPercent} className="mt-3 h-1.5" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <Clock className="text-accent-amber h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Duration</p>
              <p className="text-text-primary text-lg font-bold">{course.duration}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <MapPin className="text-accent-green h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Venue</p>
              <p className="text-text-primary text-sm font-medium">{course.venue.room}</p>
              <p className="text-text-tertiary text-xs">{course.venue.address}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <BookOpen className="text-accent-purple h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Modules</p>
              <p className="text-text-primary text-lg font-bold">{course.modules.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Details Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Modules */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-display text-text-primary text-lg font-bold">Course Modules</h2>
          {course.modules.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="text-text-tertiary mx-auto mb-3 h-10 w-10 opacity-40" />
              <p className="text-text-secondary">
                No modules added yet. Edit the course to add content.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {course.modules
                .sort((a, b) => a.order - b.order)
                .map((mod) => (
                  <Card key={mod.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{mod.title}</CardTitle>
                      <CardDescription>
                        {mod.contentItems.length} content item
                        {mod.contentItems.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4">
                      {mod.contentItems.map((item) => {
                        const Icon = CONTENT_ICON[item.type] ?? FileText;
                        return (
                          <div
                            key={item.id}
                            className="border-border-default bg-bg-tertiary flex items-center gap-3 rounded-xl border-2 p-3"
                          >
                            <Icon className="text-text-tertiary h-4 w-4 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-text-primary truncate text-sm font-medium">
                                {item.title}
                              </p>
                              <p className="text-text-tertiary text-xs capitalize">{item.type}</p>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                  Category
                </p>
                <Badge className="mt-1">{course.category}</Badge>
              </div>

              <Separator />

              <div>
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                  Instructors
                </p>
                <p className="text-text-primary mt-1 text-sm">{instructorNames}</p>
              </div>

              <Separator />

              <div>
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                  Waitlist
                </p>
                <p className="text-text-primary mt-1 text-sm">
                  {course.waitlistCount} waiting (cap: {course.waitlistCap})
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                  Assessments
                </p>
                <div className="mt-1 space-y-1">
                  <p className="text-text-primary flex items-center gap-2 text-sm">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        course.prerequisiteTestId ? "bg-accent-green" : "bg-border-default"
                      }`}
                    />
                    Prerequisite Test
                  </p>
                  <p className="text-text-primary flex items-center gap-2 text-sm">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        course.postCourseTestId ? "bg-accent-green" : "bg-border-default"
                      }`}
                    />
                    Post-Course Assessment
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                  Created
                </p>
                <p className="text-text-primary mt-1 text-sm">
                  {new Date(course.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing & Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                  Standard Fee
                </p>
                <p className="text-accent-blue mt-1 text-lg font-bold">
                  {formatNaira(course.pricing.fee)}
                </p>
              </div>
              {course.pricing.specialFee && (
                <>
                  <Separator />
                  <div>
                    <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                      Special Class Fee
                    </p>
                    <p className="text-accent-purple mt-1 text-sm font-medium">
                      {formatNaira(course.pricing.specialFee)}
                    </p>
                    <p className="text-text-tertiary text-xs">For groups of 3–5 students</p>
                  </div>
                </>
              )}
              {course.pricing.cohortFee && (
                <>
                  <Separator />
                  <div>
                    <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                      Cohort Fee
                    </p>
                    <p className="text-accent-green mt-1 text-sm font-medium">
                      {formatNaira(course.pricing.cohortFee)}
                    </p>
                  </div>
                </>
              )}
              {course.topics && course.topics.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">
                      Topics
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {course.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="border-border-default text-text-primary hover:bg-bg-tertiary flex items-center justify-between rounded-xl border-2 p-3 text-sm font-medium transition-colors"
              >
                Edit Course
                <ChevronRight className="text-text-tertiary h-4 w-4" />
              </Link>
              <Link
                href="/admin/enrollments"
                className="border-border-default text-text-primary hover:bg-bg-tertiary flex items-center justify-between rounded-xl border-2 p-3 text-sm font-medium transition-colors"
              >
                View Enrollments
                <ChevronRight className="text-text-tertiary h-4 w-4" />
              </Link>
              <Link
                href="/admin/waitlist"
                className="border-border-default text-text-primary hover:bg-bg-tertiary flex items-center justify-between rounded-xl border-2 p-3 text-sm font-medium transition-colors"
              >
                Manage Waitlist
                <ChevronRight className="text-text-tertiary h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{course.title}</strong>? This will remove all
              associated enrollments, waitlist entries, and test data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCourse.isPending}>
              {deleteCourse.isPending ? "Deleting…" : "Delete Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
