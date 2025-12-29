/**
 * Validators
 *
 * Zod schemas for form validation
 */

import { z } from "zod";

// ============================================================================
// Document Validators
// ============================================================================

/**
 * Document type enum
 */
export const DocumentTypeEnum = z.enum([
  "contract",
  "agreement",
  "invoice",
  "letter",
  "report",
  "other",
]);

/**
 * Step 1 form data validator
 */
export const Step1FormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  documentType: DocumentTypeEnum,
});

export type Step1FormData = z.infer<typeof Step1FormSchema>;

// ============================================================================
// Step 3a: Content Validators
// ============================================================================

/**
 * Step 3a form data validator (content)
 */
export const Step3aFormSchema = z.object({
  html: z.string().min(1, "Content is required"),
});

export type Step3aFormData = z.infer<typeof Step3aFormSchema>;

// ============================================================================
// Step 3b: Signature Validators
// ============================================================================

/**
 * Step 3b form data validator (signature)
 */
export const Step3bFormSchema = z.object({
  organization: z
    .string()
    .min(1, "Organization is required")
    .max(200, "Organization must be less than 200 characters"),
  signerName: z
    .string()
    .min(1, "Signer name is required")
    .max(200, "Signer name must be less than 200 characters"),
  position: z
    .string()
    .min(1, "Position is required")
    .max(200, "Position must be less than 200 characters"),
});

export type Step3bFormData = z.infer<typeof Step3bFormSchema>;

// ============================================================================
// Signature Position Validators
// ============================================================================

/**
 * Signature position validator
 */
export const SignaturePositionSchema = z.object({
  x: z.number().min(0, "X position must be non-negative"),
  y: z.number().min(0, "Y position must be non-negative"),
  page: z.number().int().positive().optional(),
});

export type SignaturePosition = z.infer<typeof SignaturePositionSchema>;

// ============================================================================
// File Upload Validators
// ============================================================================

/**
 * File upload validator
 */
export const FileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "File size must be less than 10MB"
    ),
});

export type FileUploadData = z.infer<typeof FileUploadSchema>;

// ============================================================================
// User Validators
// ============================================================================

/**
 * Email validator
 */
export const EmailSchema = z
  .string()
  .email("Invalid email address")
  .min(1, "Email is required")
  .max(255, "Email must be less than 255 characters");

/**
 * Password validator
 */
export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

/**
 * Name validator
 */
export const NameSchema = z
  .string()
  .min(1, "Name is required")
  .max(200, "Name must be less than 200 characters");

/**
 * Login form validator
 */
export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;

/**
 * Signup form validator
 */
export const SignupFormSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    name: NameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof SignupFormSchema>;

/**
 * Profile update validator
 */
export const ProfileUpdateSchema = z.object({
  name: NameSchema.optional(),
  email: EmailSchema.optional(),
  image: z.string().url().optional(),
});

export type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;

// ============================================================================
// API Response Validators
// ============================================================================

/**
 * API error response validator
 */
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * API success response validator
 */
export const ApiSuccessSchema = z.object({
  data: z.unknown(),
  message: z.string().optional(),
});

export type ApiSuccess<T = unknown> = z.infer<typeof ApiSuccessSchema> & {
  data?: T;
};

// ============================================================================
// Pagination Validators
// ============================================================================

/**
 * Pagination params validator
 */
export const PaginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

/**
 * Paginated response validator
 */
export const PaginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type PaginatedResponse<T = unknown> = z.infer<
  typeof PaginatedResponseSchema
> & {
  data: T[];
};
