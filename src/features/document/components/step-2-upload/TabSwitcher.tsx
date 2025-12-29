/**
 * TabSwitcher Component
 *
 * Displays upload/create mode tab switcher for Step 2.
 * Extracted from step-2-upload.tsx for better organization and reusability.
 */

import React from "react";

interface TabSwitcherProps {
  uploadMode: "upload" | "create";
  setUploadMode: React.Dispatch<React.SetStateAction<"upload" | "create">>;
}

export function TabSwitcher({ uploadMode, setUploadMode }: TabSwitcherProps) {
  return (
    <div className="mb-6 flex gap-2 border-b">
      <button
        type="button"
        onClick={() => setUploadMode("upload")}
        className={`flex-1 pb-3 text-sm font-medium transition-colors ${
          uploadMode === "upload"
            ? "border-b-2 border-neutral-950 text-neutral-950"
            : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        Upload PDF
      </button>
      <button
        type="button"
        onClick={() => setUploadMode("create")}
        className={`flex-1 pb-3 text-sm font-medium transition-colors ${
          uploadMode === "create"
            ? "border-b-2 border-neutral-950 text-neutral-950"
            : "text-neutral-500 hover:text-neutral-700"
        }`}
      >
        Create New
      </button>
    </div>
  );
}
