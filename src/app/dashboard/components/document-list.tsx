"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentCard from "./document-card";
import EmptyState from "./empty-state";

interface Document {
  id: string;
  title: string;
  status: "draft" | "signed";
  currentStep: number;
  createdAt: string;
}

interface DocumentListProps {
  documents?: Document[];
  onCreateDocument?: () => void;
  onViewDocument?: (id: string) => void;
  onEditDocument?: (id: string) => void;
}

// Static dummy data
const dummyDocuments: Document[] = [
  {
    id: "1",
    title: "Contract Agreement",
    status: "draft",
    currentStep: 3,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "NDA Document",
    status: "signed",
    currentStep: 4,
    createdAt: "2025-01-10T14:20:00Z",
  },
  {
    id: "3",
    title: "Invoice #2025-001",
    status: "draft",
    currentStep: 2,
    createdAt: "2025-01-14T09:15:00Z",
  },
  {
    id: "4",
    title: "Employee Handbook",
    status: "draft",
    currentStep: 1,
    createdAt: "2025-01-12T16:45:00Z",
  },
  {
    id: "5",
    title: "Service Agreement",
    status: "signed",
    currentStep: 4,
    createdAt: "2025-01-08T11:30:00Z",
  },
  {
    id: "6",
    title: "Terms and Conditions",
    status: "draft",
    currentStep: 2,
    createdAt: "2025-01-13T13:00:00Z",
  },
];

export default function DocumentList({
  documents = dummyDocuments,
  onCreateDocument,
  onViewDocument,
  onEditDocument,
}: DocumentListProps) {
  const hasDocuments = documents.length > 0;

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
