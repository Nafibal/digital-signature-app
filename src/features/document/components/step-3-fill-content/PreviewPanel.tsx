import { Button } from "@/components/ui/button";
import { Eye, Loader2, AlertCircle } from "lucide-react";
import PdfCanvasPreview from "../pdf/PdfCanvasPreview";

interface PreviewPanelProps {
  previewUrl: string | null;
  isGeneratingPreview: boolean;
  previewError: string | null;
  onPreview: () => void;
  documentId: string | null;
}

export default function PreviewPanel({
  previewUrl,
  isGeneratingPreview,
  previewError,
  onPreview,
  documentId,
}: PreviewPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">PDF Preview</h3>
          <p className="text-sm text-neutral-600">
            Click Preview to generate PDF from your content
          </p>
        </div>
        <Button
          onClick={onPreview}
          disabled={isGeneratingPreview || !documentId}
          className="gap-2"
        >
          {isGeneratingPreview ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview
            </>
          )}
        </Button>
      </div>

      {isGeneratingPreview && (
        <div className="flex-1 flex items-center justify-center rounded-lg border border-neutral-200 bg-white min-h-[600px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-neutral-400 mx-auto mb-4" />
            <p className="text-sm text-neutral-600">
              Generating PDF preview...
            </p>
          </div>
        </div>
      )}

      {previewError && (
        <div className="flex-1 flex items-center justify-center rounded-lg border border-neutral-200 bg-white min-h-[600px]">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm font-medium text-red-900 mb-2">
              Preview Failed
            </p>
            <p className="text-sm text-red-700">{previewError}</p>
          </div>
        </div>
      )}

      {!isGeneratingPreview && !previewError && previewUrl && (
        <PdfCanvasPreview
          pdfUrl={previewUrl}
          title="PDF Preview"
          description="Preview your document"
          showPageNavigation={true}
        />
      )}
    </div>
  );
}
