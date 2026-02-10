"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

/**
 * PWA install prompt banner.
 * Shows when the browser fires `beforeinstallprompt` and the app is installable.
 */
function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" && sessionStorage.getItem("pwa-install-dismissed") === "true"
  );

  useEffect(() => {
    function handlePrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }

  function handleDismiss() {
    setDismissed(true);
    setDeferredPrompt(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pwa-install-dismissed", "true");
    }
  }

  if (!deferredPrompt || dismissed) return null;

  return (
    <div className="animate-in slide-in-from-bottom-4 fixed right-4 bottom-4 left-4 z-40 mx-auto max-w-md">
      <div className="border-accent-blue/30 bg-bg-secondary shadow-hard flex items-center gap-3 rounded-2xl border-2 p-4">
        <div className="bg-accent-blue/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Download className="text-accent-blue h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-text-primary text-sm font-medium">Install TRD LMS</p>
          <p className="text-text-tertiary text-xs">Add to home screen for offline access</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleInstall}>
          Install
        </Button>
        <button
          onClick={handleDismiss}
          className="text-text-tertiary hover:text-text-primary shrink-0"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { InstallPrompt };
