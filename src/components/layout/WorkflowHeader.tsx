/**
 * Workflow Header Component
 *
 * Reusable header component for the document workflow.
 * Displays logo, user information, and sign out button.
 */

import { FileSignature, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkflowHeaderProps {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}

export function WorkflowHeader({
  userName,
  userEmail,
  onSignOut,
}: WorkflowHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
            <FileSignature className="h-5 w-5" />
          </div>
          <span>DigiSign.</span>
        </div>

        {/* User Info & Sign Out */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-neutral-100 md:flex">
              <User className="h-4 w-4 text-neutral-600" />
            </div>
            <span className="hidden text-sm font-medium text-neutral-700 md:block">
              {userName || userEmail}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
