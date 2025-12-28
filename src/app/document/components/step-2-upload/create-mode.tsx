/**
 * CreateMode Component
 *
 * Displays create new document mode UI for Step 2.
 * Extracted from step-2-upload.tsx for better organization and reusability.
 */

import { FileText, CheckCircle2 } from "lucide-react";

export function CreateMode() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <FileText className="h-8 w-8 text-neutral-600" />
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-neutral-900">
            Start from Scratch
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Create a new document from scratch. You&apos;ll fill in the content
            in the next step.
          </p>
        </div>
        <CheckCircle2 className="mt-4 h-6 w-6 text-green-600" />
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You&apos;ll be able to add your document
          content and signature in the next step. A live PDF preview will be
          generated as you edit.
        </p>
      </div>
    </div>
  );
}
