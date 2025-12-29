import { test as base } from "@playwright/test";
import { documentSelectors } from "../utils/selectors";
import {
  generateDocumentTitle,
  generateDocumentType,
  generateTestContent,
  generateSignatureData,
} from "../utils/test-data";

/**
 * Document Fixture
 *
 * Provides helper methods for document operations in tests
 */
export const documentTest = base.extend<{
  createDocumentFromBlank: () => Promise<void>;
  fillDocumentDetails: (
    title: string,
    type: string,
    description: string
  ) => Promise<void>;
  fillDocumentContent: (content: string) => Promise<void>;
  addSignature: () => Promise<void>;
  signDocument: () => Promise<void>;
}>({
  // Helper to create a document from blank
  createDocumentFromBlank: async ({ page }, use) => {
    const create = async () => {
      const title = generateDocumentTitle();
      const type = generateDocumentType();
      const description = "Test document description";

      // Step 1: Fill document details
      await page.fill(documentSelectors.step1.titleInput, title);
      await page.selectOption(documentSelectors.step1.documentTypeSelect, type);
      await page.fill(documentSelectors.step1.descriptionTextarea, description);
      await page.click(documentSelectors.step1.nextButton);

      // Step 2: Select create mode
      await page.click(documentSelectors.step2.createModeTab);
      await page.click(documentSelectors.step2.nextButton);

      // Step 3a: Fill content
      const content = generateTestContent();
      await page.click(documentSelectors.step3a.editor);
      await page.keyboard.type(content);
      await page.click(documentSelectors.step3a.nextButton);

      // Step 3b: Add signature
      const signatureData = generateSignatureData();
      await page.fill(
        documentSelectors.step3b.organizationInput,
        signatureData.organization
      );
      await page.fill(
        documentSelectors.step3b.signerNameInput,
        signatureData.signerName
      );
      await page.fill(
        documentSelectors.step3b.positionInput,
        signatureData.position
      );
      await page.click(documentSelectors.step3b.nextButton);

      // Step 4: Sign document
      await page.click(documentSelectors.step4.signDocumentButton);
    };
    await use(create);
  },

  // Helper to fill document details
  fillDocumentDetails: async ({ page }, use) => {
    const fill = async (title: string, type: string, description: string) => {
      await page.fill(documentSelectors.step1.titleInput, title);
      await page.selectOption(documentSelectors.step1.documentTypeSelect, type);
      await page.fill(documentSelectors.step1.descriptionTextarea, description);
    };
    await use(fill);
  },

  // Helper to fill document content
  fillDocumentContent: async ({ page }, use) => {
    const fill = async (content: string) => {
      await page.click(documentSelectors.step3a.editor);
      await page.keyboard.type(content);
    };
    await use(fill);
  },

  // Helper to add signature
  addSignature: async ({ page }, use) => {
    const add = async () => {
      const signatureData = generateSignatureData();
      await page.fill(
        documentSelectors.step3b.organizationInput,
        signatureData.organization
      );
      await page.fill(
        documentSelectors.step3b.signerNameInput,
        signatureData.signerName
      );
      await page.fill(
        documentSelectors.step3b.positionInput,
        signatureData.position
      );
    };
    await use(add);
  },

  // Helper to sign document
  signDocument: async ({ page }, use) => {
    const sign = async () => {
      await page.click(documentSelectors.step4.signDocumentButton);
    };
    await use(sign);
  },
});
