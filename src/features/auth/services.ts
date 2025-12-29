"use server";

import { headers } from "next/headers";
import { auth } from "@/server/auth";
import type { LoginFormData, SignupFormData, AuthResponse } from "./types";

export const signUp = async (data: SignupFormData): Promise<AuthResponse> => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
      },
    });

    return {
      success: true,
      user: result.user
        ? {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          }
        : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign up",
    };
  }
};

export const signIn = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      },
    });

    return {
      success: true,
      user: result.user
        ? {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
          }
        : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in",
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign out",
    };
  }
};
