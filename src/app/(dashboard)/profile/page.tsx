import { auth } from "@/server/auth/config";
import ProfileClient from "@/features/user/components/ProfileClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <ProfileClient session={session} />;
}
