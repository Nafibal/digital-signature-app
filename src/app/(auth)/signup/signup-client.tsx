"use client";
import { FileSignature, GalleryVerticalEnd } from "lucide-react";

import { SignupForm, SignupFormData } from "@/components/signup-form";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { signUp } from "@/lib/actions/auth-actions";
import Image from "next/image";

export default function SignupClientPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const handleEmailAuth = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signUp(data.email, data.password, data.name);
      if (!result.user) {
        setError("Failed to create account");
      }
    } catch (err) {
      setError(
        `Authentication error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
              <FileSignature className="h-5 w-5" />
            </div>
            <span>DigiSign.</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm onSubmit={handleEmailAuth} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/signup.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
        />
      </div>
    </div>
  );
}
