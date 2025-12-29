/**
 * LoadingState Component
 *
 * Reusable component for displaying loading states.
 * Supports both full-screen and inline variants.
 */

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = "Loading...",
  fullScreen = false,
}: LoadingStateProps) {
  const containerClass = fullScreen
    ? "min-h-screen bg-white flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto" />
        <p className="text-neutral-600">{message}</p>
      </div>
    </div>
  );
}
