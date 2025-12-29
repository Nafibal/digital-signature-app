/**
 * Test Data Generators
 *
 * Helper functions to generate unique test data for E2E tests
 */

/**
 * Generate a unique email address for testing
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
}

/**
 * Generate a unique document title for testing
 */
export function generateDocumentTitle(): string {
  const timestamp = Date.now();
  return `Test Document ${timestamp}`;
}

/**
 * Generate test user credentials
 */
export const TEST_USER = {
  email: "test@example.com",
  password: "Test123!@#",
  name: "Test User",
};

/**
 * Generate random document type
 */
export function generateDocumentType(): string {
  const types = ["contract", "nda", "invoice", "other"];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Generate test content for rich text editor
 */
export function generateTestContent(): string {
  return `<p>This is a test document created at ${new Date().toISOString()}.</p>
<p><strong>Important terms:</strong></p>
<ul>
<li>Term 1: This is the first term</li>
<li>Term 2: This is the second term</li>
<li>Term 3: This is the third term</li>
</ul>
<p><em>This document is for testing purposes only.</em></p>`;
}

/**
 * Generate signature data
 */
export function generateSignatureData() {
  return {
    organization: "Test Organization",
    signerName: "John Doe",
    position: "Manager",
  };
}
