/**
 * StatusMessage Component
 *
 * Reusable component for displaying loading, success, and error messages.
 * Provides consistent styling and behavior across the application.
 */

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export type StatusMessageType = "loading" | "success" | "error";

interface StatusMessageProps {
  type: StatusMessageType;
  message: string;
  description?: string;
}

export function StatusMessage({
  type,
  message,
  description,
}: StatusMessageProps) {
  const icons = {
    loading: <Loader2 className="h-5 w-5 animate-spin" />,
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5 shrink-0" />,
  };

  const colors = {
    loading: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    success: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
    error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-3 ${colors[type]}`}
    >
      {icons[type]}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        {description && (
          <p className="text-xs text-red-600 dark:text-red-300">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
