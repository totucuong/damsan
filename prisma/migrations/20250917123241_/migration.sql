/*
  Warnings:

  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_fileId_fkey";

-- AlterTable
ALTER TABLE "public"."files" ADD COLUMN     "content" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "embedding" DOUBLE PRECISION[],
ADD COLUMN     "metadata" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "public"."documents";
