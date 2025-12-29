/**
 * useCreateDocument Hook
 *
 * Custom hook for creating documents using TanStack Query's useMutation.
 * Handles the document creation process with proper state management.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DocumentResponse } from "@/features/document/types";

/**
 * Request type for creating a document
 */
export interface CreateDocumentRequest {
  title: string;
  description?: string;
  documentType?: string;
}

/**
 * Response type for document creation
 */
export type CreateDocumentResponse = DocumentResponse;

interface UseCreateDocumentOptions {
  /**
   * Callback function called when document creation is successful
   */
  onSuccess?: (data: CreateDocumentResponse) => void;
  /**
   * Callback function called when document creation fails
   */
  onError?: (error: Error) => void;
  /**
   * Callback function called when mutation settles (success or error)
   */
  onSettled?: () => void;
}

/**
 * Hook for creating documents
 *
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with state and mutate function
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, error } = useCreateDocument({
 *   onSuccess: (data) => console.log('Document created:', data.id),
 *   onError: (error) => console.error('Failed:', error.message)
 * });
 *
 * mutate({ ownerId: 'user-123', title: 'My Document', description: '...', documentType: 'contract' });
 * ```
 */
export function useCreateDocument(options?: UseCreateDocumentOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    /**
     * Mutation function that calls the API to create a document
     */
    mutationFn: async (data: CreateDocumentRequest) => {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create document");
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

      // Call user-provided success callback
      options?.onSuccess?.(data);
    },

    /**
     * Called when mutation fails
     * Calls user-provided error callback
     */
    onError: (error) => {
      console.error("Failed to create document:", error);
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
