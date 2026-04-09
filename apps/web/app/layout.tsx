import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/features/sw-register";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Doing The Thing",
  description: "A minimal accountability app that helps you follow through.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Doing The Thing",
  },
};

export const viewport: Viewport = {
  themeColor: "#96A797",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
