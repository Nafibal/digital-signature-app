"use client";

import { useState } from "react";
import { signIn, signUp, signOut } from "../services";
import type { LoginFormData, SignupFormData, AuthResponse } from "../types";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (data: LoginFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn(data);
      if (!result.success) {
        setError(result.error || "Failed to sign in");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Authentication error: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignupFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signUp(data);
      if (!result.success) {
        setError(result.error || "Failed to sign up");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Authentication error: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signOut();
      if (!result.success) {
        setError(result.error || "Failed to sign out");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Authentication error: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };
}
