import { Button } from "@/components/ui/button";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Step3bFormData, DEFAULT_ORGANIZATIONS } from "@/lib/types/document";

interface SignatureFormProps {
  register: UseFormRegister<Step3bFormData>;
  errors: FieldErrors<Step3bFormData>;
  signatureData: Step3bFormData | null;
  signatureImage: string | null;
  onClearForm: () => void;
}

export default function SignatureForm({
  register,
  errors,
  signatureData,
  signatureImage,
  onClearForm,
}: SignatureFormProps) {
  return (
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
          Choose department or unit for this signature
        </p>
        {errors.organization && (
          <p className="text-sm text-red-500">{errors.organization.message}</p>
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
          Enter the full name of person who will sign the document
        </p>
        {errors.signerName && (
          <p className="text-sm text-red-500">{errors.signerName.message}</p>
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
          Enter the job title or position of signer
        </p>
        {errors.position && (
          <p className="text-sm text-red-500">{errors.position.message}</p>
        )}
      </div>

      {/* Clear Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClearForm}
        disabled={!signatureImage}
        className="w-full"
      >
        Clear Form
      </Button>
    </div>
  );
}
