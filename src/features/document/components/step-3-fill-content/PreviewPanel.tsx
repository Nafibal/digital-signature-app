import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Loader2, AlertCircle } from "lucide-react";

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
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>PDF Preview</CardTitle>
            <CardDescription>
              Click Preview to generate PDF from your content
            </CardDescription>
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
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {isGeneratingPreview && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-neutral-400 mx-auto mb-4" />
              <p className="text-sm text-neutral-600">
                Generating PDF preview...
              </p>
            </div>
          </div>
        )}

        {previewError && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-sm font-medium text-red-900 mb-2">
                Preview Failed
              </p>
              <p className="text-sm text-red-700">{previewError}</p>
            </div>
          </div>
        )}

        {!isGeneratingPreview && !previewError && !previewUrl && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-24 w-24 text-neutral-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-neutral-900 mb-2">
                No Preview Generated
              </p>
              <p className="text-sm text-neutral-600 mb-4">
                Click the Preview button to see how your document will look as a
                PDF
              </p>
            </div>
          </div>
        )}

        {previewUrl && !isGeneratingPreview && !previewError && (
          <iframe
            src={previewUrl}
            className="w-full h-full min-h-[600px] border-0 rounded-lg"
            title="PDF Preview"
          />
        )}
      </CardContent>
    </Card>
  );
}
