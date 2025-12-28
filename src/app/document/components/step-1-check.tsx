"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Step1FormData } from "@/lib/types/document";
import { FormSection } from "./step-1-check/form-section";
import { StatusSection } from "./step-1-check/status-section";

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
        <StatusSection
          isSuccess={isSuccess}
          error={error}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />
        <FormSection register={register} errors={errors} />
      </CardContent>
    </Card>
  );
}
