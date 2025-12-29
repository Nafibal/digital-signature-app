/**
 * useUpdateDocument Hook
 *
 * Custom hook for updating documents using TanStack Query's useMutation.
 * Handles the document update process with proper state management.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DocumentResponse } from "@/features/document/types";

interface UseUpdateDocumentOptions {
  /**
   * Callback function called when document update is successful
   */
  onSuccess?: (data: DocumentResponse) => void;
  /**
   * Callback function called when document update fails
   */
  onError?: (error: Error) => void;
  /**
   * Callback function called when mutation settles (success or error)
   */
  onSettled?: () => void;
}

/**
 * Hook for updating documents
 *
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with state and mutate function
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, error } = useUpdateDocument({
 *   onSuccess: (data) => console.log('Document updated:', data.id),
 *   onError: (error) => console.error('Failed:', error.message)
 * });
 *
 * mutate({ id: 'doc-123', title: 'Updated Title' });
 * ```
 */
export function useUpdateDocument(options?: UseUpdateDocumentOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    /**
     * Mutation function that calls the service to update a document
     */
    mutationFn: async ({
      id,
      ...data
    }: { id: string } & Record<string, unknown>) => {
      // Call the API route instead of importing server code
      const response = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update document");
      }

      return response.json();
    },

    /**
     * Called when mutation succeeds
     * Invalidates relevant queries and calls user-provided callback
     */
    onSuccess: (data, variables, context) => {
      // Invalidate documents list query if it exists
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });

      // Invalidate the specific document query to refresh its data
      queryClient.invalidateQueries({
        queryKey: ["document", variables.id],
      });

      // Call user-provided success callback
      options?.onSuccess?.(data);
    },

    /**
     * Called when mutation fails
     * Calls user-provided error callback
     */
    onError: (error) => {
      console.error("Failed to update document:", error);
      options?.onError?.(error);
    },

    /**
     * Called when mutation settles (success or error)
     * Calls user-provided settled callback
     */
    onSettled: () => {
      options?.onSettled?.();
    },
  });

  return {
    /**
     * Function to trigger the mutation
     */
    mutate: mutation.mutate,
    /**
     * Function to trigger the mutation asynchronously
     */
    mutateAsync: mutation.mutateAsync,
    /**
     * Whether the mutation is currently in progress
     */
    isLoading: mutation.isPending,
    /**
     * Whether the mutation is currently in progress (alias for isLoading)
     */
    isPending: mutation.isPending,
    /**
     * Error object if the mutation failed
     */
    error: mutation.error,
    /**
     * Data returned from the mutation if successful
     */
    data: mutation.data,
    /**
     * Whether the mutation was successful
     */
    isSuccess: mutation.isSuccess,
    /**
     * Whether the mutation failed
     */
    isError: mutation.isError,
    /**
     * Function to reset the mutation state
     */
    reset: mutation.reset,
  };
}
