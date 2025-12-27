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
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

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
        {/* Success Message */}
        {isSuccess && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-950 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-medium">Document Details Saved!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Failed to create document</p>
              <p className="text-xs text-red-600 dark:text-red-300">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Creating Document Message */}
        {isCreating && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-sm font-medium">Creating document...</p>
          </div>
        )}

        {/* Updating Document Message */}
        {isUpdating && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-sm font-medium">Updating document...</p>
          </div>
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
