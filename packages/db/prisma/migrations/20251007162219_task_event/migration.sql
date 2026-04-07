/*
  Warnings:

  - Changed the type of `type` on the `Connections` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TPConnections" AS ENUM ('NONE', 'SLACK', 'DISCORD', 'NOTION', 'GOOGLE_DOCS');

-- CreateEnum
CREATE TYPE "TaskEventEnum" AS ENUM ('CATCH_HOOK', 'CATCH_RAW_HOOK', 'RETRIEVE_POOL');

-- AlterEnum
ALTER TYPE "ActionKey" ADD VALUE 'SCROLL_TO_ELEMENT';

-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'SCROLL_TO_ELEMENT';

-- AlterTable
ALTER TABLE "Connections" DROP COLUMN "type",
ADD COLUMN     "type" "TPConnections" NOT NULL;

-- AlterTable
ALTER TABLE "TaskInfo" ADD COLUMN     "requiredConnection" "TPConnections" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "testingAvailable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WorkflowExecution" ADD COLUMN     "connectionId" TEXT;

-- CreateTable
CREATE TABLE "TaskEvent" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "event" "TaskEventEnum" NOT NULL,
    "inputs" JSONB NOT NULL,
    "taskInfoId" TEXT,

    CONSTRAINT "TaskEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskEvent" ADD CONSTRAINT "TaskEvent_taskInfoId_fkey" FOREIGN KEY ("taskInfoId") REFERENCES "TaskInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
