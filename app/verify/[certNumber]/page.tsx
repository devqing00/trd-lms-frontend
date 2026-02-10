"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Award, ArrowLeft, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchCertificateByNumber } from "@/lib/mock-data";
import type { Certificate } from "@/lib/types";

export default function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certNumber: string }>;
}) {
  const { certNumber } = use(params);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const cert = await fetchCertificateByNumber(certNumber);
      if (cert) {
        setCertificate(cert);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    void load();
  }, [certNumber]);

  if (loading) {
    return (
      <div className="bg-bg-primary flex min-h-screen items-center justify-center">
        <div role="status" aria-label="Verifying certificate">
          <div className="border-accent-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <span className="sr-only">Verifying certificate…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border-default bg-bg-secondary border-b-2 px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            href="/"
            className="font-display text-text-primary text-xl font-bold tracking-tight"
          >
            LMS<span className="text-accent-blue">.</span>
          </Link>
          <Badge variant="outline" className="text-xs">
            <Shield size={12} className="mr-1" />
            Public Verification
          </Badge>
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {notFound ? (
          <Card className="mx-auto max-w-md text-center">
            <CardContent className="space-y-4 pt-6">
              <XCircle size={64} className="text-accent-red mx-auto" />
              <h1 className="font-display text-text-primary text-2xl font-bold">
                Certificate Not Found
              </h1>
              <p className="text-text-secondary text-sm">
                No certificate with ID <span className="font-mono font-semibold">{certNumber}</span>{" "}
                was found in our system. It may have been revoked or the ID may be incorrect.
              </p>
              <Link
                href="/"
                className="text-text-secondary hover:text-text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                Go to Homepage
              </Link>
            </CardContent>
          </Card>
        ) : certificate ? (
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <CheckCircle2 size={64} className="text-accent-green mx-auto" />
              <CardTitle className="text-accent-green mt-2 text-xl">Certificate Verified</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="border-accent-green/20 bg-accent-green/5 rounded-2xl border-2 p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-text-tertiary text-xs tracking-wider uppercase">Recipient</p>
                    <p className="text-text-primary font-semibold">{certificate.userName}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs tracking-wider uppercase">Course</p>
                    <p className="text-text-primary font-semibold">{certificate.courseName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-text-tertiary text-xs tracking-wider uppercase">
                        Certificate ID
                      </p>
                      <p className="text-text-primary font-mono text-xs font-semibold">
                        {certificate.certificateNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-tertiary text-xs tracking-wider uppercase">Issued</p>
                      <p className="text-text-primary font-semibold">
                        {certificate.issuedAt
                          ? new Date(certificate.issuedAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs tracking-wider uppercase">Status</p>
                    <Badge variant="outline" className="border-accent-green text-accent-green mt-1">
                      <Award size={12} className="mr-1" />
                      {certificate.status === "ready" ? "Valid" : certificate.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-text-tertiary text-center text-xs">
                This certificate was verified by the Hybrid LMS platform. Contact the issuing
                organization for additional details.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
