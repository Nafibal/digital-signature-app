/**
 * FormSection Component
 *
 * Displays form fields for document title, type, and description.
 * Extracted from step-1-check.tsx for better organization and testability.
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Step1FormData } from "@/lib/types/document";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface FormSectionProps {
  register: UseFormRegister<Step1FormData>;
  errors: FieldErrors<Step1FormData>;
}

export function FormSection({ register, errors }: FormSectionProps) {
  return (
    <div className="space-y-6">
      {/* Document Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Document Title *</Label>
        <Input
          id="title"
          placeholder="Enter document title"
          {...register("title", {
            required: "Document title is required",
          })}
          aria-invalid={errors.title ? "true" : "false"}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Document Type */}
      <div className="space-y-2">
        <Label htmlFor="documentType">Document Type</Label>
        <select
          id="documentType"
          {...register("documentType")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="contract">Contract Agreement</option>
          <option value="nda">Non-Disclosure Agreement</option>
          <option value="invoice">Invoice</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Document Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Enter a brief description of the document"
          {...register("description")}
          className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
}
