import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md p-8 text-center">
        <div className="bg-accent-red/10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
          <ShieldAlert size={28} className="text-accent-red" />
        </div>
        <h1 className="font-display text-text-primary mt-4 text-2xl font-bold tracking-tight">
          Page Not Found
        </h1>
        <p className="text-text-secondary mt-2 text-sm">
          This admin page doesn&apos;t exist. It may have been removed or the URL is incorrect.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/admin">
            <Button size="sm" className="w-full sm:w-auto">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
