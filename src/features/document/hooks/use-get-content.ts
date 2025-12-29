import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch document content
 * Uses TanStack Query for caching and automatic refetching
 */
export function useGetContent(documentId: string | null) {
  return useQuery({
    queryKey: ["document", documentId, "content"],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}/content`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch content");
      }

      return response.json();
    },
    enabled: !!documentId, // Only fetch when documentId exists
    staleTime: 1000 * 60 * 5, //5 minutes - consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, //10 minutes - keep in cache after unmount
  });
}
