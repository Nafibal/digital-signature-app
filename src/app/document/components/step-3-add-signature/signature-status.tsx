import { CheckCircle2 } from "lucide-react";

interface SignatureStatusProps {
  signatureImage: string | null;
}

export default function SignatureStatus({
  signatureImage,
}: SignatureStatusProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-4 ${
        signatureImage
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-neutral-200 bg-neutral-50 text-neutral-600"
      }`}
    >
      {signatureImage ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-neutral-300" />
      )}
      <div className="text-sm">
        {signatureImage ? (
          <span>
            Signature created. Drag it to position on the PDF, then click Save
            Signature.
          </span>
        ) : (
          <span>Please fill in all three fields to create your signature.</span>
        )}
      </div>
    </div>
  );
}
