import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Incognigram",
  description: "Share your thoughts freely. Join conversations without the pressure of a name attached.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased scrollbar-thumb-purple-700 scrollbar-track-gray-800 scrollbar-thin`}>
      <body className="min-h-screen flex flex-col bg-gray-900">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}