# Project Overview

## Project Name

Digital Signature App

## Summary

Digital Signature App is a web-based document workflow system that enables users to securely create, review, and digitally sign PDF documents in a structured multi-step process. The application focuses on document integrity, traceability, and usability by providing live PDF previews, drag-and-drop signature placement, draft saving, and authenticated access, making it suitable for formal and regulated document processes.

## Target Users

- Primary:
  - Internal staff or officers responsible for preparing, reviewing, and signing official documents
  - Managers or approvers who need to digitally sign documents
- Secondary:
  - IT or operations teams managing document workflows
  - Auditors or reviewers who need access to signed document drafts and history

## Tech Stack

- Frontend:
  - Next.js 15
  - TypeScript
  - React Hook Form
  - TanStack Query
- Backend:
  - Next.js Route Handlers (API Routes)
  - Better Auth
- Database:
  - PostgreSQL
  - Prisma ORM
- Infrastructure:
  - Node.js runtime
  - Server-side PDF processing
- Third-party services:
  - PDF.js (pdfjs-dist) for PDF preview
  - pdf-lib for PDF manipulation and signature embedding
  - Playwright for PDF generation and end-to-end testing

## Core Value Proposition

The application combines a guided multi-step workflow with real-time PDF preview and intuitive drag-and-drop digital signing, reducing errors and manual back-and-forth in document approval processes. Unlike generic e-sign tools, it emphasizes draft control, technical justification workflows, and testable, auditable system behavior suitable for enterprise or government use cases.

## Documentation Map

- PRD → 01-prd.md
- Requirements → 02-requirements.md
- Architecture → 03-architecture.md
- Database → 04-database.md
- API → 05-api.md
- UX → 06-ux.md
- Testing → 07-testing.md
- Deployment → 08-deployment.md
- Decisions → 09-decisions.md

