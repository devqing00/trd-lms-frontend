import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-primary flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-text-primary text-xl font-bold tracking-tight">
          LMS<span className="text-accent-blue">.</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 pb-12">{children}</main>

      {/* Footer */}
      <footer className="text-text-tertiary py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Hybrid LMS. All rights reserved.
      </footer>
    </div>
  );
}
