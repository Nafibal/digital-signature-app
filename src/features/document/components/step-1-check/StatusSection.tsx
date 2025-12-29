/**
 * StatusSection Component
 *
 * Displays status messages (success, error, loading) for Step 1.
 * Extracted from step-1-check.tsx for better organization and reusability.
 */

import { StatusMessage } from "@/components/feedback/StatusMessage";

interface StatusSectionProps {
  isSuccess?: boolean;
  error?: Error | null;
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function StatusSection({
  isSuccess = false,
  error = null,
  isCreating = false,
  isUpdating = false,
}: StatusSectionProps) {
  return (
    <>
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
    </>
  );
}
