import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { SignaturePosition } from "../../types";

interface PdfPreviewSectionProps {
  signature: string | null;
  signaturePosition: SignaturePosition;
  finalPdfUrl: string;
  onDownload: () => void;
}

export default function PdfPreviewSection({
  signature,
  signaturePosition,
  finalPdfUrl,
  onDownload,
}: PdfPreviewSectionProps) {
  const hasSignedPdf = finalPdfUrl && finalPdfUrl.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Document Preview</h3>
        {hasSignedPdf && (
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle2 className="h-4 w-4" />
            Signed
          </div>
        )}
      </div>

      <div className="relative rounded-lg border border-neutral-200 overflow-hidden">
        {hasSignedPdf ? (
          // Display signed PDF (signature already embedded)
          <iframe
            src={finalPdfUrl}
            className="w-full min-h-[600px]"
            title="Signed Document"
          />
        ) : (
          // Display original PDF with signature overlay (fallback)
          <div className="relative bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-neutral-400">
              <FileText className="h-24 w-24" />
              <div className="text-center">
                <p className="text-lg font-medium">Final PDF Preview</p>
                <p className="text-sm">Your signed document will appear here</p>
              </div>
            </div>

            {/* Signature Placement Indicator */}
            {signature && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-50 p-2 shadow-md"
                style={{
                  left: `${signaturePosition.x}px`,
                  top: `${signaturePosition.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <img src={signature} alt="Signature" className="h-16 w-auto" />
              </div>
            )}
          </div>
        )}
      </div>

      {!hasSignedPdf && (
        <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            PDF not yet signed. Please sign your PDF in Step 3.2.
          </p>
        </div>
      )}
    </div>
  );
}
