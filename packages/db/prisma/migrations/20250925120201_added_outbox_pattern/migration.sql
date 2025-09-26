/*
  Warnings:

  - You are about to drop the column `node` on the `ExecutionPhase` table. All the data in the column will be lost.
  - The `status` column on the `ExecutionPhase` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `trigger` column on the `WorkflowExecution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `WorkflowExecution` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `data` to the `ExecutionPhase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."WorkflowExecutionType" AS ENUM ('MANUAL', 'SCHEDULED', 'TRIGGERED');

-- CreateEnum
CREATE TYPE "public"."WorkflowExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."ExecutionPhaseStatus" AS ENUM ('CREATED', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "public"."DiscordWebhook" DROP CONSTRAINT "DiscordWebhook_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExecutionLog" DROP CONSTRAINT "ExecutionLog_executionPhaseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExecutionPhase" DROP CONSTRAINT "ExecutionPhase_workflowExecutionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notion" DROP CONSTRAINT "Notion_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Slack" DROP CONSTRAINT "Slack_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Workflow" DROP CONSTRAINT "Workflow_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkflowExecution" DROP CONSTRAINT "WorkflowExecution_workflowId_fkey";

-- AlterTable
ALTER TABLE "public"."ExecutionPhase" DROP COLUMN "node",
ADD COLUMN     "data" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."ExecutionPhaseStatus" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "public"."WorkflowExecution" DROP COLUMN "trigger",
ADD COLUMN     "trigger" "public"."WorkflowExecutionType" NOT NULL DEFAULT 'MANUAL',
DROP COLUMN "status",
ADD COLUMN     "status" "public"."WorkflowExecutionStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "public"."ExecutionOutbox" (
    "id" TEXT NOT NULL,
    "workflowExecId" TEXT NOT NULL,

    CONSTRAINT "ExecutionOutbox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionPhase" ADD CONSTRAINT "ExecutionPhase_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "public"."WorkflowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionOutbox" ADD CONSTRAINT "ExecutionOutbox_workflowExecId_fkey" FOREIGN KEY ("workflowExecId") REFERENCES "public"."WorkflowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionLog" ADD CONSTRAINT "ExecutionLog_executionPhaseId_fkey" FOREIGN KEY ("executionPhaseId") REFERENCES "public"."ExecutionPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscordWebhook" ADD CONSTRAINT "DiscordWebhook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Slack" ADD CONSTRAINT "Slack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notion" ADD CONSTRAINT "Notion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
