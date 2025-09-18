/*
  Warnings:

  - The primary key for the `document_chunks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `embedding` on the `files` table. All the data in the column will be lost.
  - Made the column `fileId` on table `document_chunks` required. This step will fail if there are existing NULL values in that column.
  - Made the column `embedding` on table `document_chunks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."document_chunks_embedding_ivfflat";

-- DropIndex
DROP INDEX "public"."document_chunks_user_created_idx";

-- AlterTable
ALTER TABLE "public"."document_chunks" DROP CONSTRAINT "document_chunks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "fileId" SET NOT NULL,
ALTER COLUMN "embedding" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."files" DROP COLUMN "embedding";

-- CreateIndex
CREATE INDEX "document_chunks_userId_createdAt_idx" ON "public"."document_chunks"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."document_chunks" ADD CONSTRAINT "document_chunks_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
