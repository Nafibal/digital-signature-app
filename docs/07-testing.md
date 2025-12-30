# Testing Strategy

## Testing Levels

### Unit Test

Unit tests validate isolated logic without involving browser rendering, network calls, or real persistence layers. These tests focus on deterministic behavior and fast feedback.

Covered areas:

- Workflow state transitions (step validation, blocking rules)
- Signature coordinate validation
- Form validation logic
- Utility functions (e.g. bounds checking, versioning)
- UUID validation

**Test Files:**

- `tests/unit/lib/helpers.test.ts` - Helper functions
- `tests/unit/lib/validators.test.ts` - Zod schema validation
- `tests/unit/features/document/types.test.ts` - Document type definitions
- `tests/unit/features/workflow/step-handlers.test.ts` - Workflow step handlers

---

### Integration Test

Integration tests validate the complete request-response cycle from API route handlers through service layer to database operations, with mocked authentication and database dependencies. These tests ensure that API endpoints work correctly when all components are wired together.

Covered areas:

- API endpoint authentication and authorization
- Request validation and error handling
- Service layer integration with mocked database
- Response format and status codes

**Test Files:**

- `tests/integration/api/documents/documents.integration.test.ts` - Document API endpoints (GET, POST, PATCH)

**Test Coverage:**

- GET /api/documents: Authentication, success cases, error handling
- POST /api/documents: Authentication, validation, success cases, error handling
- PATCH /api/documents/[id]: Authentication, authorization, success cases, error handling

**Test Helpers:**

- `tests/integration/helpers/api-helpers.ts` - API testing utilities
- `tests/integration/helpers/mock-auth.ts` - Mocked Better Auth
- `tests/integration/helpers/mock-db.ts` - Mocked Prisma client
- `tests/integration/fixtures/document-fixtures.ts` - Test data fixtures

---

### End-to-End Test (Playwright)

End-to-end tests validate real user behavior across UI, API, and persistence layers in a controlled environment. These tests ensure that critical flows work as expected when all components are wired together.

Covered areas:

- Authentication lifecycle (signup, login, logout)
- Full document workflow execution
- Document creation from blank template
- Document upload from existing PDF
- PDF preview rendering
- Signature drag-and-drop interaction
- Save signed PDF and review

**Test Files:**

- `tests/e2e/pages/auth/login.spec.ts` - Login flow
- `tests/e2e/pages/auth/signup.spec.ts` - Signup flow
- `tests/e2e/pages/document/creation.spec.ts` - Document creation flow
- `tests/e2e/dashboard/dashboard.spec.ts` - Dashboard functionality

**Test Helpers:**

- `tests/e2e/fixtures/auth.fixture.ts` - Auth test fixtures
- `tests/e2e/fixtures/document.fixture.ts` - Document test fixtures
- `tests/e2e/utils/selectors.ts` - Page selectors
- `tests/e2e/utils/test-data.ts` - Test data generators

---

## Test Scope

- Core business logic:

  - Authentication rules and session lifecycle (Better Auth)
  - Four-step workflow enforcement (with sub-steps)
  - Document content persistence (HTML)
  - Signature placement constraints (PDF and canvas coordinates)
  - PDF generation and embedding

- Critical user flows:
  - Signup → login → access profile
  - Create document from blank → complete 4-step workflow
  - Upload PDF → complete 4-step workflow
  - Edit content (TipTap) → preview PDF
  - Draw signature → drag & drop → sign PDF
  - Save signed PDF → final review

---

## Mapping to Acceptance Criteria

Each Acceptance Criteria defined in `02-requirements.md` must be covered by at least one automated test.

Mapping rules:

- Pure logic rules → Unit Test
- API endpoint integration → Integration Test
- UI + API + persistence flows → Instrumentation Test
- Critical paths → Always covered by Instrumentation Test

| FR ID | Feature                            | Unit Test Coverage                                                                     | Instrumentation Test Coverage                                                                |
| ----- | ---------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR-01 | User Authentication                | - Validate credential handling logic<br>- Session/token lifecycle helpers              | - Login with valid credentials<br>- Access protected route<br>- Logout invalidates session   |
| FR-02 | Four-Step Document Workflow        | - Prevent skipping steps<br>- Validate step order transitions                          | - User blocked when skipping step<br>- User completes steps sequentially                     |
| FR-03 | Document Content Editing           | - Editor state serialization/deserialization<br>- Content persistence logic            | - User edits content and reloads page<br>- Content remains consistent                        |
| FR-04 | PDF Live Preview                   | - PDF generation function (mocked input/output)<br>- Error handling on invalid content | - Preview updates after content edit<br>- Preview error shown on invalid state               |
| FR-05 | Signature Capture                  | - Signature image validation<br>- Empty signature prevention                           | - User draws signature<br>- Clearing signature resets canvas                                 |
| FR-06 | Drag & Drop Signature Placement    | - Coordinate bounds validation<br>- Resize & reposition logic                          | - Drag signature onto PDF<br>- Reject drop outside PDF bounds                                |
| FR-07 | Save Draft with Embedded Signature | - PDF embed function (mocked filesystem)<br>- Draft version increment logic            | - User signs document<br>- Save draft generates new PDF<br>- Reload shows embedded signature |
| FR-08 | Document State Persistence         | - Resume workflow step calculation<br>- Draft selection logic                          | - User exits mid-flow<br>- User resumes at correct step                                      |

---

## Tools

- Unit test:

  - Vitest 4
  - @testing-library/react 16
  - @testing-library/jest-dom 6
  - @testing-library/user-event 14

- Integration test:

  - Vitest 4
  - Mocked authentication (Better Auth)
  - Mocked database (Prisma)
  - Mocked storage (Supabase)

- End-to-end test:

  - Playwright 1.57 (@playwright/test)

---

## Testing Principles

- Prefer deterministic unit tests for business rules.
- Use end-to-end tests only for high-value user journeys.
- Avoid duplicating the same assertion across multiple levels.
- Tests must be readable, intention-revealing, and mapped to requirements.
- Mock external dependencies (database, storage, auth) for unit and integration tests.
- Use Playwright for realistic browser-based testing of critical user flows.
