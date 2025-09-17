/*
  Warnings:

  - The `status` column on the `Workflow` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."WorkflowStatus" AS ENUM ('ACTIVE', 'DRAFT');

-- AlterTable
ALTER TABLE "public"."Workflow" DROP COLUMN "status",
ADD COLUMN     "status" "public"."WorkflowStatus" NOT NULL DEFAULT 'DRAFT';
