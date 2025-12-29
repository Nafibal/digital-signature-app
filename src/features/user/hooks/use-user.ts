"use client";

import { useState } from "react";
import { getUserProfile, updateUserProfile } from "../services";
import type { UserProfile, UserResponse } from "../types";

export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async (): Promise<UserResponse> => {
    setIsLoading(true);
    setError("");

    try {
      const result = await getUserProfile();
      if (!result.success) {
        setError(result.error || "Failed to fetch user profile");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`User error: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (
    data: Partial<UserProfile>
  ): Promise<UserResponse> => {
    setIsLoading(true);
    setError("");

    try {
      const result = await updateUserProfile(data);
      if (!result.success) {
        setError(result.error || "Failed to update user profile");
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`User error: ${errorMessage}`);
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
    fetchProfile,
    updateProfile,
  };
}
