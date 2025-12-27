/*
  Warnings:

  - You are about to drop the column `content_json` on the `document_contents` table. All the data in the column will be lost.
  - You are about to drop the column `preview_pdf_path` on the `document_contents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[current_pdf_id]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - Made the column `html_content` on table `document_contents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "document_contents" DROP COLUMN "content_json",
DROP COLUMN "preview_pdf_path",
ALTER COLUMN "html_content" SET NOT NULL;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "current_pdf_id" UUID;

-- AlterTable
ALTER TABLE "signatures" ADD COLUMN     "document_pdf_id" UUID;

-- CreateTable
CREATE TABLE "document_pdfs" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "pdf_path" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "page_count" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ready',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_pdfs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "document_pdfs_document_id_idx" ON "document_pdfs"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_current_pdf_id_key" ON "documents"("current_pdf_id");

-- CreateIndex
CREATE INDEX "signatures_document_pdf_id_idx" ON "signatures"("document_pdf_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_current_pdf_id_fkey" FOREIGN KEY ("current_pdf_id") REFERENCES "document_pdfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_pdfs" ADD CONSTRAINT "document_pdfs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signatures" ADD CONSTRAINT "signatures_document_pdf_id_fkey" FOREIGN KEY ("document_pdf_id") REFERENCES "document_pdfs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
