"use client";

import { FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateDocument?: () => void;
}

export default function EmptyState({ onCreateDocument }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 rounded-full bg-neutral-100 p-6">
        <FileSignature className="h-16 w-16 text-neutral-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-neutral-950">
        No documents yet
      </h3>
      <p className="mb-8 max-w-sm text-neutral-600">
        Create your first document to get started with the digital signature
        workflow.
      </p>
      <Button onClick={onCreateDocument}>
        <FileSignature className="mr-2 h-4 w-4" />
        Create Document
      </Button>
    </div>
  );
}
