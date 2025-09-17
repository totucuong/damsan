-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "fileId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_fileId_key" ON "public"."Document"("fileId");

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
