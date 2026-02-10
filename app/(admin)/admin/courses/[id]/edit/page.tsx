"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Users,
  Clock,
  Save,
  Trash2,
  Banknote,
  Tag,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { useCourse, useUpdateCourse, useDeleteCourse } from "@/lib/hooks/use-queries";
import type { CourseStatus } from "@/lib/types";

function InputWithLabel({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id ?? label}>{label}</Label>
      <Input id={props.id ?? label} {...props} />
    </div>
  );
}

const CATEGORIES = [
  "ICT & Digital Literacy",
  "Research & Academic Writing",
  "Health & Safety",
  "Leadership & Management",
  "Laboratory & Technical Skills",
  "Data & Analytics",
  "Professional Development",
];

const DURATIONS = [
  "1 Day",
  "2 Days",
  "3 Days",
  "5 Days",
  "1 Week",
  "2 Weeks",
  "4 Weeks",
  "5 Weeks",
  "8 Weeks",
  "1 month",
  "2 months",
  "3 months",
  "4 months",
];

export default function CourseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: course, isLoading } = useCourse(id);

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return <CourseEditForm course={course} courseId={id} />;
}

function CourseEditForm({
  course,
  courseId: id,
}: {
  course: NonNullable<ReturnType<typeof useCourse>["data"]>;
  courseId: string;
}) {
  const router = useRouter();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    duration: course.duration,
    venueAddress: course.venue.address,
    venueRoom: course.venue.room,
    capacity: course.capacity,
    waitlistCap: course.waitlistCap,
    fee: course.pricing.fee,
    cohortFee: course.pricing.cohortFee ?? 0,
    specialFee: course.pricing.specialFee ?? 0,
    topicsText: (course.topics ?? []).join(", "),
    status: course.status,
    hasPrerequisiteTest: !!course.prerequisiteTestId,
    hasPostCourseTest: !!course.postCourseTestId,
  });

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateCourse.mutate(
      {
        id,
        title: form.title,
        description: form.description,
        category: form.category,
        duration: form.duration,
        pricing: {
          fee: form.fee,
          cohortFee: form.cohortFee || undefined,
          specialFee: form.specialFee || undefined,
        },
        topics: form.topicsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        venue: {
          address: form.venueAddress,
          room: form.venueRoom,
        },
        capacity: form.capacity,
        waitlistCap: form.waitlistCap,
        status: form.status,
        prerequisiteTestId: form.hasPrerequisiteTest ? "test_placeholder" : undefined,
        postCourseTestId: form.hasPostCourseTest ? "posttest_placeholder" : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Course updated successfully");
          router.push("/admin/courses");
        },
      }
    );
  }

  function handleDelete() {
    deleteCourse.mutate(id, {
      onSuccess: () => {
        toast.success("Course deleted");
        router.push("/admin/courses");
      },
    });
  }

  const isValid =
    form.title.trim() !== "" && form.category !== "" && form.duration !== "" && form.capacity > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="text-text-secondary hover:text-text-primary inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
          aria-label="Back to courses"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
              Edit Course
            </h1>
            <Badge variant="outline">{course.status}</Badge>
          </div>
          <p className="text-text-secondary mt-1">
            {course.enrolledCount} enrolled &middot; {course.waitlistCount} waitlisted
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-accent-red h-10 w-10"
          onClick={() => setDeleteDialogOpen(true)}
          aria-label="Delete course"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="text-accent-blue h-5 w-5" />
                  Course Information
                </CardTitle>
                <CardDescription>Basic details about the course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputWithLabel
                  label="Course Title"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. ICT Proficiency Certification"
                />
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Comprehensive overview of the training program..."
                    rows={4}
                    className="border-border-default bg-bg-primary focus:border-accent-blue rounded-2xl border-2"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select value={form.duration} onValueChange={(v) => updateField("duration", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATIONS.map((dur) => (
                          <SelectItem key={dur} value={dur}>
                            <span className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {dur}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topics" className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Topics
                  </Label>
                  <Input
                    id="topics"
                    value={form.topicsText}
                    onChange={(e) => updateField("topicsText", e.target.value)}
                    placeholder="e.g. Python, Web Development, Machine Learning"
                  />
                  <p className="text-text-tertiary text-xs">Comma-separated list of key topics</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-accent-green h-5 w-5" />
                  Venue Details
                </CardTitle>
                <CardDescription>Physical location for the training</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputWithLabel
                  label="Address"
                  value={form.venueAddress}
                  onChange={(e) => updateField("venueAddress", e.target.value)}
                  placeholder="123 Training Blvd, Suite 100"
                />
                <InputWithLabel
                  label="Room"
                  value={form.venueRoom}
                  onChange={(e) => updateField("venueRoom", e.target.value)}
                  placeholder="Room A1"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="text-accent-green h-5 w-5" />
                  Pricing (₦)
                </CardTitle>
                <CardDescription>Course fees in Naira</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fee">Standard Fee</Label>
                  <Input
                    id="fee"
                    type="number"
                    min={0}
                    step={1000}
                    value={form.fee}
                    onChange={(e) => updateField("fee", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cohortFee">Cohort Fee</Label>
                  <Input
                    id="cohortFee"
                    type="number"
                    min={0}
                    step={1000}
                    value={form.cohortFee}
                    onChange={(e) => updateField("cohortFee", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-text-tertiary text-xs">Leave 0 if not applicable</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialFee">Special Class Fee</Label>
                  <Input
                    id="specialFee"
                    type="number"
                    min={0}
                    step={1000}
                    value={form.specialFee}
                    onChange={(e) => updateField("specialFee", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-text-tertiary text-xs">For groups of 3–5 students</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="text-accent-purple h-5 w-5" />
                  Capacity & Waitlist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Max Seats</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    max={500}
                    value={form.capacity}
                    onChange={(e) => updateField("capacity", parseInt(e.target.value) || 0)}
                  />
                  <p className="text-text-tertiary text-xs">Maximum number of students</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waitlist">Waitlist Cap</Label>
                  <Input
                    id="waitlist"
                    type="number"
                    min={0}
                    max={100}
                    value={form.waitlistCap}
                    onChange={(e) => updateField("waitlistCap", parseInt(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing & Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => updateField("status", v as CourseStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-2xl border-2 p-3">
                  <div>
                    <p className="text-text-primary text-sm font-medium">Prerequisite Test</p>
                    <p className="text-text-tertiary text-xs">Require test before enrollment</p>
                  </div>
                  <Switch
                    checked={form.hasPrerequisiteTest}
                    onCheckedChange={(v) => updateField("hasPrerequisiteTest", v)}
                  />
                </div>
                <div className="border-border-default bg-bg-tertiary flex items-center justify-between rounded-2xl border-2 p-3">
                  <div>
                    <p className="text-text-primary text-sm font-medium">Final Assessment</p>
                    <p className="text-text-tertiary text-xs">
                      End-of-course test for certification
                    </p>
                  </div>
                  <Switch
                    checked={form.hasPostCourseTest}
                    onCheckedChange={(v) => updateField("hasPostCourseTest", v)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isValid || updateCourse.isPending}
                className="w-full"
              >
                <Save className="h-4 w-4" />
                {updateCourse.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/admin/courses" className="w-full">
                <Button type="button" variant="ghost" size="lg" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{course.title}&rdquo;? This action cannot be
              undone. All associated enrollments, waitlist entries, and test data will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-accent-red hover:bg-accent-red/90"
              onClick={handleDelete}
              disabled={deleteCourse.isPending}
            >
              {deleteCourse.isPending ? "Deleting..." : "Delete Course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
