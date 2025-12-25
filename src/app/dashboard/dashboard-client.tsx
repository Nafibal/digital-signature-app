"use client";

import { signOut } from "@/lib/actions/auth-actions";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { User, LogOut, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentList from "./components/document-list";

type Session = typeof auth.$Infer.Session;

export default function DashboardClientPage({ session }: { session: Session }) {
  const router = useRouter();
  const user = session.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleCreateDocument = () => {
    // TODO: Navigate to document creation page
    console.log("Create new document");
  };

  const handleViewDocument = (id: string) => {
    // TODO: Navigate to document view page
    console.log("View document:", id);
  };

  const handleEditDocument = (id: string) => {
    // TODO: Navigate to document edit page
    console.log("Edit document:", id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
                {user.name || user.email}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <DocumentList
          onCreateDocument={handleCreateDocument}
          onViewDocument={handleViewDocument}
          onEditDocument={handleEditDocument}
        />
      </main>
    </div>
  );
}
