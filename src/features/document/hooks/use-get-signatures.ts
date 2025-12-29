import { useQuery } from "@tanstack/react-query";

/**
 * Signature response from API
 */
export interface SignatureResponse {
  id: string;
  imagePath: string;
  publicUrl: string;
  posX: number; // PDF coordinates
  posY: number; // PDF coordinates
  canvasPosX: number | null; // Canvas coordinates
  canvasPosY: number | null; // Canvas coordinates
  width: number;
  height: number;
  signerName: string;
  signerPosition: string | null;
  organization: string | null;
  pageNumber: number;
  createdAt: string;
}

/**
 * Props for useGetSignatures hook
 */
interface UseGetSignaturesProps {
  documentId: string | null;
}

/**
 * Fetch signatures for a document
 *
 * This hook fetches all signatures for a given document ID.
 * The API returns signatures sorted by createdAt DESC (most recent first).
 *
 * @param documentId - The document ID to fetch signatures for
 * @returns Query result with signatures array
 */
export function useGetSignatures({ documentId }: UseGetSignaturesProps) {
  return useQuery<SignatureResponse[]>({
    queryKey: ["signatures", documentId],
    queryFn: async () => {
      if (!documentId) return [];

      const response = await fetch(`/api/documents/${documentId}/signature`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch signatures");
      }

      const data = await response.json();
      return data.signatures || [];
    },
    enabled: !!documentId,
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: false,
  });
}
