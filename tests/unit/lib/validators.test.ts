import { describe, it, expect } from "vitest";
import {
  Step1FormSchema,
  Step3aFormSchema,
  Step3bFormSchema,
  SignaturePositionSchema,
  FileUploadSchema,
  EmailSchema,
  PasswordSchema,
  NameSchema,
  LoginFormSchema,
  SignupFormSchema,
} from "@/lib/validators";

describe("Step1FormSchema", () => {
  it("accepts valid title and document type", () => {
    const result = Step1FormSchema.safeParse({
      title: "Test Document",
      description: "A test description",
      documentType: "contract",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = Step1FormSchema.safeParse({
      title: "",
      description: "A test description",
      documentType: "contract",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 200 characters", () => {
    const result = Step1FormSchema.safeParse({
      title: "a".repeat(201),
      description: "A test description",
      documentType: "contract",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional description", () => {
    const result = Step1FormSchema.safeParse({
      title: "Test Document",
      documentType: "contract",
    });
    expect(result.success).toBe(true);
  });
});

describe("Step3aFormSchema", () => {
  it("accepts valid HTML content", () => {
    const result = Step3aFormSchema.safeParse({
      html: "<p>This is content</p>",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty HTML", () => {
    const result = Step3aFormSchema.safeParse({
      html: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("Step3bFormSchema", () => {
  it("accepts valid signature data", () => {
    const result = Step3bFormSchema.safeParse({
      organization: "Test Org",
      signerName: "John Doe",
      position: "Manager",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty organization", () => {
    const result = Step3bFormSchema.safeParse({
      organization: "",
      signerName: "John Doe",
      position: "Manager",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty signer name", () => {
    const result = Step3bFormSchema.safeParse({
      organization: "Test Org",
      signerName: "",
      position: "Manager",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty position", () => {
    const result = Step3bFormSchema.safeParse({
      organization: "Test Org",
      signerName: "John Doe",
      position: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("SignaturePositionSchema", () => {
  it("accepts valid position", () => {
    const result = SignaturePositionSchema.safeParse({
      x: 100,
      y: 200,
      page: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative x position", () => {
    const result = SignaturePositionSchema.safeParse({
      x: -10,
      y: 200,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative y position", () => {
    const result = SignaturePositionSchema.safeParse({
      x: 100,
      y: -10,
    });
    expect(result.success).toBe(false);
  });
});

describe("EmailSchema", () => {
  it("accepts valid email", () => {
    const result = EmailSchema.safeParse("test@example.com");
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = EmailSchema.safeParse("invalid-email");
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = EmailSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});

describe("PasswordSchema", () => {
  it("accepts valid password", () => {
    const result = PasswordSchema.safeParse("Password123");
    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = PasswordSchema.safeParse("Pass1");
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = PasswordSchema.safeParse("password123");
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase", () => {
    const result = PasswordSchema.safeParse("PASSWORD123");
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = PasswordSchema.safeParse("Password");
    expect(result.success).toBe(false);
  });
});

describe("LoginFormSchema", () => {
  it("accepts valid login data", () => {
    const result = LoginFormSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = LoginFormSchema.safeParse({
      email: "invalid",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("SignupFormSchema", () => {
  it("accepts valid signup data", () => {
    const result = SignupFormSchema.safeParse({
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password123",
      name: "John Doe",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = SignupFormSchema.safeParse({
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password456",
      name: "John Doe",
    });
    expect(result.success).toBe(false);
  });
});
