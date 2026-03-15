/*
  Warnings:

  - You are about to drop the column `createdById` on the `Project` table. All the data in the column will be lost.
  - Added the required column `handlerId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_createdById_fkey";

-- DropIndex
DROP INDEX "Project_createdById_idx";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createdById",
ADD COLUMN     "handlerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Project_handlerId_idx" ON "Project"("handlerId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
