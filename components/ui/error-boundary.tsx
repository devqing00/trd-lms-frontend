"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Types ─── */

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI */
  fallback?: ReactNode;
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/* ─── Class Component (only way to catch render errors) ─── */

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to reporting service in production
    console.error("[ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/* ─── Default Fallback UI ─── */

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center" role="alert">
      <div className="bg-accent-red/10 flex h-16 w-16 items-center justify-center rounded-2xl">
        <AlertTriangle className="text-accent-red h-8 w-8" />
      </div>

      <h2 className="font-display text-text-primary mt-4 text-xl font-bold">
        Something went wrong
      </h2>
      <p className="text-text-secondary mt-2 max-w-md text-sm">
        An unexpected error occurred in this section. The rest of the application is still working.
      </p>

      {error?.message && (
        <pre className="bg-bg-tertiary text-text-tertiary mt-4 max-w-md overflow-auto rounded-xl px-4 py-2 text-left text-xs">
          {error.message}
        </pre>
      )}

      <Button onClick={onReset} size="sm" className="mt-6">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

/* ─── Inline Error Fallback (for smaller sections) ─── */

function InlineErrorFallback({
  message = "Failed to load this section",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border-accent-red/20 bg-accent-red/5 flex items-center gap-3 rounded-xl border-2 px-4 py-3">
      <AlertTriangle className="text-accent-red h-4 w-4 shrink-0" />
      <p className="text-text-secondary flex-1 text-sm">{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export { ErrorBoundary, ErrorFallback, InlineErrorFallback };
