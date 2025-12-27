/**
 * useGetAllDocuments Hook
 *
 * Custom hook for fetching all documents using TanStack Query's useQuery.
 * Handles document fetching with proper state management and caching.
 */

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllDocuments, Document } from "@/lib/api/documents";

interface UseGetAllDocumentsOptions {
  /**
   * Callback function called when document fetching fails
   */
  onError?: (error: Error) => void;
}

/**
 * Hook for fetching all documents
 *
 * @param options - Optional callbacks for error states
 * @returns Query object with state and data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useGetAllDocuments({
 *   onError: (error) => console.error('Failed:', error.message)
 * });
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <DocumentList documents={data} />;
 * ```
 */
export function useGetAllDocuments(options?: UseGetAllDocumentsOptions) {
  const query = useQuery({
    /**
     * Query key for caching and invalidation
     */
    queryKey: ["documents"],

    /**
     * Query function that calls the API to fetch all documents
     */
    queryFn: getAllDocuments,
  });

  /**
   * Handle errors by logging and calling user-provided callback
   */
  useEffect(() => {
    if (query.error && options?.onError) {
      console.error("Failed to fetch documents:", query.error);
      options.onError(query.error);
    }
  }, [query.error, options]);

  return {
    /**
     * Array of documents
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
