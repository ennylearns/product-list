import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AnalyticsEventEmitter } from "@/src/components/analytics-event-emitter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Storefront",
  description: "Create a stunning storefront, manage your inventory, and receive orders directly to your WhatsApp.",
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Suspense fallback={null}>
          <AnalyticsEventEmitter />
        </Suspense>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
