import { describe, it, expect } from "vitest";
import {
  validateStep1FormData,
  validateStep2FormData,
  validateStep3aFormData,
  validateStep3bFormData,
  type Step1FormData,
  type Step2FormData,
  type Step3aFormData,
  type Step3bFormData,
} from "@/features/document/types";

describe("validateStep1FormData", () => {
  it("returns true for valid title", () => {
    const data: Step1FormData = {
      title: "Test Document",
      documentType: "contract",
      description: "A test description",
    };
    expect(validateStep1FormData(data)).toBe(true);
  });

  it("returns false for empty title", () => {
    const data: Step1FormData = {
      title: "",
      documentType: "contract",
      description: "A test description",
    };
    expect(validateStep1FormData(data)).toBe(false);
  });

  it("returns false for whitespace-only title", () => {
    const data: Step1FormData = {
      title: "   ",
      documentType: "contract",
      description: "A test description",
    };
    expect(validateStep1FormData(data)).toBe(false);
  });

  it("returns true for title with leading/trailing spaces", () => {
    const data: Step1FormData = {
      title: "  Test Document  ",
      documentType: "contract",
      description: "A test description",
    };
    expect(validateStep1FormData(data)).toBe(true);
  });
});

describe("validateStep2FormData", () => {
  it("returns true for upload mode with file", () => {
    const data: Step2FormData = {
      uploadMode: "upload",
      uploadedFile: new File(["content"], "test.pdf", {
        type: "application/pdf",
      }),
    };
    expect(validateStep2FormData(data)).toBe(true);
  });

  it("returns false for upload mode without file", () => {
    const data: Step2FormData = {
      uploadMode: "upload",
      uploadedFile: null,
    };
    expect(validateStep2FormData(data)).toBe(false);
  });

  it("returns true for create mode without file", () => {
    const data: Step2FormData = {
      uploadMode: "create",
      uploadedFile: null,
    };
    expect(validateStep2FormData(data)).toBe(true);
  });

  it("returns true for create mode with file", () => {
    const data: Step2FormData = {
      uploadMode: "create",
      uploadedFile: new File(["content"], "test.pdf", {
        type: "application/pdf",
      }),
    };
    expect(validateStep2FormData(data)).toBe(true);
  });
});

describe("validateStep3aFormData", () => {
  it("returns true for HTML with text content", () => {
    const data: Step3aFormData = {
      html: "<p>This is content</p>",
    };
    expect(validateStep3aFormData(data)).toBe(true);
  });

  it("returns false for empty HTML string", () => {
    const data: Step3aFormData = {
      html: "",
    };
    expect(validateStep3aFormData(data)).toBe(false);
  });

  it("returns false for HTML with only tags", () => {
    const data: Step3aFormData = {
      html: "<div><p></p></div>",
    };
    expect(validateStep3aFormData(data)).toBe(false);
  });

  it("returns true for HTML with multiple elements", () => {
    const data: Step3aFormData = {
      html: "<h1>Title</h1><p>Content</p><ul><li>Item</li></ul>",
    };
    expect(validateStep3aFormData(data)).toBe(true);
  });

  it("returns false for null HTML", () => {
    const data = { html: null } as unknown as Step3aFormData;
    expect(validateStep3aFormData(data)).toBe(false);
  });

  it("returns false for undefined HTML", () => {
    const data = { html: undefined } as unknown as Step3aFormData;
    expect(validateStep3aFormData(data)).toBe(false);
  });

  it("returns false for non-string HTML", () => {
    const data = { html: {} } as unknown as Step3aFormData;
    expect(validateStep3aFormData(data)).toBe(false);
  });
});

describe("validateStep3bFormData", () => {
  it("returns true for all fields filled", () => {
    const data: Step3bFormData = {
      organization: "Test Org",
      signerName: "John Doe",
      position: "Manager",
    };
    expect(validateStep3bFormData(data)).toBe(true);
  });

  it("returns false for empty organization", () => {
    const data: Step3bFormData = {
      organization: "",
      signerName: "John Doe",
      position: "Manager",
    };
    expect(validateStep3bFormData(data)).toBe(false);
  });

  it("returns false for empty signer name", () => {
    const data: Step3bFormData = {
      organization: "Test Org",
      signerName: "",
      position: "Manager",
    };
    expect(validateStep3bFormData(data)).toBe(false);
  });

  it("returns false for empty position", () => {
    const data: Step3bFormData = {
      organization: "Test Org",
      signerName: "John Doe",
      position: "",
    };
    expect(validateStep3bFormData(data)).toBe(false);
  });

  it("returns false for whitespace-only organization", () => {
    const data: Step3bFormData = {
      organization: "   ",
      signerName: "John Doe",
      position: "Manager",
    };
    expect(validateStep3bFormData(data)).toBe(false);
  });

  it("returns false for whitespace-only signer name", () => {
    const data: Step3bFormData = {
      organization: "Test Org",
      signerName: "   ",
      position: "Manager",
    };
    expect(validateStep3bFormData(data)).toBe(false);
  });

  it("returns false for whitespace-only position", () => {
    const data: Step3bFormData = {
      organization: "Test Org",
      signerName: "John Doe",
      position: "   ",
    };
    expect(validateStep3bFormData(data)).toBe(false);
  });
});
