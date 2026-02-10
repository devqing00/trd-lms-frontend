"use client";

import {
  Search,
  ArrowUpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useWaitlist,
  usePromoteWaitlistEntry,
  useRemoveWaitlistEntry,
} from "@/lib/hooks/use-queries";
import { useTableFilters } from "@/lib/hooks/use-table-filters";
import { toast } from "sonner";
import type { WaitlistEntry, WaitlistStatus } from "@/lib/types";
import { useState } from "react";

const STATUS_CONFIG: Record<
  WaitlistStatus,
  { variant: "warning" | "info" | "default" | "success"; icon: React.ElementType }
> = {
  waiting: { variant: "warning", icon: Clock },
  offered: { variant: "info", icon: AlertCircle },
  expired: { variant: "default", icon: X },
  promoted: { variant: "success", icon: CheckCircle2 },
};

export default function WaitlistPage() {
  const { filters, setSearch, setPage } = useTableFilters({ pageSize: 15 });
  const { data, isLoading } = useWaitlist(filters);
  const promote = usePromoteWaitlistEntry();
  const remove = useRemoveWaitlistEntry();

  const [promotingEntry, setPromotingEntry] = useState<WaitlistEntry | null>(null);
  const [removingEntry, setRemovingEntry] = useState<WaitlistEntry | null>(null);

  function handlePromote() {
    if (!promotingEntry) return;
    promote.mutate(promotingEntry.id, {
      onSuccess: () => {
        setPromotingEntry(null);
        toast.success("Student promoted to enrolled");
      },
    });
  }

  function handleRemove() {
    if (!removingEntry) return;
    remove.mutate(removingEntry.id, {
      onSuccess: () => {
        setRemovingEntry(null);
        toast.success("Removed from waitlist");
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          Waitlist
        </h1>
        <p className="text-text-secondary mt-1">
          Manage waitlisted students and promote them to available seats
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="text-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by student or course name..."
            value={filters.search ?? ""}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
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
                    <TableHead className="w-[60px] pl-6">#</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Joined</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((entry) => {
                    const config = STATUS_CONFIG[entry.status];
                    const StatusIcon = config.icon;

                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="pl-6">
                          <span className="bg-bg-tertiary text-text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                            {entry.position}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="min-w-0">
                            <p className="text-text-primary truncate font-medium">
                              {entry.userName}
                            </p>
                            <p className="text-text-tertiary truncate text-xs">{entry.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-text-secondary max-w-[200px] truncate text-sm">
                            {entry.courseName}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={config.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-secondary hidden text-sm sm:table-cell">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {entry.status === "waiting" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-accent-green hover:text-accent-green h-8 w-8"
                                onClick={() => setPromotingEntry(entry)}
                                title="Promote to enrolled"
                                aria-label={`Promote ${entry.userName} to enrolled`}
                              >
                                <ArrowUpCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-accent-red hover:text-accent-red h-8 w-8"
                              onClick={() => setRemovingEntry(entry)}
                              title="Remove from waitlist"
                              aria-label={`Remove ${entry.userName} from waitlist`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {data?.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-text-secondary h-32 text-center">
                        No waitlist entries found.
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

      {/* Promote Dialog */}
      <Dialog open={!!promotingEntry} onOpenChange={(open) => !open && setPromotingEntry(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Promote Student</DialogTitle>
            <DialogDescription>
              Promote <strong>{promotingEntry?.userName}</strong> from the waitlist to an enrolled
              seat in <strong>{promotingEntry?.courseName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPromotingEntry(null)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handlePromote} disabled={promote.isPending}>
              {promote.isPending ? "Promoting..." : "Promote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Dialog */}
      <Dialog open={!!removingEntry} onOpenChange={(open) => !open && setRemovingEntry(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove from Waitlist</DialogTitle>
            <DialogDescription>
              Remove <strong>{removingEntry?.userName}</strong> from the waitlist for{" "}
              <strong>{removingEntry?.courseName}</strong>? They will need to re-join if seats
              become available.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRemovingEntry(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove} disabled={remove.isPending}>
              {remove.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
