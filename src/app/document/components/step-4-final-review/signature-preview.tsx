import { CheckCircle2 } from "lucide-react";
import { SignaturePosition } from "@/lib/types/document";

interface SignaturePreviewProps {
  signature: string | null;
  signaturePosition: SignaturePosition;
}

export default function SignaturePreview({
  signature,
  signaturePosition,
}: SignaturePreviewProps) {
  return (
    <>
      {signature && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900">
                Signature Added
              </p>
              <p className="mt-1 text-sm text-green-700">
                Your signature has been successfully placed on document
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-green-600">Position:</span>
                <span className="text-xs font-medium text-green-800">
                  X: {Math.round(signaturePosition.x)}, Y:{" "}
                  {Math.round(signaturePosition.y)}, Page:{" "}
                  {signaturePosition.page}
                </span>
              </div>
            </div>
            <img
              src={signature}
              alt="Signature Preview"
              className="h-16 w-auto rounded border border-green-200 bg-white p-2"
            />
          </div>
        </div>
      )}
    </>
  );
}
