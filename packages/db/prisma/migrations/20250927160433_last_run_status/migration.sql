/*
  Warnings:

  - The `lastRunStatus` column on the `Workflow` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."TaskType" AS ENUM ('LAUNCH_BROWSER', 'PAGE_TO_HTML', 'EXTRACT_TEXT_FROM_ELEMENT');

-- AlterTable
ALTER TABLE "public"."Workflow" DROP COLUMN "lastRunStatus",
ADD COLUMN     "lastRunStatus" "public"."WorkflowExecutionStatus";
