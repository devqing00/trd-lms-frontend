"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Award, Download, ExternalLink, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchStudentCertificates } from "@/lib/mock-data";
import type { Certificate } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  ready: "border-accent-green text-accent-green",
  generating: "border-accent-amber text-accent-amber",
  revoked: "border-accent-red text-accent-red",
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const certs = await fetchStudentCertificates();
      setCertificates(certs);
      setLoading(false);
    }
    void load();
  }, []);

  const filtered = search
    ? certificates.filter((c) => c.courseName.toLowerCase().includes(search.toLowerCase()))
    : certificates;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div role="status" aria-label="Loading certificates">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Loading certificates…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-text-primary text-2xl font-bold tracking-tight sm:text-3xl">
          My Certificates
        </h1>
        <p className="text-text-secondary mt-1">View and download your earned certifications.</p>
      </div>

      {certificates.length > 0 && (
        <div className="relative max-w-md">
          <Search
            size={18}
            className="text-text-tertiary absolute top-1/2 left-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            placeholder="Search certificates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
            aria-label="Search certificates"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certificates yet"
            description="Complete courses to earn your certifications."
            action={{
              label: "Browse Courses",
              onClick: () => router.push("/courses"),
            }}
          />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">No certificates match your search.</p>
          </Card>
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="bg-accent-amber/10 text-accent-amber flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Award size={24} />
                  </div>
                  <Badge variant="outline" className={STATUS_STYLES[cert.status] ?? ""}>
                    {cert.status}
                  </Badge>
                </div>
                <CardTitle className="mt-2 line-clamp-2 text-base">{cert.courseName}</CardTitle>
                <CardDescription>Certificate #{cert.certificateNumber}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-text-tertiary text-xs">Issued</p>
                    <p className="text-text-primary font-medium">
                      {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "Pending"}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs">Status</p>
                    <p className="text-text-primary font-medium capitalize">{cert.status}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {cert.status === "ready" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => toast.success("Certificate downloaded")}
                    >
                      <Download size={16} /> Download
                    </Button>
                  )}
                  <Link href={`/verify/${cert.certificateNumber}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">
                      <ExternalLink size={16} /> Verify
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
