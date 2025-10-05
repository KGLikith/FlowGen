/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Credential` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ActionKey" ADD VALUE 'READ_PROPERTY_FROM_JSON';

-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'READ_PROPERTY_FROM_JSON';

-- CreateIndex
CREATE UNIQUE INDEX "Credential_name_key" ON "Credential"("name");
