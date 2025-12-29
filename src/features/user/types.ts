export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date | null;
}

export interface UserSettings {
  notifications: boolean;
  theme: "light" | "dark" | "system";
}

export interface UserResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}
