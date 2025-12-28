import { FileText } from "lucide-react";
import { SignaturePosition } from "@/lib/types/document";

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
  return (
    <div className="relative rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
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
  );
}
