import type { Metadata } from "next";
import { Fragment_Mono, Inter, Inter_Tight } from "next/font/google";
import { AuthSyncProvider } from "@/components/auth/AuthSyncProvider";
import "./globals.css";

const interBody = Inter({
  variable: "--font-inter-body",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WurkFlo",
  description: "Software Management Software for Businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interBody.variable} ${interTight.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthSyncProvider>{children}</AuthSyncProvider>
      </body>
    </html>
  );
}
