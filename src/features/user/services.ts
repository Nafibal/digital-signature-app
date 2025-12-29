"use server";

import { auth } from "@/server/auth";
import type { UserProfile, UserResponse } from "./types";

export const getUserProfile = async (): Promise<UserResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((m) => m.headers()),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        createdAt: session.user.createdAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch user profile",
    };
  }
};

export const updateUserProfile = async (
  data: Partial<UserProfile>
): Promise<UserResponse> => {
  // TODO: Implement user profile update logic
  // This would call the auth provider's update method or a user API endpoint
  return {
    success: false,
    error: "Not implemented yet",
  };
};
