# Testing Strategy

## Testing Levels

### Unit Test
Unit tests validate isolated logic without involving browser rendering, network calls, or real persistence layers. These tests focus on deterministic behavior and fast feedback.

Covered areas:
- Workflow state transitions (step validation, blocking rules)
- Signature coordinate validation
- PDF generation helpers (mocked)
- Form validation logic
- Utility functions (e.g. bounds checking, versioning)

---

### Instrumentation Test
Instrumentation tests (end-to-end–style) validate real user behavior across UI, API, and persistence layers in a controlled environment. These tests ensure that critical flows work as expected when all components are wired together.

Covered areas:
- Authentication lifecycle (login → refresh → logout)
- Full document workflow execution
- PDF preview rendering
- Signature drag-and-drop interaction
- Save draft and resume draft behavior

---

## Test Scope

- Core business logic:
  - Authentication rules and session lifecycle
  - Four-step workflow enforcement
  - Document content persistence
  - Signature placement constraints
  - Draft version creation

- Critical user flows:
  - Login → access profile
  - Create document → complete 4-step workflow
  - Edit content → preview PDF
  - Draw signature → drag & drop → save draft
  - Resume saved draft and verify integrity

---

## Mapping to Acceptance Criteria

Each Acceptance Criteria defined in `02-requirements.md` must be covered by at least one automated test.

Mapping rules:
- Pure logic rules → Unit Test
- UI + API + persistence flows → Instrumentation Test
- Critical paths → Always covered by Instrumentation Test

| FR ID | Feature | Unit Test Coverage | Instrumentation Test Coverage |
|------|---------|-------------------|-------------------------------|
| FR-01 | User Authentication | - Validate credential handling logic<br>- Session/token lifecycle helpers | - Login with valid credentials<br>- Access protected route<br>- Logout invalidates session |
| FR-02 | Four-Step Document Workflow | - Prevent skipping steps<br>- Validate step order transitions | - User blocked when skipping step<br>- User completes steps sequentially |
| FR-03 | Document Content Editing | - Editor state serialization/deserialization<br>- Content persistence logic | - User edits content and reloads page<br>- Content remains consistent |
| FR-04 | PDF Live Preview | - PDF generation function (mocked input/output)<br>- Error handling on invalid content | - Preview updates after content edit<br>- Preview error shown on invalid state |
| FR-05 | Signature Capture | - Signature image validation<br>- Empty signature prevention | - User draws signature<br>- Clearing signature resets canvas |
| FR-06 | Drag & Drop Signature Placement | - Coordinate bounds validation<br>- Resize & reposition logic | - Drag signature onto PDF<br>- Reject drop outside PDF bounds |
| FR-07 | Save Draft with Embedded Signature | - PDF embed function (mocked filesystem)<br>- Draft version increment logic | - User signs document<br>- Save draft generates new PDF<br>- Reload shows embedded signature |
| FR-08 | Document State Persistence | - Resume workflow step calculation<br>- Draft selection logic | - User exits mid-flow<br>- User resumes at correct step |


---

## Tools

- Unit test:
  - Vitest
  - @testing-library/react
  - @testing-library/jest-dom

- Instrumentation test:
  - Playwright (@playwright/test)

---

## Testing Principles

- Prefer deterministic unit tests for business rules.
- Use instrumentation tests only for high-value user journeys.
- Avoid duplicating the same assertion across multiple levels.
- Tests must be readable, intention-revealing, and mapped to requirements.