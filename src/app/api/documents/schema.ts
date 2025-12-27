import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  documentType: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
