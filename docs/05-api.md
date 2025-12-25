# API Contract

## Authentication
Auth method:
- Session-based authentication with JWT support via Auth.js (NextAuth v5)
- Access token stored in secure HTTP-only cookies
- Refresh token rotation handled server-side

---

## Endpoint List

### POST /api/auth/login
Request:
- email: string
- password: string

Response:
- user: object
  - id: string
  - email: string
  - name: string
- session: object
  - expiresAt: string (ISO date)

Errors:
- 401 Invalid credentials
- 400 Missing required fields

---

### POST /api/auth/logout
Request:
- (no body)

Response:
- success: boolean

Errors:
- 401 Not authenticated

---

### POST /api/auth/refresh
Request:
- refreshToken: string

Response:
- session: object
  - expiresAt: string (ISO date)

Errors:
- 401 Invalid or expired refresh token

---

### GET /api/auth/profile
Request:
- Authorization: Bearer token (or active session)

Response:
- id: string
- email: string
- name: string
- createdAt: string

Errors:
- 401 Not authenticated

---

### POST /api/documents
Description:
Create a new document and initialize workflow.

Request:
- title: string

Response:
- id: string
- title: string
- currentStep: number
- status: string

Errors:
- 401 Not authenticated
- 400 Validation error

---

### GET /api/documents/:id
Description:
Fetch document metadata and workflow state.

Request:
- documentId: string (path param)

Response:
- id: string
- title: string
- currentStep: number
- status: string

Errors:
- 401 Not authenticated
- 404 Document not found

---

### PUT /api/documents/:id/step
Description:
Update current workflow step.

Request:
- step: number (1-4)

Response:
- success: boolean
- currentStep: number

Errors:
- 400 Invalid step
- 401 Not authenticated
- 403 Forbidden

---

### PUT /api/documents/:id/content
Description:
Save document content (editor state).

Request:
- content: object (Tiptap JSON)

Response:
- success: boolean

Errors:
- 401 Not authenticated
- 400 Invalid content

---

### GET /api/documents/:id/preview
Description:
Generate and return PDF preview.

Request:
- (no body)

Response:
- PDF stream (application/pdf)

Errors:
- 401 Not authenticated
- 500 PDF generation failed

---

### POST /api/documents/:id/signatures
Description:
Create or update a signature placement.

Request:
- image: base64 string
- pageNumber: number
- posX: number
- posY: number
- width: number
- height: number

Response:
- signatureId: string

Errors:
- 401 Not authenticated
- 400 Invalid signature data

---

### GET /api/documents/:id/signatures
Description:
Fetch all signatures for a document.

Request:
- (no body)

Response:
- signatures: array

Errors:
- 401 Not authenticated

---

### POST /api/documents/:id/drafts
Description:
Generate and save a signed PDF draft.

Request:
- (no body)

Response:
- draftId: string
- version: number

Errors:
- 401 Not authenticated
- 500 PDF generation or save failed

---

### GET /api/documents/:id/drafts/latest
Description:
Fetch latest saved draft PDF.

Request:
- (no body)

Response:
- PDF stream (application/pdf)

Errors:
- 401 Not authenticated
- 404 Draft not found

---

## Error Handling Format
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message"
}

```

---

## Common Error Codes

|Error Code|HTTP Status|Description|
|---|---|---|
|AUTH_REQUIRED|401|Request requires authentication|
|INVALID_CREDENTIALS|401|Email or password is incorrect|
|TOKEN_EXPIRED|401|Access or refresh token has expired|
|TOKEN_INVALID|401|Token is malformed or invalid|
|FORBIDDEN|403|User does not have access to this resource|
|NOT_FOUND|404|Requested resource does not exist|
|VALIDATION_ERROR|400|Request payload failed validation|
|INVALID_WORKFLOW_STEP|400|Workflow step is invalid or out of order|
|DOCUMENT_NOT_READY|409|Document is not in a valid state for this action|
|PDF_GENERATION_FAILED|500|Failed to generate PDF|
|SIGNATURE_INVALID|400|Signature data or coordinates are invalid|
|DRAFT_SAVE_FAILED|500|Failed to save document draft|
|INTERNAL_SERVER_ERROR|500|Unhandled server error|