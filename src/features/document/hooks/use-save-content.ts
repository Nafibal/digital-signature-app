import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveDocumentContent } from "@/lib/api/content";

interface SaveContentVariables {
  documentId: string;
  htmlContent: string;
}

export function useSaveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, htmlContent }: SaveContentVariables) =>
      saveDocumentContent(documentId, htmlContent),
    onSuccess: (data, variables) => {
      // Invalidate document content query
      queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId, "content"],
      });
    },
  });
}
