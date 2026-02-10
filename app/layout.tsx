import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { ScrollToTop } from "@/components/ui/skip-to-content";
import { RouteAnnouncer } from "@/components/ui/route-announcer";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const endgraph = localFont({
  src: [
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Thin-BF66b31b988c3dc.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Light-BF66b31b9838d67.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Regular-BF66b31b9867893.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Medium-BF66b31b9825275.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/tbj-endgraph-font-family/TBJEndgraphMini-Bold-BF66b31b98302f9.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-endgraph",
});

export const metadata: Metadata = {
  title: "TRD LMS | Hybrid Learning Management System",
  description:
    "A hybrid platform for managing physical training programs with digital gatekeeping, prerequisite testing, and verifiable certification.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TRD LMS",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${endgraph.variable} antialiased`}
        style={{
          fontFamily: `${dmSans.style.fontFamily}, system-ui, sans-serif`,
        }}
      >
        <Providers>
          <ErrorBoundary>
            <div id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </div>
          </ErrorBoundary>
          <ScrollToTop />
          <RouteAnnouncer />
        </Providers>
      </body>
    </html>
  );
}
