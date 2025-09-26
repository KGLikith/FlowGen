/*
  Warnings:

  - A unique constraint covering the columns `[taskInfoId]` on the table `AvailableAction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taskInfoId]` on the table `AvailableTrigger` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."TaskParam" DROP CONSTRAINT "TaskParam_taskInfoIdInput_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskParam" DROP CONSTRAINT "TaskParam_taskInfoIdOutput_fkey";

-- AlterTable
ALTER TABLE "public"."TaskParam" ALTER COLUMN "taskInfoIdInput" DROP NOT NULL,
ALTER COLUMN "taskInfoIdOutput" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AvailableAction_taskInfoId_key" ON "public"."AvailableAction"("taskInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTrigger_taskInfoId_key" ON "public"."AvailableTrigger"("taskInfoId");

-- AddForeignKey
ALTER TABLE "public"."TaskParam" ADD CONSTRAINT "TaskParam_taskInfoIdInput_fkey" FOREIGN KEY ("taskInfoIdInput") REFERENCES "public"."TaskInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskParam" ADD CONSTRAINT "TaskParam_taskInfoIdOutput_fkey" FOREIGN KEY ("taskInfoIdOutput") REFERENCES "public"."TaskInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
