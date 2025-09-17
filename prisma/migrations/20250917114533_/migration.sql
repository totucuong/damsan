/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_fileId_fkey";

-- DropTable
DROP TABLE "public"."Document";

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "fileId" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_fileId_key" ON "public"."documents"("fileId");

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
