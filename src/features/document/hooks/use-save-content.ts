import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SaveContentVariables {
  documentId: string;
  htmlContent: string;
}

export function useSaveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, htmlContent }: SaveContentVariables) => {
      const response = await fetch(`/api/documents/${documentId}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save content");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate document content query
      queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId, "content"],
      });
    },
  });
}
