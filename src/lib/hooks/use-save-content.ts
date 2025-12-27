import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveDocumentContent } from "@/lib/api/content";

interface SaveContentVariables {
  documentId: string;
  contentJson: Record<string, unknown>;
  htmlContent?: string; // Optional for backward compatibility
}

export function useSaveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      contentJson,
      htmlContent,
    }: SaveContentVariables) =>
      saveDocumentContent(documentId, contentJson, htmlContent),
    onSuccess: (data, variables) => {
      // Invalidate document content query
      queryClient.invalidateQueries({
        queryKey: ["document", variables.documentId, "content"],
      });
    },
  });
}
