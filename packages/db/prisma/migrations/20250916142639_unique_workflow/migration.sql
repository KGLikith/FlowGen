/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Workflow` will be added. If there are existing duplicate values, this will fail.
  - Made the column `definition` on table `Workflow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Workflow" ALTER COLUMN "definition" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_userId_name_key" ON "public"."Workflow"("userId", "name");
