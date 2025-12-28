import { CheckCircle2 } from "lucide-react";

export default function CompletionChecklist() {
  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-sm font-semibold text-neutral-900">Review Checklist</p>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm text-neutral-700">
            Document content reviewed
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm text-neutral-700">
            Signature captured and positioned
          </span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm text-neutral-700">All details verified</span>
        </div>
      </div>
    </div>
  );
}
