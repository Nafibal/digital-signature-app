# System Architecture

## Overview

Digital Signature App is a full-stack web application built with a unified Next.js architecture. The system uses Next.js for both frontend rendering and backend API routes, enabling tight integration between UI, authentication, and document workflows. Users authenticate, progress through a guided multi-step document flow, preview PDFs in real time, place digital signatures via drag-and-drop, and save signed documents as drafts. PDF rendering and manipulation are handled server-side to ensure consistency and integrity.

## Components

- Frontend:

  - Next.js 15 (App Router)
  - Server Components for data fetching and secure rendering
  - Client Components for editor, drag-and-drop, and signature interactions
  - TanStack Query for async state management
  - React Hook Form for multi-step workflow state

- API / Backend:

  - Next.js Route Handlers (API routes)
  - Better Auth for authentication, session, and token handling
  - Business logic for document workflow, draft saving, and PDF generation

- Database:

  - PostgreSQL
  - Prisma ORM for schema definition and querying
  - Tables for users, sessions, documents, drafts, and signatures

- Third-party services:
  - pdfjs-dist for browser-based PDF preview
  - pdf-lib for PDF manipulation and embedding signatures
  - Tiptap for rich text editing
  - Playwright for HTML-to-PDF rendering and end-to-end testing

## Data Flow

1. User action  
   The user logs in, edits document content, previews the PDF, or places a signature.
2. Frontend request  
   The frontend triggers API requests via TanStack Query to fetch profile data, save drafts, or generate PDFs.
3. Backend processing  
   API routes validate authentication, process document content, and orchestrate PDF generation or updates.
4. Database interaction  
   Prisma persists user data, document states, draft metadata, and signature positions.
5. Response to user  
   The backend returns updated state or files, and the frontend updates the UI accordingly.

## Key Design Considerations

- Scalability:

  - Stateless API routes with token-based authentication
  - Separation of UI state and persisted document state
  - Ability to scale backend horizontally if needed

- Security:

  - Protected routes using Auth.js session validation
  - No direct client-side access to sensitive document generation logic
  - Server-side PDF manipulation to prevent tampering

- Maintainability:
  - Clear separation between UI, API, and document logic
  - Typed contracts using TypeScript and Prisma
  - Automated unit and instrumentation tests to protect critical flows

