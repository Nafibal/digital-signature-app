import { auth } from "@/server/auth/config";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { DocumentWorkflowClient } from "@/features/document/components/workflow";

export default async function DocumentEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
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

  const { id } = await params;
  return <DocumentWorkflowClient session={session} documentId={id} />;
}
