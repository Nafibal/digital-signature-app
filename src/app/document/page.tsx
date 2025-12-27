import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DocumentWorkflowClient from "./document-workflow-client";

export default async function DocumentPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <DocumentWorkflowClient session={session} />;
}
