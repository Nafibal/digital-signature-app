# System Architecture

## Overview

Digital Signature App is a full-stack web application built with a unified Next.js architecture. The system uses Next.js 15.5 for both frontend rendering and backend API routes, enabling tight integration between UI, authentication, and document workflows. Users authenticate with Better Auth, progress through a guided four-step document flow (Check, Upload/Fill, Add Signature, Final Review), preview PDFs in real time using PDF.js, place digital signatures via drag-and-drop, and save signed documents as PDFs using pdf-lib. PDF rendering and manipulation are handled server-side to ensure consistency and integrity.

## Components

- Frontend:

  - Next.js 15.5 (App Router)
  - React 19.1 with Server Components for data fetching and secure rendering
  - Client Components for editor, drag-and-drop, and signature interactions
  - TanStack Query 5 for async state management
  - React Hook Form 7 for multi-step workflow state
  - TipTap 3 for rich text editing
  - Radix UI for accessible UI components
  - Tailwind CSS 4 for styling

- API / Backend:

  - Next.js Route Handlers (API routes)
  - Better Auth 1.4 for authentication, session, and token handling
  - Business logic for document workflow, PDF generation, and signature embedding
  - Prisma 7 for database operations

- Database:

  - PostgreSQL (via Supabase)
  - Prisma ORM 7 for schema definition and querying
  - Tables for users, sessions, accounts, verifications, documents, document_contents, document_pdfs, and signatures

- Third-party services:
  - PDF.js 5 (pdfjs-dist) for browser-based PDF preview
  - pdf-lib for PDF manipulation and embedding signatures
  - Supabase Storage for file storage (PDFs and signature images)
  - Playwright for end-to-end testing

## Data Flow

1. User action
   The user logs in with Better Auth, creates/uploads a document, edits content (TipTap), previews the PDF (PDF.js), or places a signature.
2. Frontend request
   The frontend triggers API requests via TanStack Query to fetch profile data, save content, generate PDFs, or sign documents.
3. Backend processing
   API routes validate authentication (Better Auth), process document content, orchestrate PDF generation, and embed signatures using pdf-lib.
4. Database interaction
   Prisma persists user data, document states (including sub-steps), HTML content, PDF metadata, and signature positions.
5. Storage interaction
   Supabase Storage stores PDF files and signature images with proper user isolation via RLS policies.
6. Response to user
   The backend returns updated state or files, and the frontend updates the UI accordingly.

## Key Design Considerations

- Scalability:

  - Stateless API routes with Better Auth session management
  - Separation of UI state and persisted document state
  - Ability to scale backend horizontally if needed
  - Supabase Storage for scalable file storage

- Security:

  - Protected routes using Better Auth session validation
  - Row Level Security (RLS) policies on Supabase Storage buckets
  - No direct client-side access to sensitive document generation logic
  - Server-side PDF manipulation to prevent tampering

- Maintainability:
  - Clear separation between UI, API, and document logic
  - Feature-based architecture for easy navigation and scalability
  - Typed contracts using TypeScript and Prisma
  - Automated unit, integration, and end-to-end tests to protect critical flows
