import type { Metadata, Viewport } from "next";
import { Inria_Serif, Onest } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/features/sw-register";
import "./globals.css";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-serif",
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" className={`${inriaSerif.variable} ${onest.variable}`}>
      <body className="font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
