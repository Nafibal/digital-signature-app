/*
  Warnings:

  - You are about to drop the `document_drafts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[signed_pdf_id]` on the table `documents` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "document_drafts" DROP CONSTRAINT "document_drafts_document_id_fkey";

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "signed_pdf_id" UUID;

-- DropTable
DROP TABLE "document_drafts";

-- CreateIndex
CREATE UNIQUE INDEX "documents_signed_pdf_id_key" ON "documents"("signed_pdf_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_signed_pdf_id_fkey" FOREIGN KEY ("signed_pdf_id") REFERENCES "document_pdfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
