"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      toastOptions={{
        className:
          "!rounded-2xl !border-2 !border-border-default !bg-bg-secondary !text-text-primary !shadow-hard-sm !font-sans",
        duration: 3000,
      }}
      richColors
      closeButton
    />
  );
}
