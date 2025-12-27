import { useMutation } from "@tanstack/react-query";
import { generatePDFPreview } from "@/lib/api/content";

interface GeneratePreviewVariables {
  documentId: string;
  tiptapJson: Record<string, unknown>;
}

export function useGeneratePreview() {
  return useMutation({
    mutationFn: ({ documentId, tiptapJson }: GeneratePreviewVariables) =>
      generatePDFPreview(documentId, tiptapJson),
  });
}
