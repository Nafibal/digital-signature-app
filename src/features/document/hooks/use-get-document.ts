/**
 * useGetDocument Hook
 *
 * Custom hook for fetching a single document using TanStack Query's useQuery.
 * Handles document fetching with proper state management and caching.
 */

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getDocument, GetDocumentResponse } from "@/lib/api/documents";

interface UseGetDocumentOptions {
  /**
   * Callback function called when document fetching fails
   */
  onError?: (error: Error) => void;
}

/**
 * Hook for fetching a single document
 *
 * @param documentId - The ID of the document to fetch
 * @param options - Optional callbacks for error states
 * @returns Query object with state and data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useGetDocument(documentId, {
 *   onError: (error) => console.error('Failed:', error.message)
 * });
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <DocumentView document={data} />;
 * ```
 */
export function useGetDocument(
  documentId: string | undefined,
  options?: UseGetDocumentOptions
) {
  const query = useQuery({
    /**
     * Query key for caching and invalidation
     * Only run the query if documentId is provided
     */
    queryKey: ["document", documentId],
    /**
     * Query function that calls the API to fetch a single document
     * Only fetch if documentId exists
     */
    queryFn: () => getDocument(documentId!),
    /**
     * Disable query if documentId is not provided
     */
    enabled: !!documentId,
  });

  /**
   * Handle errors by logging and calling user-provided callback
   */
  useEffect(() => {
    if (query.error && options?.onError) {
      console.error("Failed to fetch document:", query.error);
      options.onError(query.error);
    }
  }, [query.error, options]);

  return {
    /**
     * Document data
     */
    data: query.data,
    /**
     * Whether the query is currently loading
     */
    isLoading: query.isLoading,
    /**
     * Whether the query is currently fetching (including refetches)
     */
    isFetching: query.isFetching,
    /**
     * Error object if the query failed
     */
    error: query.error,
    /**
     * Whether the query has failed
     */
    isError: query.isError,
    /**
     * Whether the query has successfully fetched data
     */
    isSuccess: query.isSuccess,
    /**
     * Whether the query is currently in a loading state
     */
    isPending: query.isPending,
    /**
     * Function to manually refetch the data
     */
    refetch: query.refetch,
  };
}
