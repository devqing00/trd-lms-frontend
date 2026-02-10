"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, MapPin, Users, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input, InputWithLabel } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateCourse } from "@/lib/hooks/use-queries";
import { toast } from "sonner";
import type { CourseStatus } from "@/lib/types";

const CATEGORIES = [
  "ICT & Digital Literacy",
  "Research & Academic Writing",
  "Health & Safety",
  "Leadership & Management",
  "Laboratory & Technical Skills",
  "Data & Analytics",
  "Professional Development",
];

const DURATIONS = ["1 Day", "2 Days", "3 Days", "5 Days", "1 Week", "2 Weeks"];

export default function NewCoursePage() {
  const router = useRouter();
  const createCourse = useCreateCourse();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    venueAddress: "",
    venueRoom: "",
    capacity: 20,
    waitlistCap: 10,
    status: "draft" as CourseStatus,
    hasPrerequisiteTest: false,
    hasPostCourseTest: false,
  });

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    createCourse.mutate(
      {
        title: form.title,
        description: form.description,
        category: form.category,
        duration: form.duration,
        venue: {
          address: form.venueAddress,
          room: form.venueRoom,
        },
        capacity: form.capacity,
        waitlistCap: form.waitlistCap,
        instructorIds: [],
        status: form.status,
        prerequisiteTestId: form.hasPrerequisiteTest ? "test_placeholder" : undefined,
        postCourseTestId: form.hasPostCourseTest ? "posttest_placeholder" : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Course created successfully");
          router.push("/admin/courses");
        },
      }
    );
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
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Create Course
          </h1>
          <p className="text-text-secondary mt-1">
            Set up a new training course with venue and capacity details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info - Takes 2 columns */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
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
              </CardContent>
            </Card>

            {/* Venue */}
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

          {/* Sidebar - Settings */}
          <div className="space-y-6">
            {/* Capacity */}
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
                  <p className="text-text-tertiary text-xs">
                    Max students on waitlist (0 = no waitlist)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status & Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
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
                    aria-label="Require prerequisite test before enrollment"
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
                    aria-label="Require final assessment for certification"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isValid || createCourse.isPending}
                className="w-full"
              >
                <Save className="h-4 w-4" />
                {createCourse.isPending ? "Creating..." : "Create Course"}
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
    </div>
  );
}
