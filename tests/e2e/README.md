# E2E Tests for Digital Signature App

This directory contains end-to-end tests using Playwright for the Digital Signature App.

## Setup

### Prerequisites

1. Install Playwright browsers:

```bash
npx playwright install
```

2. Install Playwright types:

```bash
npm install -D @playwright/test
```

3. Ensure the development server can run:

```bash
npm run dev
```

### Test User

Create a test user in your database with the following credentials (or modify `tests/e2e/utils/test-data.ts`):

- Email: `test@example.com`
- Password: `Test123!@#`
- Name: `Test User`

## Running Tests

### Run all E2E tests

```bash
npm run test:e2e
```

### Run tests with UI (interactive mode)

```bash
npm run test:e2e:ui
```

### Run tests in debug mode

```bash
npm run test:e2e:debug
```

### Run tests in headed mode (visible browser)

```bash
npm run test:e2e:headed
```

### Run specific test file

```bash
npx playwright test tests/e2e/pages/auth/signup.spec.ts
```

### Run tests in specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

```
tests/e2e/
├── fixtures/
│   ├── auth.fixture.ts          # Authentication helpers
│   └── document.fixture.ts      # Document operation helpers
├── pages/
│   ├── auth/
│   │   ├── signup.spec.ts      # Signup flow tests
│   │   └── login.spec.ts       # Login flow tests
│   └── document/
│       └── creation.spec.ts    # Document creation workflow tests
├── dashboard/
│   └── dashboard.spec.ts       # Dashboard and document list tests
└── utils/
    ├── test-data.ts            # Test data generators
    └── selectors.ts            # Page selectors
```

## Test Coverage

### Authentication Tests

- User signup with valid credentials
- Validation errors for empty fields
- Validation errors for weak passwords
- Navigation between signup and login pages
- User login with valid credentials
- Validation errors for login
- Error handling for invalid credentials

### Document Workflow Tests

- Complete document creation workflow (all 4 steps)
- Step 1 validation (document details)
- Step 2 selection (create mode)
- Step 3a content filling
- Step 3b signature addition
- Step 4 final review and signing
- Navigation between workflow steps

### Dashboard Tests

- Display dashboard page
- Display document list
- Navigate to document creation page
- Navigate to existing documents
- Display empty state
- Display document status badges
- Display document type labels

## Configuration

The Playwright configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3000` (configurable via `BASE_URL` env var)
- **Browsers**: Chromium, Firefox, WebKit
- **Timeout**: 120s for web server startup
- **Retries**: 2 in CI, 0 locally
- **Reporters**: HTML, list, JSON
- **Trace**: On first retry
- **Screenshot**: Only on failure
- **Video**: Retain on failure

## Test Data

Test data is generated dynamically using `tests/e2e/utils/test-data.ts`:

- `generateTestEmail()` - Creates unique email with timestamp
- `generateDocumentTitle()` - Creates unique document title
- `generateDocumentType()` - Random document type
- `generateTestContent()` - Test content for editor
- `generateSignatureData()` - Test signature data

## Page Selectors

Reusable selectors are defined in `tests/e2e/utils/selectors.ts`:

- `authSelectors` - Authentication page selectors
- `dashboardSelectors` - Dashboard page selectors
- `documentSelectors` - Document workflow selectors
- `commonSelectors` - Common selectors

## Troubleshooting

### Tests fail to start

- Ensure development server is running: `npm run dev`
- Check that port 3000 is available
- Verify Playwright browsers are installed: `npx playwright install`

### Tests timeout

- Increase timeout in `playwright.config.ts`
- Check if database is responding
- Verify network connectivity

### Flaky tests

- Run tests multiple times to identify patterns
- Check for race conditions in the application
- Increase wait times in tests

### View test results

- Open `test-results/index.html` in a browser
- Check screenshots in `test-results/` directory
- Review video recordings in `test-results/` directory

## CI/CD Integration

To run E2E tests in CI/CD:

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    BASE_URL: http://localhost:3000
```

## Notes

- Tests run against the development server
- Database is NOT reset between test runs (manual cleanup required)
- Tests create real documents in the database
- Screenshots and videos are captured on failures
- Tests are designed to be independent and can run in parallel
