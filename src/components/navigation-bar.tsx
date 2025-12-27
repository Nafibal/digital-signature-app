"use client";
import { auth } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { FileSignature, GalleryVerticalEnd } from "lucide-react";

type Session = typeof auth.$Infer.Session;

const NavigationBar = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
            <FileSignature className="h-5 w-5" />
          </div>
          <span>DigiSign.</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-neutral-600">
          <Link
            href="#features"
            className="hover:text-neutral-950 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#workflow"
            className="hover:text-neutral-950 transition-colors"
          >
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {session && (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          )}
          {!session && (
            <div className="flex items-center gap-8">
              <Link
                href="/login"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-neutral-50 shadow hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
