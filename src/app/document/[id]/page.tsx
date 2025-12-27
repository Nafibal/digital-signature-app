import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DocumentWorkflowClient from "../document-workflow-client";

export default async function DocumentEditPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // TODO: Load document data based on ID
  // For now, we'll use the same workflow component
  // In a real implementation, you would load the document data here
  // and pass it to the client component

  return <DocumentWorkflowClient session={session} documentId={params.id} />;
}
