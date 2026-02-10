import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function StudentNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md p-8 text-center">
        <div className="bg-accent-blue/10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
          <GraduationCap size={28} className="text-accent-blue" />
        </div>
        <h1 className="font-display text-text-primary mt-4 text-2xl font-bold tracking-tight">
          Page Not Found
        </h1>
        <p className="text-text-secondary mt-2 text-sm">
          We couldn&apos;t find this page. It may have been moved or the link is broken.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button size="sm" className="w-full sm:w-auto">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Browse Courses
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
