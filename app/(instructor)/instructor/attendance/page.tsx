"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ScanLine,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Keyboard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useInstructorCourses,
  useAttendance,
  useMarkAttendance,
  useInstructorEnrollments,
} from "@/lib/hooks/use-queries";

const STATUS_CONFIG: Record<
  string,
  { icon: React.ReactNode; variant: "success" | "error" | "warning" }
> = {
  present: {
    icon: <CheckCircle className="h-4 w-4" />,
    variant: "success",
  },
  absent: {
    icon: <XCircle className="h-4 w-4" />,
    variant: "error",
  },
  excused: {
    icon: <AlertCircle className="h-4 w-4" />,
    variant: "warning",
  },
};

export default function InstructorAttendancePage() {
  return (
    <Suspense>
      <AttendanceContent />
    </Suspense>
  );
}

function AttendanceContent() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get("courseId") ?? "all";
  const [courseFilter, setCourseFilter] = useState(initialCourse);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]!);
  const [scanMode, setScanMode] = useState<"camera" | "manual" | null>(null);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [manualStudentId, setManualStudentId] = useState("");
  const [manualStatus, setManualStatus] = useState<"present" | "absent" | "excused">("present");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const { data: courses = [] } = useInstructorCourses();
  const { data: attendanceData, isLoading } = useAttendance({
    courseId: courseFilter !== "all" ? courseFilter : undefined,
    date: dateFilter,
    search: "",
    page: 1,
    pageSize: 100,
  });
  const { data: enrollments = [] } = useInstructorEnrollments(
    courseFilter !== "all" ? courseFilter : undefined
  );
  const markAttendance = useMarkAttendance();

  const attendance = attendanceData?.data ?? [];

  // Simulated QR scanning (in production, use html5-qrcode)
  function handleQrScan() {
    // Simulate a scan result after 2 seconds
    setScanError(null);
    setScanResult(null);
    setTimeout(() => {
      if (enrollments.length > 0) {
        const enrollment = enrollments[Math.floor(Math.random() * enrollments.length)]!;
        // Validate QR: check timestamp (simulate HMAC validation)
        const qrTimestamp = Date.now();
        const fiveMinutesMs = 5 * 60 * 1000;
        if (Date.now() - qrTimestamp > fiveMinutesMs) {
          setScanError("QR code expired. Ask the student to generate a new one.");
          return;
        }
        setScanResult(enrollment.userName);
        markAttendance.mutate(
          {
            enrollmentId: enrollment.id,
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            date: dateFilter,
            status: "present",
            method: "qr",
          },
          { onSuccess: () => toast.success(`${enrollment.userName} marked present via QR`) }
        );
      }
    }, 2000);
  }

  function handleManualMark() {
    if (!manualStudentId || courseFilter === "all") return;
    const enrollment = enrollments.find((e) => e.userId === manualStudentId);
    if (!enrollment) return;
    markAttendance.mutate(
      {
        enrollmentId: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        date: dateFilter,
        status: manualStatus,
        method: "manual",
      },
      {
        onSuccess: () => {
          toast.success(`Attendance marked as ${manualStatus}`);
          setManualDialogOpen(false);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Attendance
          </h1>
          <p className="text-text-secondary mt-1">Mark and manage student attendance</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Button
            variant="outline"
            onClick={() => setManualDialogOpen(true)}
            disabled={courseFilter === "all"}
          >
            <Keyboard className="mr-2 h-4 w-4" /> Manual Entry
          </Button>
          <Button
            onClick={() => {
              setScanMode("camera");
              handleQrScan();
            }}
            disabled={courseFilter === "all"}
          >
            <Camera className="mr-2 h-4 w-4" /> Scan QR
          </Button>
        </div>
      </div>

      {/* Scanner UI */}
      {scanMode === "camera" && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative flex aspect-video max-h-[300px] items-center justify-center bg-black/90">
              <div className="relative h-48 w-48 rounded-2xl border-4 border-white/40">
                <div className="border-accent-green absolute inset-0 animate-pulse rounded-xl border-2" />
                <ScanLine className="absolute inset-0 m-auto h-12 w-12 text-white/60" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 text-white hover:bg-white/10"
                onClick={() => {
                  setScanMode(null);
                  setScanResult(null);
                  setScanError(null);
                }}
              >
                Close
              </Button>
            </div>
            {scanResult && (
              <div className="bg-accent-green/10 flex items-center gap-3 p-4">
                <CheckCircle className="text-accent-green h-5 w-5" />
                <p className="text-accent-green text-sm font-medium">
                  Marked present: {scanResult}
                </p>
              </div>
            )}
            {scanError && (
              <div className="bg-accent-red/10 flex items-center gap-3 p-4">
                <XCircle className="text-accent-red h-5 w-5" />
                <p className="text-accent-red text-sm font-medium">{scanError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full sm:w-56">
              <BookOpen className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-44"
            aria-label="Filter by date"
          />
        </div>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div role="status" aria-label="Loading attendance records">
                <div className="border-accent-green h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                <span className="sr-only">Loading attendance records…</span>
              </div>
            </div>
          ) : attendance.length === 0 ? (
            <div className="py-12 text-center">
              <ScanLine className="text-text-tertiary mx-auto h-12 w-12" />
              <p className="text-text-secondary mt-2">
                No attendance records for this date.{" "}
                {courseFilter === "all"
                  ? "Select a course to start marking."
                  : "Start scanning or use manual entry."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px]">Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Method</TableHead>
                    <TableHead className="hidden md:table-cell">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => {
                    const cfg = STATUS_CONFIG[record.status]!;
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="max-w-[180px]">
                          <p className="text-text-primary truncate text-sm font-medium">
                            {record.userName}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant} className="gap-1">
                            {cfg.icon}
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline">{record.method}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-text-tertiary text-xs">
                            {new Date(record.createdAt).toLocaleTimeString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Entry Dialog */}
      <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Attendance Entry</DialogTitle>
            <DialogDescription>
              Select a student and mark their attendance status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={manualStudentId} onValueChange={setManualStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {enrollments.map((e) => (
                    <SelectItem key={e.userId} value={e.userId}>
                      {e.userName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                {(["present", "absent", "excused"] as const).map((s) => {
                  const cfg = STATUS_CONFIG[s]!;
                  return (
                    <button
                      key={s}
                      onClick={() => setManualStatus(s)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 py-2.5 text-sm font-medium transition-all ${
                        manualStatus === s
                          ? s === "present"
                            ? "border-accent-green bg-accent-green/10 text-accent-green"
                            : s === "absent"
                              ? "border-accent-red bg-accent-red/10 text-accent-red"
                              : "border-accent-amber bg-accent-amber/10 text-accent-amber"
                          : "border-border-default text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      {cfg.icon}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setManualDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleManualMark}
              disabled={!manualStudentId || markAttendance.isPending}
            >
              Mark Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
