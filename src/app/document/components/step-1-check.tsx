"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Step1FormData } from "@/lib/types/document";
import { StatusMessage } from "@/components/ui/status-message";

interface Step1CheckProps {
  defaultValues?: Step1FormData;
  onFormStateChange?: (state: {
    isDirty: boolean;
    getValues: () => Step1FormData;
  }) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  error?: Error | null;
  isSuccess?: boolean;
}

export default function Step1Check({
  defaultValues,
  onFormStateChange,
  isCreating = false,
  isUpdating = false,
  error = null,
  isSuccess = false,
}: Step1CheckProps) {
  const {
    register,
    formState: { errors, isDirty },
    getValues,
  } = useForm<Step1FormData>({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      documentType: "contract",
    },
    mode: "onBlur",
  });

  // Notify parent of form state changes (isDirty and getValues)
  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange({
        isDirty,
        getValues,
      });
    }
  }, [isDirty, onFormStateChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Document Details</CardTitle>
        <CardDescription>
          Verify document information and confirm requirements before proceeding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSuccess && (
          <StatusMessage type="success" message="Document Details Saved!" />
        )}

        {error && (
          <StatusMessage
            type="error"
            message="Failed to create document"
            description={error.message}
          />
        )}

        {isCreating && (
          <StatusMessage type="loading" message="Creating document..." />
        )}

        {isUpdating && (
          <StatusMessage type="loading" message="Updating document..." />
        )}

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
      </CardContent>
    </Card>
  );
}
