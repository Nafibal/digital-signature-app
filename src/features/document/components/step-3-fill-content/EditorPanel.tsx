import { RichTextEditorRef } from "../editor/RichTextEditor";
import RichTextEditor from "../editor/RichTextEditor";
import { Step3aFormData } from "../../types";

interface EditorPanelProps {
  editorRef: React.RefObject<RichTextEditorRef | null>;
  content: Step3aFormData;
  onEditorUpdate: (content: { html: string; json: unknown }) => void;
}

export default function EditorPanel({
  editorRef,
  content,
  onEditorUpdate,
}: EditorPanelProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Document Content
        </h3>
        <p className="text-sm text-neutral-600">
          Write or paste your document content here
        </p>
      </div>
      <RichTextEditor
        ref={editorRef}
        onUpdate={onEditorUpdate}
        initialContent={content.html || "<p>Start typing your document...</p>"}
      />
    </div>
  );
}
