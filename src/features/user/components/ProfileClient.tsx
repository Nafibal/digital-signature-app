"use client";

import { User, Mail, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Session = typeof import("@/server/auth/config").auth.$Infer.Session;

export default function ProfileClient({ session }: { session: Session }) {
  const user = session.user;

  return (
    <div className="space-y-6 px-12 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <User className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Name</p>
              <p className="text-base font-medium">{user.name || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <Mail className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Email</p>
              <p className="text-base font-medium">{user.email}</p>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                <Calendar className="h-5 w-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  Member Since
                </p>
                <p className="text-base font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your current subscription and account status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">Active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
