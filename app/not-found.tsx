import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="bg-bg-primary flex min-h-screen items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-lg p-8 text-center sm:p-12">
        {/* 404 number */}
        <p className="font-display text-accent-blue text-7xl font-bold sm:text-8xl">404</p>

        {/* Message */}
        <h1 className="font-display text-text-primary mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Page Not Found
        </h1>
        <p className="text-text-secondary mt-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back on track.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home size={18} />
              Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeft size={18} />
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Decorative element */}
        <div className="text-text-tertiary mt-10 flex items-center justify-center gap-2">
          <Search size={16} />
          <p className="text-sm">
            Lost? Try heading to the{" "}
            <Link href="/" className="text-accent-blue font-semibold hover:underline">
              homepage
            </Link>
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
