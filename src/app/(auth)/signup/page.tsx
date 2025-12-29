import { auth } from "@/server/auth/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignupClientPage from "./signup-client";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return <SignupClientPage />;
}
