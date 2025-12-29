"use client";

import { useRouter } from "next/navigation";
import DocumentList from "@/features/document/components/dashboard/DocumentList";
import { useGetAllDocuments } from "@/features/document/hooks/use-get-all-documents";

type Session = typeof import("@/server/auth/config").auth.$Infer.Session;

export default function DashboardClientPage({ session }: { session: Session }) {
  const router = useRouter();

  const {
    data: documents,
    isLoading,
    error,
  } = useGetAllDocuments({
    onError: (error) => {
      console.error("Failed to load documents:", error);
    },
  });

  const handleCreateDocument = () => {
    router.push("/document");
  };

  const handleViewDocument = (id: string) => {
    router.push(`/document/${id}`);
  };

  const handleEditDocument = (id: string) => {
    router.push(`/document/${id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-neutral-600">Loading documents...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-600">Failed to load documents</div>
          </div>
        ) : (
          <DocumentList
            documents={documents}
            onCreateDocument={handleCreateDocument}
            onViewDocument={handleViewDocument}
            onEditDocument={handleEditDocument}
          />
        )}
      </main>
    </div>
  );
}
