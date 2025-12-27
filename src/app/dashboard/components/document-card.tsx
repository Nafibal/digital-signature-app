"use client";

import { Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import DocumentStatusBadge from "./document-status-badge";
import WorkflowSteps from "./workflow-steps";
import { Document } from "@/lib/api/documents";

interface DocumentCardProps {
  document: Document;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function DocumentCard({
  document,
  onView,
  onEdit,
}: DocumentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight flex-1">
            {document.title}
          </h3>
          <DocumentStatusBadge status={document.status} />
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="font-medium">Step:</span>
            <span className="font-semibold">{document.currentStep}/4</span>
          </div>

          <WorkflowSteps currentStep={document.currentStep} />

          <div className="text-sm text-neutral-500">
            Created: {formatDate(document.createdAt)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onView?.(document.id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        {document.status === "draft" && (
          <Button className="flex-1" onClick={() => onEdit?.(document.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
