import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SignatureSaveButtonProps {
  signatureImage: string | null;
  isSaving: boolean;
  onSave: () => void;
  saveError: string | null;
}

export default function SignatureSaveButton({
  signatureImage,
  isSaving,
  onSave,
  saveError,
}: SignatureSaveButtonProps) {
  return (
    <>
      {signatureImage && (
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Signature"
          )}
        </Button>
      )}

      {saveError && <p className="text-sm text-red-500">{saveError}</p>}
    </>
  );
}
