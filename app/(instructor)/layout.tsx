"use client";

import { useState } from "react";
import { InstructorSidebar, InstructorMobileHeader } from "@/components/instructor/sidebar";
import { useServiceWorker } from "@/lib/hooks/use-service-worker";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Register SW for PWA / offline support
  useServiceWorker();

  return (
    <div className="bg-bg-primary flex h-screen overflow-hidden">
      <InstructorSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <InstructorMobileHeader onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
