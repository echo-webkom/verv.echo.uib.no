import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";
import { BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "echo – Verv",
    template: "%s | echo – Verv",
  },
  description:
    "Nettsiden til å verve seg i undergrupper til echo – Linjeforeningen for informatikk ved Universitetet i Bergen.",
  keywords: ["echo", "linjeforening", "informatikk", "lesesalen", "bergen"],
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon-32x32.png",
    shortcut: "/favicon16x16.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "echo – Verv",
  },
} satisfies Metadata;

export const viewport = {
  themeColor: "#ffeabb",
  width: "device-width",
  initialScale: 1,
} satisfies Viewport;

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="no" suppressHydrationWarning>
      <body className={cn("flex min-h-screen flex-col antialiased", inter.className)}>
        {umamiUrl && umamiWebsiteId && (
          <Script
            src={`${umamiUrl}/script.js`}
            data-website-id={umamiWebsiteId}
            data-endpoint="/api/t"
            strategy="afterInteractive"
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteHeader />
          <div className="flex-1 py-14">{children}</div>
          <SiteFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
