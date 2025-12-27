import { useQuery } from "@tanstack/react-query";
import { getDocumentContent } from "@/lib/api/content";

/**
 * Hook to fetch document content
 * Uses TanStack Query for caching and automatic refetching
 */
export function useGetContent(documentId: string | null) {
  return useQuery({
    queryKey: ["document", documentId, "content"],
    queryFn: () => getDocumentContent(documentId!),
    enabled: !!documentId, // Only fetch when documentId exists
    staleTime: 1000 * 60 * 5, // 5 minutes - consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache after unmount
  });
}
