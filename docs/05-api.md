# API Contract

## Authentication

Auth method:

- Session-based authentication with Better Auth
- Session stored in secure HTTP-only cookies
- Better Auth handles session management automatically

All API endpoints require authentication via Better Auth session validation.

---

## Endpoint List

### Authentication Endpoints

#### POST /api/auth/[...all]

Description:
Better Auth handles authentication (signup, login, logout, session management) through this catch-all route.

**Note**: This endpoint is managed by Better Auth and handles multiple auth operations automatically.

---

### Document Endpoints

#### POST /api/documents

Description:
Create a new document and initialize workflow.

Request:

- title: string (required)
- description: string (optional)
- documentType: string (optional, default: "contract")

Response:

```json
{
  "id": "uuid",
  "ownerId": "string",
  "title": "string",
  "description": "string",
  "documentType": "string",
  "currentStep": 1,
  "subStep": null,
  "status": "draft",
  "sourceType": null,
  "pdfPath": null,
  "currentContentId": null,
  "currentPdfId": null,
  "signedPdfId": null,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

Errors:

- 401 Unauthorized
- 400 Validation error
- 500 Internal server error

---

#### GET /api/documents

Description:
Fetch all documents belonging to the authenticated user.

Request:

- (no body)

Response:

```json
{
  "documents": [
    {
      "id": "uuid",
      "ownerId": "string",
      "title": "string",
      "description": "string | null",
      "documentType": "string | null",
      "currentStep": number,
      "subStep": "number | null",
      "status": "draft | signed",
      "sourceType": "string | null",
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ]
}
```

Errors:

- 401 Unauthorized
- 500 Internal server error

---

#### PATCH /api/documents/:id

Description:
Update document metadata (title, description, documentType, currentStep, subStep, status).

Request:

- title: string (optional)
- description: string (optional)
- documentType: string (optional)
- currentStep: number (optional)
- subStep: number (optional)
- status: string (optional)

Response:

```json
{
  "id": "uuid",
  "title": "string",
  "currentStep": number,
  "subStep": "number | null",
  "status": "string"
}
```

Errors:

- 401 Unauthorized
- 404 Document not found
- 500 Internal server error

---

#### GET /api/documents/:id/content

Description:
Fetch current document content (HTML) for a document.

Request:

- (no body)

Response:

```json
{
  "id": "uuid",
  "documentId": "uuid",
  "htmlContent": "string",
  "version": 1,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

Errors:

- 401 Unauthorized
- 400 Invalid document ID format
- 404 Document not found
- 500 Internal server error

---

#### POST /api/documents/:id/content

Description:
Save document content (HTML from TipTap editor).

Request:

```json
{
  "htmlContent": "string"
}
```

Response:

```json
{
  "id": "uuid",
  "documentId": "uuid",
  "htmlContent": "string",
  "version": number,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

Errors:

- 401 Unauthorized
- 400 Invalid document ID format or missing htmlContent
- 404 Document not found
- 500 Internal server error

---

#### POST /api/documents/:id/generate-pdf

Description:
Generate PDF from HTML content and upload to Supabase Storage.

Request:

- (no body)

Response:

```json
{
  "pdfId": "uuid",
  "documentId": "uuid",
  "pdfPath": "string",
  "fileName": "string",
  "fileSize": number,
  "pageCount": number,
  "status": "ready",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

Errors:

- 401 Unauthorized
- 404 Document not found or no content
- 500 PDF generation or upload failed

---

#### GET /api/documents/:id/pdf/:pdfId

Description:
Fetch PDF file from Supabase Storage.

Request:

- (no body)

Response:

- PDF file stream (application/pdf)

Errors:

- 401 Unauthorized
- 404 PDF not found
- 500 Internal server error

---

#### POST /api/documents/:id/sign-pdf

Description:
Embed signature into PDF and create signed version.

Request:

```json
{
  "signatureImage": "base64 string",
  "position": {
    "pageNumber": number,
    "posX": number,
    "posY": number,
    "canvasPosX": number,
    "canvasPosY": number,
    "width": number,
    "height": number
  }
}
```

Response:

```json
{
  "signatureId": "uuid",
  "documentId": "uuid",
  "signedPdfId": "uuid",
  "signedPdfPath": "string"
}
```

Errors:

- 401 Unauthorized
- 400 Invalid document ID format or missing required fields
- 404 Document not found or has no PDF to sign
- 500 Internal server error

---

### File Upload Endpoints

#### POST /api/upload

Description:
Upload a PDF file to Supabase Storage.

Request:

- FormData with "file" field (multipart/form-data)

Constraints:

- File type: application/pdf
- File size: Maximum 10MB

Response:

```json
{
  "filePath": "string",
  "fullPath": "string",
  "fileName": "string",
  "fileSize": number
}
```

Errors:

- 401 Unauthorized
- 400 No file provided
- 400 Only PDF files are allowed
- 400 File size exceeds 10MB limit
- 500 Internal server error

---

### PDF Rendering Endpoints

#### POST /api/render-pdf

Description:
Render PDF from HTML content for preview purposes.

Request:

```json
{
  "html": "string"
}
```

Response:

- PDF stream (application/pdf)

Errors:

- 400 Invalid HTML
- 500 PDF generation failed

---

## Error Handling Format

```json
{
  "message": "Human readable message",
  "errors": {
    "field": ["error message"]
  }
}
```

---

## Common Error Codes

| Error Code            | HTTP Status | Description                                         |
| --------------------- | ----------- | --------------------------------------------------- |
| UNAUTHORIZED          | 401         | Request requires authentication                     |
| INVALID_DOCUMENT_ID   | 400         | Document ID is not a valid UUID                     |
| DOCUMENT_NOT_FOUND    | 404         | Document does not exist or user doesn't have access |
| VALIDATION_ERROR      | 400         | Request payload failed validation                   |
| NO_FILE_PROVIDED      | 400         | No file provided in upload request                  |
| INVALID_FILE_TYPE     | 400         | File type is not PDF                                |
| FILE_TOO_LARGE        | 400         | File size exceeds limit                             |
| PDF_GENERATION_FAILED | 500         | Failed to generate PDF                              |
| SIGNATURE_REQUIRED    | 400         | Signature image is required                         |
| POSITION_REQUIRED     | 400         | Signature position is required                      |
| INTERNAL_SERVER_ERROR | 500         | Unhandled server error                              |
