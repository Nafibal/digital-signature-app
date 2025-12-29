"use client";

import { cn } from "@/lib/helpers";
import { DocumentStatus } from "@/features/document/services";

interface StatusBadgeProps {
  status: DocumentStatus;
}

export default function DocumentStatusBadge({ status }: StatusBadgeProps) {
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
}
