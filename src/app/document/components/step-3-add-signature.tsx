"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  SignaturePosition,
  Step3bFormData,
  DEFAULT_ORGANIZATIONS,
} from "@/lib/types/document";

interface Step3AddSignatureProps {
  signature: string | null;
  setSignature: React.Dispatch<React.SetStateAction<string | null>>;
  signaturePosition: SignaturePosition;
  setSignaturePosition: React.Dispatch<React.SetStateAction<SignaturePosition>>;
  signatureHistory: string[];
  setSignatureHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Step3AddSignature({
  signature,
  setSignature,
  signaturePosition,
  setSignaturePosition,
  signatureHistory,
  setSignatureHistory,
}: Step3AddSignatureProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<Step3bFormData>({
    mode: "onBlur",
  });

  // Watch all form values
  const watchedValues = watch();

  // Auto-generate signature when all fields are selected
  useEffect(() => {
    if (
      watchedValues.organization &&
      watchedValues.signerName &&
      watchedValues.position
    ) {
      const signatureData: Step3bFormData = {
        organization: watchedValues.organization,
        signerName: watchedValues.signerName,
        position: watchedValues.position,
      };
      const signatureJson = JSON.stringify(signatureData);

      // Only update if signature is different (prevent unnecessary re-renders)
      if (signature !== signatureJson) {
        setSignature(signatureJson);
      }

      // Only add to history if it's a new signature (not the same as the last one)
      setSignatureHistory((prev) => {
        const lastSignature = prev[prev.length - 1];
        if (lastSignature !== signatureJson) {
          return [...prev, signatureJson];
        }
        return prev;
      });
    } else {
      // Only clear if there's currently a signature
      if (signature !== null) {
        setSignature(null);
      }
    }
  }, [watchedValues, setSignature, setSignatureHistory, signature]);

  // Parse signature data for display
  const getSignatureData = (): Step3bFormData | null => {
    if (!signature) return null;
    try {
      return JSON.parse(signature) as Step3bFormData;
    } catch {
      return null;
    }
  };

  const signatureData = getSignatureData();

  // Generate visual text signature
  const getVisualSignature = (): string => {
    if (!signatureData) return "";
    return `${signatureData.signerName} - ${signatureData.position} - ${signatureData.organization}`;
  };

  // Clear form
  const clearSignature = () => {
    setSignature(null);
  };

  // Mock signature placement on PDF
  const handlePdfClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSignaturePosition({ x, y, page: 1 });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Signature Form Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Create Signature</CardTitle>
          <CardDescription>
            Select signer details to create your signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signature Form */}
          <div className="space-y-4">
            {/* Organization/Unit Select */}
            <div className="space-y-2">
              <label
                htmlFor="organization"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Organization / Unit
              </label>
              <select
                id="organization"
                {...register("organization", {
                  required: "Organization is required",
                })}
                aria-invalid={errors.organization ? "true" : "false"}
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              >
                <option value="">Select organization...</option>
                {DEFAULT_ORGANIZATIONS.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
              <p className="text-sm text-neutral-500">
                Choose the department or unit for this signature
              </p>
              {errors.organization && (
                <p className="text-sm text-red-500">
                  {errors.organization.message}
                </p>
              )}
            </div>

            {/* Signer Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="signerName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Signer Name
              </label>
              <input
                id="signerName"
                type="text"
                placeholder="Enter signer name..."
                {...register("signerName", {
                  required: "Signer name is required",
                })}
                aria-invalid={errors.signerName ? "true" : "false"}
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-neutral-500">
                Enter the full name of the person who will sign the document
              </p>
              {errors.signerName && (
                <p className="text-sm text-red-500">
                  {errors.signerName.message}
                </p>
              )}
            </div>

            {/* Position Input */}
            <div className="space-y-2">
              <label
                htmlFor="position"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Position
              </label>
              <input
                id="position"
                type="text"
                placeholder="Enter position..."
                {...register("position", {
                  required: "Position is required",
                })}
                aria-invalid={errors.position ? "true" : "false"}
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-neutral-500">
                Enter the job title or position of the signer
              </p>
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>

            {/* Clear Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!signature}
              className="w-full"
            >
              Clear Form
            </Button>
          </div>

          {/* Signature Preview */}
          {signatureData && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="mb-2 text-sm font-medium text-neutral-700">
                Signature Preview:
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {getVisualSignature()}
              </p>
            </div>
          )}

          {/* Signature Status */}
          <div
            className={`flex items-center gap-3 rounded-lg border p-4 ${
              signature
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-neutral-200 bg-neutral-50 text-neutral-600"
            }`}
          >
            {signature ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-neutral-300" />
            )}
            <div className="text-sm">
              {signature ? (
                <span>Signature created. You can proceed to final review.</span>
              ) : (
                <span>
                  Please fill in all three fields to create your signature.
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Preview Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Place Signature</CardTitle>
          <CardDescription>
            Click on the document to position your signature
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* PDF Preview Placeholder */}
          <div
            onClick={handlePdfClick}
            className="relative cursor-pointer rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-center justify-center gap-3 text-neutral-400">
              <FileText className="h-12 w-12" />
              <div className="text-sm">
                <p className="font-medium">PDF Preview</p>
                <p className="text-xs">Click to position signature</p>
              </div>
            </div>

            {/* Signature Placement Indicator - Visual Text */}
            {signatureData && (
              <div
                className="absolute border-2 border-dashed border-blue-500 bg-blue-50 px-4 py-3"
                style={{
                  left: `${signaturePosition.x}px`,
                  top: `${signaturePosition.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <p className="text-sm font-semibold text-neutral-900">
                  {signatureData.signerName}
                </p>
                <p className="text-xs text-neutral-600">
                  {signatureData.position}
                </p>
                <p className="text-xs text-neutral-600">
                  {signatureData.organization}
                </p>
              </div>
            )}
          </div>

          {/* Position Info */}
          {signature && (
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-sm text-neutral-600">
                <span className="font-medium">Position:</span> X:{" "}
                {Math.round(signaturePosition.x)}, Y:{" "}
                {Math.round(signaturePosition.y)}, Page:{" "}
                {signaturePosition.page}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
