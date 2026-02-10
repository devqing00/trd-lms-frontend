"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

/**
 * Accessibility: Screen reader route announcer.
 * Announces page changes to assistive technology.
 * Place in the root layout.
 */
function RouteAnnouncer() {
  const pathname = usePathname();

  // Derive announcement from pathname — no effect/state needed
  const announcement = useMemo(() => {
    const pageName =
      pathname === "/"
        ? "Home page"
        : pathname
            .split("/")
            .filter(Boolean)
            .map((segment) => segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
            .join(" – ") + " page";

    return `Navigated to ${pageName}`;
  }, [pathname]);

  return (
    <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}

export { RouteAnnouncer };
