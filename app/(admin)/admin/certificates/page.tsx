"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Award,
  XCircle,
  ExternalLink,
  Copy,
  Plus,
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
import {
  useCertificatesAdmin,
  useRevokeCertificate,
  useGenerateCertificate,
  useCourses,
  useUsers,
} from "@/lib/hooks/use-queries";
import { useTableFilters } from "@/lib/hooks/use-table-filters";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import type { Certificate, CertificateStatus } from "@/lib/types";

const STATUS_BADGE: Record<CertificateStatus, "success" | "warning" | "default"> = {
  ready: "success",
  generating: "warning",
  revoked: "default",
};

export default function CertificatesPage() {
  const { filters, setSearch, setPage, setFilter } = useTableFilters({
    pageSize: 15,
  });
  const { data, isLoading } = useCertificatesAdmin(filters);
  const revokeCertificate = useRevokeCertificate();
  const generateCertificate = useGenerateCertificate();
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100, search: "" });
  const { data: usersData } = useUsers({ page: 1, pageSize: 100, search: "" });
  const [revokeTarget, setRevokeTarget] = useState<Certificate | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [genUserId, setGenUserId] = useState("");
  const [genCourseId, setGenCourseId] = useState("");

  function handleRevoke() {
    if (!revokeTarget) return;
    revokeCertificate.mutate(revokeTarget.id, {
      onSuccess: () => {
        toast.success(`Certificate ${revokeTarget.certificateNumber} revoked`);
        setRevokeTarget(null);
      },
    });
  }

  function handleGenerate() {
    if (!genUserId || !genCourseId) {
      toast.error("Select both a student and a course");
      return;
    }
    generateCertificate.mutate(
      { userId: genUserId, courseId: genCourseId },
      {
        onSuccess: () => {
          toast.success("Certificate generated successfully");
          setGenerateOpen(false);
          setGenUserId("");
          setGenCourseId("");
        },
      }
    );
  }

  function copyVerificationUrl(cert: Certificate) {
    navigator.clipboard.writeText(cert.verificationUrl);
    toast.success("Verification URL copied to clipboard");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Certificates
          </h1>
          <p className="text-text-secondary mt-1">View, verify, and manage issued certificates</p>
        </div>
        <Button variant="primary" onClick={() => setGenerateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Certificate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <Award className="text-accent-green h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Active</p>
              <p className="text-text-primary text-xl font-bold">
                {data?.data.filter((c) => c.status === "ready").length ?? 0}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <XCircle className="text-accent-red h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Revoked</p>
              <p className="text-text-primary text-xl font-bold">
                {data?.data.filter((c) => c.status === "revoked").length ?? 0}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="border-border-default bg-bg-tertiary flex h-10 w-10 items-center justify-center rounded-xl border-2">
              <Plus className="text-accent-blue h-5 w-5" />
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Total Issued</p>
              <p className="text-text-primary text-xl font-bold">{data?.total ?? 0}</p>
            </div>
          </div>
        </Card>
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
              placeholder="Search by student, course, or certificate number..."
              value={filters.search ?? ""}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              aria-label="Search certificates"
            />
          </div>
          <Select
            value={filters.status ?? "all"}
            onValueChange={(v) => setFilter("status", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="ready">Active</SelectItem>
              <SelectItem value="generating">Generating</SelectItem>
              <SelectItem value="revoked">Revoked</SelectItem>
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
                    <TableHead className="pl-6">Certificate #</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead className="hidden md:table-cell">Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Issued</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="pl-6">
                        <span className="text-text-primary font-mono text-sm font-medium">
                          {cert.certificateNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-text-primary truncate text-sm font-medium">
                          {cert.userName}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-text-secondary max-w-[200px] truncate text-sm">
                          {cert.courseName}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE[cert.status]}>{cert.status}</Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary hidden text-sm sm:table-cell">
                        {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Actions for ${cert.certificateNumber}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyVerificationUrl(cert)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Verification URL
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a
                                href={cert.verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Verify Certificate
                              </a>
                            </DropdownMenuItem>
                            {cert.status === "ready" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-accent-red focus:text-accent-red"
                                  onClick={() => setRevokeTarget(cert)}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Revoke Certificate
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data?.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-text-secondary h-32 text-center">
                        No certificates found.
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

      {/* Revoke Confirmation */}
      <Dialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Revoke Certificate</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke certificate{" "}
              <strong>{revokeTarget?.certificateNumber}</strong> issued to{" "}
              <strong>{revokeTarget?.userName}</strong>? This action cannot be undone and the
              certificate will no longer verify.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRevokeTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={revokeCertificate.isPending}
            >
              {revokeCertificate.isPending ? "Revoking…" : "Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Certificate Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Certificate</DialogTitle>
            <DialogDescription>
              Select a student and course to generate a completion certificate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={genUserId} onValueChange={setGenUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {usersData?.data
                    .filter((u) => u.role === "student")
                    .map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={genCourseId} onValueChange={setGenCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {coursesData?.data.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setGenerateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={!genUserId || !genCourseId || generateCertificate.isPending}
            >
              {generateCertificate.isPending ? "Generating…" : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
