import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SignPdfRequest {
  documentId: string;
  documentPdfId: string;
  signatureImage: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface SignPdfResponse {
  success: boolean;
  signedPdf: {
    id: string;
    documentId: string;
    pdfPath: string;
    fileName: string;
    fileSize: number;
    pageCount: number;
    status: string;
    publicUrl: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function useSignPdf() {
  const queryClient = useQueryClient();

  return useMutation<SignPdfResponse, Error, SignPdfRequest>({
    mutationFn: async (data) => {
      const response = await fetch(
        `/api/documents/${data.documentId}/sign-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentPdfId: data.documentPdfId,
            signatureImage: data.signatureImage,
            position: data.position,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign PDF");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate document queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId],
      });
    },
  });
}
