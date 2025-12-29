"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentCard from "./DocumentCard";
import EmptyState from "./EmptyState";
import { Document } from "@/features/document/services";
import { useCallback, memo } from "react";

interface DocumentListProps {
  documents?: Document[];
  onCreateDocument?: () => void;
  onViewDocument?: (id: string) => void;
  onEditDocument?: (id: string) => void;
}

const DocumentList = memo(function DocumentList({
  documents = [],
  onCreateDocument,
  onViewDocument,
  onEditDocument,
}: DocumentListProps) {
  const hasDocuments = documents && documents.length > 0;

  const handleView = useCallback(
    (id: string) => {
      onViewDocument?.(id);
    },
    [onViewDocument]
  );

  const handleEdit = useCallback(
    (id: string) => {
      onEditDocument?.(id);
    },
    [onEditDocument]
  );

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
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <EmptyState onCreateDocument={onCreateDocument} />
      )}
    </div>
  );
});

export default DocumentList;
