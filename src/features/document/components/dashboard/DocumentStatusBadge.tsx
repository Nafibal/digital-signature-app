"use client";

import { cn } from "@/lib/utils";
import { DocumentStatus } from "@/features/document/services";
import { memo } from "react";

interface StatusBadgeProps {
  status: DocumentStatus;
}

const DocumentStatusBadge = memo(function DocumentStatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        status === "draft" &&
          "bg-neutral-100 text-neutral-700 border border-neutral-200",
        status === "signed" &&
          "bg-green-100 text-green-800 border border-green-200"
      )}
    >
      {status === "draft" && "Draft"}
      {status === "signed" && "Signed"}
    </span>
  );
});

export default DocumentStatusBadge;
