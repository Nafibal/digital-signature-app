"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentCard from "./document-card";
import EmptyState from "./empty-state";
import { Document } from "@/lib/api/documents";

interface DocumentListProps {
  documents?: Document[];
  onCreateDocument?: () => void;
  onViewDocument?: (id: string) => void;
  onEditDocument?: (id: string) => void;
}

export default function DocumentList({
  documents = [],
  onCreateDocument,
  onViewDocument,
  onEditDocument,
}: DocumentListProps) {
  const hasDocuments = documents && documents.length > 0;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-950">Documents</h2>
        <Button onClick={onCreateDocument}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Document
        </Button>
      </div>

      {/* Document Grid or Empty State */}
      {hasDocuments ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={onViewDocument}
              onEdit={onEditDocument}
            />
          ))}
        </div>
      ) : (
        <EmptyState onCreateDocument={onCreateDocument} />
      )}
    </div>
  );
}
