import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Camera } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photo Gallery & Portfolio",
  description: "A curated collection of photographs and creative works showcasing a personal portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <ClerkProvider>
          <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Camera className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Portfolio Gallery
                  </h1>
                </Link>
                <nav className="flex items-center gap-6">
                  <Link href="/gallery" className="nav-link">
                    Gallery
                  </Link>
                  <SignedIn>
                    <Link href="/upload" className="nav-link">
                      Upload
                    </Link>
                    <Link href="/admin" className="btn-primary">
                      Admin
                    </Link>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton>
                      <button className="btn-primary" type="button">
                        Sign in
                      </button>
                    </SignInButton>
                  </SignedOut>
                </nav>
              </div>
            </div>
          </header>
          {children}
          <footer className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-blue-600" />
                <span className="text-slate-900 dark:text-white">
                  Portfolio Gallery
                </span>
              </Link>
              <span className="text-slate-500 dark:text-slate-400">
                &copy; {new Date().getFullYear()} Portfolio Gallery. All rights reserved.
              </span>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
