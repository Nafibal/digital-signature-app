import { Step3bFormData } from "../../types";

interface SignaturePreviewProps {
  signatureData: Step3bFormData | null;
  signatureImage: string | null;
}

export default function SignaturePreview({
  signatureData,
  signatureImage,
}: SignaturePreviewProps) {
  return (
    <>
      {signatureData && signatureImage && (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-2 text-sm font-medium text-neutral-700">
            Signature Preview:
          </p>
          <img
            src={signatureImage}
            alt="Signature preview"
            className="w-full rounded border border-neutral-300"
          />
        </div>
      )}
    </>
  );
}
