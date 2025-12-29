/**
 * Page Selectors
 *
 * Reusable selectors for common page elements
 */

// Authentication page selectors
export const authSelectors = {
  signupPage: {
    nameInput: 'input[name="name"]',
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    loginLink: 'a[href="/login"]',
  },
  loginPage: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    signupLink: 'a[href="/signup"]',
  },
};

// Dashboard page selectors
export const dashboardSelectors = {
  pageTitle: "h1",
  createDocumentButton: 'button:has-text("Create Document")',
  documentList: '[data-testid="document-list"]',
  documentCard: '[data-testid="document-card"]',
  documentTitle: '[data-testid="document-title"]',
  documentStatus: '[data-testid="document-status"]',
  documentType: '[data-testid="document-type"]',
  emptyState: '[data-testid="empty-state"]',
};

// Document workflow selectors
export const documentSelectors = {
  // Step 1: Document details
  step1: {
    titleInput: 'input[name="title"]',
    documentTypeSelect: 'select[name="documentType"]',
    descriptionTextarea: 'textarea[name="description"]',
    nextButton: 'button:has-text("Next")',
    previousButton: 'button:has-text("Previous")',
  },
  // Step 2: Upload/Create
  step2: {
    tabSwitcher: '[data-testid="tab-switcher"]',
    createModeTab: 'button:has-text("Create from blank")',
    uploadModeTab: 'button:has-text("Upload PDF")',
    nextButton: 'button:has-text("Next")',
    previousButton: 'button:has-text("Previous")',
  },
  // Step 3a: Fill content
  step3a: {
    editor: '[contenteditable="true"]',
    toolbar: '[data-testid="editor-toolbar"]',
    boldButton: 'button[title="Bold"]',
    italicButton: 'button[title="Italic"]',
    underlineButton: 'button[title="Underline"]',
    nextButton: 'button:has-text("Next")',
    previousButton: 'button:has-text("Previous")',
  },
  // Step 3b: Add signature
  step3b: {
    organizationInput: 'input[name="organization"]',
    signerNameInput: 'input[name="signerName"]',
    positionInput: 'input[name="position"]',
    signatureCanvas: '[data-testid="signature-canvas"]',
    clearButton: 'button:has-text("Clear")',
    saveButton: 'button:has-text("Save Signature")',
    pdfPreview: '[data-testid="pdf-preview"]',
    nextButton: 'button:has-text("Next")',
    previousButton: 'button:has-text("Previous")',
  },
  // Step 4: Final review
  step4: {
    documentSummary: '[data-testid="document-summary"]',
    pdfPreview: '[data-testid="pdf-preview"]',
    signedPdfPreview: '[data-testid="signed-pdf-preview"]',
    signDocumentButton: 'button:has-text("Sign Document")',
    backButton: 'button:has-text("Back")',
    successMessage: '[data-testid="success-message"]',
  },
  // Workflow navigation
  workflowNavigation: {
    stepIndicator: '[data-testid="step-indicator"]',
    currentStep: '[data-testid="current-step"]',
    completedStep: '[data-testid="completed-step"]',
  },
};

// Common selectors
export const commonSelectors = {
  loadingSpinner: '[data-testid="loading-spinner"]',
  errorMessage: '[data-testid="error-message"]',
  successMessage: '[data-testid="success-message"]',
  navigation: {
    homeLink: 'a[href="/"]',
    dashboardLink: 'a[href="/dashboard"]',
    profileLink: 'a[href="/profile"]',
    logoutButton: 'button:has-text("Logout")',
  },
};
