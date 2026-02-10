"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Filter,
  BookOpen,
  LayoutGrid,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchPublishedCourses, fetchStudentEnrollments } from "@/lib/mock-data";
import type { Course, Enrollment } from "@/lib/types";

/** Format Naira */
function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
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

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function load() {
      const [crs, enr] = await Promise.all([fetchPublishedCourses(), fetchStudentEnrollments()]);
      setCourses(crs);
      setEnrollments(enr);
      setLoading(false);
    }
    void load();
  }, []);

  const filtered = useMemo(() => {
    let result = courses;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s) ||
          c.category.toLowerCase().includes(s)
      );
    }
    if (category !== "all") {
      result = result.filter((c) => c.category === category);
    }
    return result;
  }, [courses, search, category]);

  // Group courses by category for better discoverability
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach((c) => {
      counts[c.category] = (counts[c.category] ?? 0) + 1;
    });
    return counts;
  }, [courses]);

  function getEnrollmentStatus(courseId: string) {
    const enrollment = enrollments.find((e) => e.courseId === courseId);
    return enrollment?.status ?? null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading courses">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading courses…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Course Catalog
        </h1>
        <p className="text-text-secondary mt-1">
          Browse {courses.length} available training programs and enroll.
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-colors ${
            category === "all"
              ? "border-accent-blue bg-accent-blue text-white"
              : "border-border-default bg-bg-secondary text-text-secondary hover:border-text-tertiary"
          }`}
        >
          All ({courses.length})
        </button>
        {CATEGORIES.filter((cat) => categoryCounts[cat]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === category ? "all" : cat)}
            className={`rounded-full border-2 px-3 py-1 text-xs font-medium transition-colors ${
              category === cat
                ? "border-accent-blue bg-accent-blue text-white"
                : "border-border-default bg-bg-secondary text-text-secondary hover:border-text-tertiary"
            }`}
          >
            {cat} ({categoryCounts[cat]})
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="text-text-tertiary absolute top-1/2 left-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            placeholder="Search courses by title, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
            aria-label="Search courses"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter size={16} className="text-text-tertiary mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="border-border-default hidden items-center gap-1 rounded-xl border-2 p-0.5 sm:flex">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-bg-tertiary text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-bg-tertiary text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-text-tertiary text-sm">
        {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
        {category !== "all" && ` in ${category}`}
      </p>

      {/* Course Display */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <Search size={40} className="text-text-tertiary mx-auto mb-3 opacity-40" />
          <p className="text-text-primary font-medium">No courses found</p>
          <p className="text-text-secondary mt-1 text-sm">
            Try adjusting your search or category filter.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
          >
            Clear filters
          </Button>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const status = getEnrollmentStatus(course.id);
            const seatsLeft = Math.max(0, course.capacity - course.enrolledCount);
            const isFull = seatsLeft === 0;
            const fillPercent =
              course.capacity > 0 ? Math.round((course.enrolledCount / course.capacity) * 100) : 0;

            return (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="hover:shadow-hard-card-lg flex h-full flex-col transition-all duration-200 hover:-translate-y-[2px]">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Badge>{course.category}</Badge>
                      {status && (
                        <Badge
                          variant="outline"
                          className={
                            status === "enrolled"
                              ? "border-accent-green text-accent-green"
                              : status === "completed"
                                ? "border-accent-blue text-accent-blue"
                                : "border-accent-amber text-accent-amber"
                          }
                        >
                          {status === "enrolled"
                            ? "Enrolled"
                            : status === "completed"
                              ? "Completed"
                              : status === "waitlisted"
                                ? "Waitlisted"
                                : status}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2 line-clamp-2 text-base">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto space-y-3">
                    {/* Pricing */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-accent-blue text-lg font-bold">
                        {formatNaira(course.pricing.fee)}
                      </span>
                      {course.pricing.specialFee && (
                        <span className="text-text-tertiary text-xs">
                          Special: {formatNaira(course.pricing.specialFee)}
                        </span>
                      )}
                    </div>

                    {/* Topics */}
                    {course.topics && course.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {course.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="bg-bg-tertiary text-text-tertiary rounded-md px-1.5 py-0.5 text-[10px]"
                          >
                            {topic}
                          </span>
                        ))}
                        {course.topics.length > 3 && (
                          <span className="text-text-tertiary text-[10px]">
                            +{course.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-text-tertiary flex flex-wrap gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {course.duration}
                      </span>
                      <span className="flex max-w-full min-w-0 items-center gap-1">
                        <MapPin size={14} className="shrink-0" />
                        <span className="truncate">{course.venue.room}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {course.modules.length} modules
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-text-tertiary flex items-center gap-1 text-xs">
                          <Users size={14} />
                          {course.enrolledCount}/{course.capacity} seats
                        </span>
                        {isFull ? (
                          <Badge
                            variant="outline"
                            className="border-accent-red text-accent-red text-xs"
                          >
                            Full
                          </Badge>
                        ) : (
                          <span className="text-accent-green text-xs font-medium">
                            {seatsLeft} seats left
                          </span>
                        )}
                      </div>
                      <Progress value={fillPercent} className="h-1.5" />
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button variant="ghost" size="sm" className="ml-auto">
                      View Details <ChevronRight size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filtered.map((course) => {
            const status = getEnrollmentStatus(course.id);
            const seatsLeft = Math.max(0, course.capacity - course.enrolledCount);
            const isFull = seatsLeft === 0;

            return (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="hover:shadow-hard-card-lg flex items-center gap-4 p-4 transition-all duration-200 hover:-translate-y-[1px]">
                  <div className="border-border-default bg-bg-tertiary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2">
                    <BookOpen className="text-accent-blue h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-text-primary truncate font-medium">{course.title}</p>
                      <span className="text-accent-blue text-sm font-bold">
                        {formatNaira(course.pricing.fee)}
                      </span>
                      {status && (
                        <Badge
                          variant="outline"
                          className={
                            status === "enrolled"
                              ? "border-accent-green text-accent-green"
                              : status === "completed"
                                ? "border-accent-blue text-accent-blue"
                                : "border-accent-amber text-accent-amber"
                          }
                        >
                          {status}
                        </Badge>
                      )}
                    </div>
                    <div className="text-text-tertiary mt-1 flex flex-wrap gap-3 text-xs">
                      <Badge variant="default" className="text-xs">
                        {course.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {course.enrolledCount}/{course.capacity}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {course.modules.length} modules
                      </span>
                    </div>
                  </div>
                  <div className="hidden shrink-0 items-center gap-2 sm:flex">
                    {isFull ? (
                      <Badge
                        variant="outline"
                        className="border-accent-red text-accent-red text-xs"
                      >
                        Full
                      </Badge>
                    ) : (
                      <span className="text-accent-green text-xs font-medium">
                        {seatsLeft} left
                      </span>
                    )}
                    <ChevronRight size={16} className="text-text-tertiary" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
