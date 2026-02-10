"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="bg-bg-primary flex min-h-screen items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-lg p-8 text-center sm:p-12">
        {/* Icon */}
        <div className="bg-accent-red/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
          <AlertTriangle size={32} className="text-accent-red" />
        </div>

        {/* Message */}
        <h1 className="font-display text-text-primary mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Something Went Wrong
        </h1>
        <p className="text-text-secondary mt-2">
          An unexpected error occurred. Don&apos;t worry — your data is safe. Try refreshing or head
          back home.
        </p>

        {error.digest && (
          <p className="bg-bg-tertiary text-text-tertiary mt-4 rounded-xl px-3 py-1.5 text-xs">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={reset} className="w-full sm:w-auto">
            <RefreshCw size={18} />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Home size={18} />
              Go Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
