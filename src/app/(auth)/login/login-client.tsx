"use client";
import { FileSignature, GalleryVerticalEnd } from "lucide-react";

import { LoginForm, LoginFormData } from "@/features/auth/components/LoginForm";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/features/auth/services";
import Image from "next/image";

export default function LoginClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const router = useRouter();
  // const searchParams = useSearchParams();

  const handleEmailAuth = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn(data);
      if (!result.user) {
        setError("Invalid email or password");
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm onSubmit={handleEmailAuth} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/login.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
        />
      </div>
    </div>
  );
}
