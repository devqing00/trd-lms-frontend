"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  XCircle,
  CheckCircle,
  RotateCcw,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEnrollments, useUpdateEnrollmentStatus } from "@/lib/hooks/use-queries";
import { useTableFilters } from "@/lib/hooks/use-table-filters";
import { toast } from "sonner";
import type { Enrollment, EnrollmentStatus } from "@/lib/types";

const STATUS_BADGE: Record<EnrollmentStatus, "info" | "success" | "warning" | "default"> = {
  enrolled: "info",
  completed: "success",
  waitlisted: "warning",
  cancelled: "default",
};

export default function EnrollmentsPage() {
  const { filters, setSearch, setPage, setFilter } = useTableFilters({
    pageSize: 15,
  });
  const { data, isLoading } = useEnrollments(filters);
  const updateStatus = useUpdateEnrollmentStatus();
  const [actionTarget, setActionTarget] = useState<{
    enrollment: Enrollment;
    action: "cancel" | "complete" | "reinstate";
  } | null>(null);

  function handleAction() {
    if (!actionTarget) return;
    const { enrollment, action } = actionTarget;
    const statusMap: Record<string, "enrolled" | "completed" | "cancelled"> = {
      cancel: "cancelled",
      complete: "completed",
      reinstate: "enrolled",
    };
    const newStatus = statusMap[action] ?? "enrolled";
    updateStatus.mutate(
      { enrollmentId: enrollment.id, status: newStatus },
      {
        onSuccess: () => {
          const messages: Record<string, string> = {
            cancel: `Enrollment for ${enrollment.userName} cancelled`,
            complete: `${enrollment.userName} marked as completed`,
            reinstate: `${enrollment.userName} re-enrolled`,
          };
          toast.success(messages[action]);
          setActionTarget(null);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Enrollments
        </h1>
        <p className="text-text-secondary mt-1">Manage all enrollment records across courses</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              placeholder="Search by student or course..."
              value={filters.search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              aria-label="Search enrollments"
            />
          </div>
          <Select
            value={filters.status ?? "all"}
            onValueChange={(v) => setFilter("status", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="waitlisted">Waitlisted</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Student</TableHead>
                    <TableHead className="hidden md:table-cell">Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Enrolled</TableHead>
                    <TableHead className="hidden sm:table-cell">Completed</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="max-w-[200px] pl-6">
                        <div className="min-w-0">
                          <p className="text-text-primary truncate font-medium">
                            {enrollment.userName}
                          </p>
                          <p className="text-text-tertiary truncate text-xs">
                            {enrollment.userEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-text-secondary max-w-[250px] truncate text-sm">
                          {enrollment.courseName}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE[enrollment.status]}>{enrollment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary hidden text-sm sm:table-cell">
                        {enrollment.enrolledAt
                          ? new Date(enrollment.enrolledAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-text-secondary hidden text-sm sm:table-cell">
                        {enrollment.completedAt
                          ? new Date(enrollment.completedAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Actions for ${enrollment.userName}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {enrollment.status === "enrolled" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setActionTarget({ enrollment, action: "complete" })
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Completed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-accent-red focus:text-accent-red"
                                  onClick={() => setActionTarget({ enrollment, action: "cancel" })}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Enrollment
                                </DropdownMenuItem>
                              </>
                            )}
                            {enrollment.status === "waitlisted" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setActionTarget({ enrollment, action: "complete" })
                                  }
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Promote to Enrolled
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-accent-red focus:text-accent-red"
                                  onClick={() => setActionTarget({ enrollment, action: "cancel" })}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Remove from Waitlist
                                </DropdownMenuItem>
                              </>
                            )}
                            {enrollment.status === "cancelled" && (
                              <DropdownMenuItem
                                onClick={() => setActionTarget({ enrollment, action: "reinstate" })}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reinstate Enrollment
                              </DropdownMenuItem>
                            )}
                            {enrollment.status === "completed" && (
                              <DropdownMenuItem disabled>
                                <CheckCircle className="text-accent-green mr-2 h-4 w-4" />
                                Completed — No actions
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data?.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-text-secondary h-32 text-center">
                        No enrollments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {data && data.totalPages > 1 && (
              <div className="border-border-default flex items-center justify-between border-t-2 px-4 py-3 sm:px-6">
                <p className="text-text-secondary text-sm">
                  Showing {(data.page - 1) * data.pageSize + 1}–
                  {Math.min(data.page * data.pageSize, data.total)} of {data.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.page <= 1}
                    onClick={() => setPage(data.page - 1)}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-text-primary text-sm font-medium">
                    {data.page} / {data.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={data.page >= data.totalPages}
                    onClick={() => setPage(data.page + 1)}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionTarget} onOpenChange={(open) => !open && setActionTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {actionTarget?.action === "cancel"
                ? "Cancel Enrollment"
                : actionTarget?.action === "complete"
                  ? "Mark as Completed"
                  : "Reinstate Enrollment"}
            </DialogTitle>
            <DialogDescription>
              {actionTarget?.action === "cancel" ? (
                <>
                  Cancel enrollment for <strong>{actionTarget.enrollment.userName}</strong> in{" "}
                  <strong>{actionTarget.enrollment.courseName}</strong>? This will free up a seat.
                </>
              ) : actionTarget?.action === "complete" ? (
                <>
                  Mark <strong>{actionTarget.enrollment.userName}</strong> as completed for{" "}
                  <strong>{actionTarget.enrollment.courseName}</strong>? They will become eligible
                  for certification.
                </>
              ) : (
                <>
                  Reinstate <strong>{actionTarget?.enrollment.userName}</strong> in{" "}
                  <strong>{actionTarget?.enrollment.courseName}</strong>?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setActionTarget(null)}>
              Cancel
            </Button>
            <Button
              variant={actionTarget?.action === "cancel" ? "destructive" : "primary"}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
